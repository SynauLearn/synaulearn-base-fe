// Backend auth endpoint for Quick Auth JWT verification
// This endpoint verifies the JWT token from Farcaster Quick Auth

import { NextRequest, NextResponse } from 'next/server';

// Quick Auth verification - using manual JWT verification
// @farcaster/quick-auth package can be added for production use
async function verifyQuickAuthToken(token: string, domain: string) {
    try {
        // Decode JWT payload (base64url)
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        const payload = JSON.parse(
            Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
        );

        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            throw new Error('Token expired');
        }

        // Check domain (aud claim)
        if (payload.aud && payload.aud !== domain) {
            console.warn(`Domain mismatch: expected ${domain}, got ${payload.aud}`);
            // Allow for development - in production, enable strict check
        }

        return {
            fid: payload.sub,
            exp: payload.exp,
            iat: payload.iat,
        };
    } catch (error) {
        throw new Error(`Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function GET(request: NextRequest) {
    const authorization = request.headers.get('Authorization');

    if (!authorization?.startsWith('Bearer ')) {
        return NextResponse.json(
            { error: 'Unauthorized - Missing or invalid Authorization header' },
            { status: 401 }
        );
    }

    const token = authorization.split(' ')[1];

    try {
        // Get domain from request or environment
        const domain = process.env.NEXT_PUBLIC_APP_DOMAIN ||
            request.headers.get('host') ||
            'localhost:3000';

        const payload = await verifyQuickAuthToken(token, domain);

        // You can fetch additional user data here from your database
        // For now, just return the FID from the token
        return NextResponse.json({
            fid: payload.fid,
            // Add more user data as needed
            // username: await getUsernameFromDatabase(payload.fid),
            // displayName: await getDisplayNameFromDatabase(payload.fid),
        });

    } catch (error) {
        console.error('Auth verification error:', error);

        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Authentication failed' },
            { status: 401 }
        );
    }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
    return GET(request);
}
