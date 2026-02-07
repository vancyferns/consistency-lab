'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
    type: 'orb' | 'star' | 'diamond'
}

export default function AnimatedBackground() {
    const [particles, setParticles] = useState<Particle[]>([])

    useEffect(() => {
        // Generate particles
        const generated: Particle[] = []
        for (let i = 0; i < 20; i++) {
            generated.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 8 + 4,
                duration: Math.random() * 20 + 15,
                delay: Math.random() * 5,
                type: ['orb', 'star', 'diamond'][Math.floor(Math.random() * 3)] as Particle['type']
            })
        }
        setParticles(generated)
    }, [])

    const getEmoji = (type: Particle['type']) => {
        switch (type) {
            case 'star': return '✨'
            case 'diamond': return '💎'
            default: return '⭐'
        }
    }

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Base gradient - Dark stone theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-stone-100 to-slate-200 dark:from-stone-950 dark:via-slate-950 dark:to-stone-900 transition-colors duration-500" />

            {/* Grid overlay - Minecraft crafting grid style */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Floating particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute text-amber-400/30 dark:text-amber-500/20"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        fontSize: `${particle.size}px`
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {getEmoji(particle.type)}
                </motion.div>
            ))}

            {/* Ambient glow orbs */}
            <motion.div
                className="absolute w-96 h-96 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
                    left: '10%',
                    top: '20%',
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute w-80 h-80 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
                    right: '5%',
                    bottom: '10%',
                }}
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Vignette effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)'
                }}
            />
        </div>
    )
}
