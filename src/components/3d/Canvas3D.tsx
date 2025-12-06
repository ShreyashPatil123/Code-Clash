'use client';

import { Suspense, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import useMeasure from 'react-use-measure';

interface Canvas3DProps {
    children: ReactNode;
    className?: string;
    camera?: {
        position?: [number, number, number];
        fov?: number;
    };
    fallback?: ReactNode;
}

/**
 * SSR-safe 3D Canvas wrapper
 * - Responsive sizing with react-use-measure
 * - Suspense-enabled with customizable fallback
 * - Works alongside Lenis smooth scroll
 */
export function Canvas3D({
    children,
    className = '',
    camera = { position: [0, 0, 5], fov: 75 },
    fallback = null,
}: Canvas3DProps) {
    const [ref, bounds] = useMeasure();

    return (
        <div ref={ref} className={`w-full h-full ${className}`}>
            {bounds.width > 0 && (
                <Canvas
                    camera={{
                        position: camera.position,
                        fov: camera.fov,
                        near: 0.1,
                        far: 1000,
                    }}
                    dpr={[1, 2]}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance',
                    }}
                    style={{
                        width: bounds.width,
                        height: bounds.height,
                    }}
                >
                    <Suspense fallback={fallback}>
                        {children}
                        <Preload all />
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
}
