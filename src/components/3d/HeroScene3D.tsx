'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect, Component, ReactNode } from 'react';

// Dynamic imports for SSR safety
const Canvas3D = dynamic(
    () => import('./Canvas3D').then((mod) => mod.Canvas3D),
    { ssr: false }
);

const FloatingCodeBlocks = dynamic(
    () => import('./FloatingCodeBlocks').then((mod) => mod.FloatingCodeBlocks),
    { ssr: false }
);

const ParticleField = dynamic(
    () => import('./ParticleField').then((mod) => mod.ParticleField),
    { ssr: false }
);

interface HeroScene3DProps {
    className?: string;
}

// Error boundary for 3D scene
class Scene3DErrorBoundary extends Component<
    { children: ReactNode; fallback: ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: ReactNode; fallback: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        console.warn('3D Scene error (falling back to static):', error.message);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

// Static fallback gradient background
function StaticFallback() {
    return (
        <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2C666E]/20 via-[#0A0A0B] to-[#10B981]/10" />
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#2C666E]/10 blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#10B981]/10 blur-3xl animate-pulse" />
        </div>
    );
}

/**
 * Combined 3D hero scene with floating code blocks and particle field
 * SSR-safe with dynamic imports and error boundary
 */
export function HeroScene3D({ className = '' }: HeroScene3DProps) {
    const [mounted, setMounted] = useState(false);
    const [webGLSupported, setWebGLSupported] = useState(true);

    useEffect(() => {
        setMounted(true);

        // Check WebGL support
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                setWebGLSupported(false);
            }
        } catch {
            setWebGLSupported(false);
        }
    }, []);

    // Show static fallback if not mounted, no WebGL, or on mobile
    if (!mounted || !webGLSupported) {
        return <StaticFallback />;
    }

    return (
        <div className={`absolute inset-0 -z-10 ${className}`}>
            <Scene3DErrorBoundary fallback={<StaticFallback />}>
                <Suspense fallback={<StaticFallback />}>
                    <Canvas3D camera={{ position: [0, 0, 5], fov: 60 }}>
                        <ParticleField count={300} color="#2C666E" size={0.015} />
                        <FloatingCodeBlocks count={6} />
                    </Canvas3D>
                </Suspense>
            </Scene3DErrorBoundary>
        </div>
    );
}
