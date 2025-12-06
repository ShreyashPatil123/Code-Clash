'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
    count?: number;
    size?: number;
    color?: string;
    speed?: number;
}

export function ParticleField({
    count = 500,
    size = 0.02,
    color = '#2C666E',
    speed = 0.1,
}: ParticleFieldProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const geometryRef = useRef<THREE.BufferGeometry>(null);

    const { positions, velocities } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Spread particles in a sphere
            const radius = 5 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi) - 5;

            // Random velocities
            velocities[i3] = (Math.random() - 0.5) * speed;
            velocities[i3 + 1] = (Math.random() - 0.5) * speed;
            velocities[i3 + 2] = (Math.random() - 0.5) * speed;
        }

        return { positions, velocities };
    }, [count, speed]);

    useEffect(() => {
        if (geometryRef.current) {
            geometryRef.current.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3)
            );
        }
    }, [positions]);

    useFrame(() => {
        if (pointsRef.current && geometryRef.current) {
            const positionAttr = geometryRef.current.attributes.position;
            if (positionAttr) {
                const positionArray = positionAttr.array as Float32Array;

                for (let i = 0; i < count; i++) {
                    const i3 = i * 3;

                    // Update positions
                    positionArray[i3] += velocities[i3] * 0.1;
                    positionArray[i3 + 1] += velocities[i3 + 1] * 0.1;
                    positionArray[i3 + 2] += velocities[i3 + 2] * 0.1;

                    // Boundary check - reset if too far
                    const distance = Math.sqrt(
                        positionArray[i3] ** 2 +
                        positionArray[i3 + 1] ** 2 +
                        (positionArray[i3 + 2] + 5) ** 2
                    );

                    if (distance > 15) {
                        // Reset to random position
                        const radius = 3 + Math.random() * 2;
                        const theta = Math.random() * Math.PI * 2;
                        const phi = Math.acos(2 * Math.random() - 1);

                        positionArray[i3] = radius * Math.sin(phi) * Math.cos(theta);
                        positionArray[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                        positionArray[i3 + 2] = radius * Math.cos(phi) - 5;
                    }
                }

                positionAttr.needsUpdate = true;
            }
            pointsRef.current.rotation.y += 0.0005;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry ref={geometryRef} />
            <pointsMaterial
                size={size}
                color={color}
                transparent
                opacity={0.6}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}
