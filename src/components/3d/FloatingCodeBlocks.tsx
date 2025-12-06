'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface CodeBlockProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    color?: string;
    speed?: number;
}

function CodeBlock({ position, rotation = [0, 0, 0], color = '#2C666E', speed = 1 }: CodeBlockProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.001 * speed;
            meshRef.current.rotation.y += 0.002 * speed;
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.001;
        }
    });

    return (
        <Float
            speed={speed}
            rotationIntensity={0.5}
            floatIntensity={0.5}
            floatingRange={[-0.1, 0.1]}
        >
            <mesh ref={meshRef} position={position} rotation={rotation}>
                <boxGeometry args={[0.8, 0.5, 0.1]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.3}
                    roughness={0.4}
                    transparent
                    opacity={0.9}
                />
            </mesh>
            {/* Code lines indicator */}
            {[0, 1, 2].map((i) => (
                <mesh key={i} position={[position[0] - 0.25 + i * 0.25, position[1], position[2] + 0.06]}>
                    <boxGeometry args={[0.15, 0.03, 0.01]} />
                    <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.3} />
                </mesh>
            ))}
        </Float>
    );
}

interface FloatingCodeBlocksProps {
    count?: number;
}

export function FloatingCodeBlocks({ count = 8 }: FloatingCodeBlocksProps) {
    const blocks = useMemo(() => {
        const items = [];
        const colors = ['#2C666E', '#10B981', '#3B82F6', '#8B5CF6'];

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = 2 + Math.random() * 1.5;
            items.push({
                position: [
                    Math.cos(angle) * radius,
                    (Math.random() - 0.5) * 2,
                    Math.sin(angle) * radius - 2,
                ] as [number, number, number],
                rotation: [
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                ] as [number, number, number],
                color: colors[i % colors.length],
                speed: 0.5 + Math.random() * 0.5,
            });
        }
        return items;
    }, [count]);

    return (
        <group>
            {/* Ambient lighting */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#2C666E" />

            {/* Code blocks */}
            {blocks.map((block, i) => (
                <CodeBlock key={i} {...block} />
            ))}
        </group>
    );
}
