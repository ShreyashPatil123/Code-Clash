'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

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

/**
 * Combined 3D hero scene with floating code blocks and particle field
 * SSR-safe with dynamic imports
 */
export function HeroScene3D({ className = '' }: HeroScene3DProps) {
    return (
        <div className={`absolute inset-0 -z-10 ${className}`}>
            <Suspense fallback={null}>
                <Canvas3D camera={{ position: [0, 0, 5], fov: 60 }}>
                    <ParticleField count={300} color="#2C666E" size={0.015} />
                    <FloatingCodeBlocks count={6} />
                </Canvas3D>
            </Suspense>
        </div>
    );
}
