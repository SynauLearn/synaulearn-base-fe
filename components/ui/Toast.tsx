import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
    }[type];

    // Render to body using portal to ensure it's on top of everything (including overlays)
    // Check if document is defined (client-side)
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] min-w-[300px] max-w-[90vw] 
      flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white font-medium
      transition-all duration-300 ease-in-out transform
      ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
      ${bgColor} border border-white/10 backdrop-blur-md`}
            role="alert"
        >
            {type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
            {type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
            {type === 'info' && <Info className="w-5 h-5 shrink-0" />}

            <p className="flex-1 text-sm">{message}</p>

            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>,
        document.body
    );
}

// Simple hook for managing toast state locally
export function useToast() {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => setToast(null);

    const ToastComponent = toast ? (
        <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
        />
    ) : null;

    return { showToast, ToastComponent };
}
