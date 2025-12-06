'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleFilled } from '@ant-design/icons';

interface SuccessAnimationProps {
    show: boolean;
    message?: string;
    duration?: number;
    onComplete?: () => void;
    className?: string;
}

/**
 * Success animation overlay with confetti effect
 * Shows checkmark with celebration animation
 */
export function SuccessAnimation({
    show,
    message = 'Success!',
    duration = 2000,
    onComplete,
    className = '',
}: SuccessAnimationProps) {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                onComplete?.();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onComplete]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                        {/* Confetti particles */}
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: ['#10B981', '#2C666E', '#8B5CF6', '#F59E0B'][i % 4],
                                }}
                                initial={{ x: 0, y: 0, opacity: 1 }}
                                animate={{
                                    x: Math.cos((i / 12) * Math.PI * 2) * 100,
                                    y: Math.sin((i / 12) * Math.PI * 2) * 100,
                                    opacity: 0,
                                    scale: 0,
                                }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.2,
                                    ease: 'easeOut',
                                }}
                            />
                        ))}

                        {/* Success icon */}
                        <motion.div
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg shadow-[#10B981]/30"
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(16, 185, 129, 0.3)',
                                    '0 0 40px rgba(16, 185, 129, 0.5)',
                                    '0 0 20px rgba(16, 185, 129, 0.3)',
                                ],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                            }}
                        >
                            <CheckCircleFilled className="text-5xl text-white" />
                        </motion.div>

                        {/* Message */}
                        <motion.p
                            className="mt-6 text-xl font-semibold text-white"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {message}
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
