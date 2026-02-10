import { NextRequest, NextResponse } from 'next/server';
import { keccak256, encodePacked, Hex, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

/**
 * POST /api/sign-mint
 * 
 * Signs a mint permission for a user who has completed a course.
 * 
 * Request body:
 * {
 *   userAddress: "0x...",
 *   courseId: "convex_course_id_string",
 *   fid: 12345 (optional, for Farcaster users)
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   signature: "0x...",
 *   courseIdNumeric: 10
 * }
 */

// Validate environment
const SIGNER_PRIVATE_KEY = process.env.MINT_SIGNER_PRIVATE_KEY as Hex | undefined;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function POST(request: NextRequest) {
    try {
        // Validate environment variables
        if (!SIGNER_PRIVATE_KEY) {
            console.error('MINT_SIGNER_PRIVATE_KEY not configured');
            return NextResponse.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            );
        }

        if (!CONVEX_URL) {
            console.error('NEXT_PUBLIC_CONVEX_URL not configured');
            return NextResponse.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { userAddress, courseId, fid } = body;

        // Validate required fields
        if (!userAddress || !courseId) {
            return NextResponse.json(
                { success: false, error: 'Missing userAddress or courseId' },
                { status: 400 }
            );
        }

        // Validate address format (basic check)
        if (!userAddress.startsWith('0x') || userAddress.length !== 42) {
            return NextResponse.json(
                { success: false, error: 'Invalid wallet address' },
                { status: 400 }
            );
        }

        // Connect to Convex
        const convex = new ConvexHttpClient(CONVEX_URL);

        // Fetch course to get course_number
        const course = await convex.query(api.courses.get, {
            courseId: courseId as Id<'courses'>,
        });

        if (!course || !course.course_number) {
            return NextResponse.json(
                { success: false, error: 'Course not found or missing course_number' },
                { status: 400 }
            );
        }

        const courseIdNumeric = course.course_number;

        // Find user by FID (preferred when available) or wallet address
        let user;

        if (fid) {
            user = await convex.query(api.users.getByFid, { fid });
        }

        if (!user) {
            user = await convex.query(api.users.getByWallet, {
                wallet_address: userAddress.toLowerCase()
            });
        }

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found. Please connect your wallet first.' },
                { status: 403 }
            );
        }

        // Check course completion using progress percentage
        const progressPercent = await convex.query(api.progress.getCourseProgressPercentage, {
            userId: user._id as Id<'users'>,
            courseId: courseId as Id<'courses'>,
        });

        if (progressPercent < 100) {
            return NextResponse.json(
                { success: false, error: `Course not completed (${progressPercent}% done). Complete all lessons first.` },
                { status: 403 }
            );
        }

        // Check if already minted
        const existingBadge = await convex.query(api.badges.hasMintedBadge, {
            userId: user._id as Id<'users'>,
            courseId: courseId as Id<'courses'>,
        });

        if (existingBadge) {
            return NextResponse.json(
                { success: false, error: 'Badge already minted for this course.' },
                { status: 409 }
            );
        }

        // All checks passed - create signature using viem
        const account = privateKeyToAccount(SIGNER_PRIVATE_KEY);

        // Create message hash (must match contract's keccak256 format)
        const messageHash = keccak256(
            encodePacked(
                ['address', 'uint256'],
                [userAddress as Address, BigInt(courseIdNumeric)]
            )
        );

        // Sign the message (viem automatically adds Ethereum prefix)
        const signature = await account.signMessage({
            message: { raw: messageHash }
        });

        console.log('✅ Mint signature generated for:', {
            user: userAddress,
            courseId: courseIdNumeric,
            signer: account.address,
        });

        return NextResponse.json({
            success: true,
            signature,
            courseIdNumeric,
            signerAddress: account.address, // For debugging
        });

    } catch (error) {
        console.error('Sign mint error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
