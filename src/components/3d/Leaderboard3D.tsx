'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface LeaderboardEntry {
    id: string;
    name: string;
    score: number;
    color?: string;
}

interface Leaderboard3DProps {
    entries: LeaderboardEntry[];
    maxScore?: number;
}

function LeaderboardBar({
    entry,
    index,
    maxScore,
    totalEntries,
}: {
    entry: LeaderboardEntry;
    index: number;
    maxScore: number;
    totalEntries: number;
}) {
    const meshRef = useRef<THREE.Group>(null);
    const targetHeight = (entry.score / maxScore) * 3;
    const xPosition = (index - totalEntries / 2 + 0.5) * 1.5;

    const colors = ['#10B981', '#2C666E', '#8B5CF6', '#F59E0B', '#3B82F6'];
    const color = entry.color || colors[index % colors.length];

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle floating animation
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime + index) * 0.05;
        }
    });

    return (
        <group ref={meshRef} position={[xPosition, targetHeight / 2, 0]}>
            {/* Bar */}
            <RoundedBox args={[1, targetHeight, 0.5]} radius={0.1} smoothness={4}>
                <meshStandardMaterial
                    color={color}
                    metalness={0.3}
                    roughness={0.4}
                    transparent
                    opacity={0.9}
                />
            </RoundedBox>

            {/* Rank badge */}
            <group position={[0, targetHeight / 2 + 0.4, 0]}>
                <mesh>
                    <circleGeometry args={[0.25, 32]} />
                    <meshStandardMaterial color={index === 0 ? '#F59E0B' : '#18181B'} />
                </mesh>
                <Text
                    position={[0, 0, 0.01]}
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/inter.woff"
                >
                    {index + 1}
                </Text>
            </group>

            {/* Name label */}
            <Text
                position={[0, -targetHeight / 2 - 0.3, 0]}
                fontSize={0.15}
                color="white"
                anchorX="center"
                anchorY="top"
                maxWidth={1}
                font="/fonts/inter.woff"
            >
                {entry.name}
            </Text>

            {/* Score */}
            <Text
                position={[0, 0, 0.3]}
                fontSize={0.2}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="/fonts/inter.woff"
            >
                {entry.score}
            </Text>
        </group>
    );
}

/**
 * 3D Leaderboard visualization with animated bars
 */
export function Leaderboard3D({ entries, maxScore }: Leaderboard3DProps) {
    const calculatedMaxScore = maxScore || Math.max(...entries.map((e) => e.score), 1);

    return (
        <group>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, 5, -10]} intensity={0.3} color="#2C666E" />

            {/* Base platform */}
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[entries.length * 1.5 + 2, 3]} />
                <meshStandardMaterial color="#18181B" transparent opacity={0.8} />
            </mesh>

            {/* Bars */}
            {entries.slice(0, 5).map((entry, index) => (
                <LeaderboardBar
                    key={entry.id}
                    entry={entry}
                    index={index}
                    maxScore={calculatedMaxScore}
                    totalEntries={Math.min(entries.length, 5)}
                />
            ))}
        </group>
    );
}
