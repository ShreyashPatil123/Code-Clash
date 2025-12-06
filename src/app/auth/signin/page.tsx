'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SignInButton } from '@/components/auth/SignInButton';

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <motion.div
                className="relative z-10 w-full max-w-md px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="glass-card p-8 text-center">
                    {/* Logo */}
                    <Link href="/" className="mb-6 inline-flex items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl text-white font-bold">
                            {'</>'}
                        </div>
                    </Link>

                    <h1 className="mb-2 text-2xl font-bold">Sign in to CodeClash</h1>
                    <p className="mb-8 text-surface/70">
                        Connect with your GitHub account to start competing with friends.
                    </p>

                    <SignInButton fullWidth />

                    <p className="mt-6 text-sm text-surface/50">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>

                <p className="mt-6 text-center text-sm text-surface/50">
                    <Link href="/" className="text-primary hover:text-primary-light">
                        ← Back to home
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
