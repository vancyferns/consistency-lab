'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Trophy, Flame, Heart, Shield } from 'lucide-react'

interface GamificationStatsProps {
    level: number
    xp: number
    nextLevelXp: number
    streak: number
    totalVideos: number
}

export default function GamificationStats({ level, xp, nextLevelXp, streak, totalVideos }: GamificationStatsProps) {
    const displayProgress = (xp % 500) / 500 * 100
    const currentLevelXp = xp % 500

    const getTitle = (lvl: number) => {
        if (lvl <= 5) return 'Apprentice'
        if (lvl <= 10) return 'Scholar'
        if (lvl <= 20) return 'Expert'
        if (lvl <= 30) return 'Master'
        return 'Grandmaster'
    }

    const getRank = (lvl: number) => {
        if (lvl <= 5) return '⚔️'
        if (lvl <= 10) return '🛡️'
        if (lvl <= 20) return '⚡'
        if (lvl <= 30) return '👑'
        return '🏆'
    }

    // Hearts based on streak (max 10 hearts)
    const hearts = Math.min(streak, 10)

    return (
        <div
            className="rounded-lg border-4 border-stone-600 dark:border-stone-700 overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #44403c 0%, #292524 100%)',
                boxShadow: '0 0 0 2px #1c1917, inset 0 2px 4px rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.4)'
            }}
        >
            {/* Header Bar - Like Minecraft HUD */}
            <div className="bg-gradient-to-r from-stone-700 to-stone-600 px-4 py-2 border-b-2 border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{getRank(level)}</span>
                    <span className="font-bold text-amber-100" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
                        {getTitle(level).toUpperCase()}
                    </span>
                </div>
                <div
                    className="px-3 py-1 rounded border-2 border-green-600 bg-green-900/50 text-green-300 font-bold text-sm"
                    style={{ fontFamily: 'monospace' }}
                >
                    LVL {level}
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* XP Bar - Minecraft Style */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                        <span className="text-amber-300 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> EXPERIENCE
                        </span>
                        <span className="text-green-400">{currentLevelXp} / 500 XP</span>
                    </div>
                    <div
                        className="relative h-5 rounded border-2 border-stone-800 overflow-hidden"
                        style={{
                            background: '#1c1917',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                        }}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${displayProgress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full"
                            style={{
                                background: 'linear-gradient(180deg, #84cc16 0%, #65a30d 50%, #4d7c0f 100%)',
                                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.15) 8px, rgba(0,0,0,0.15) 10px)'
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-white drop-shadow-lg" style={{ fontFamily: 'monospace', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                                {Math.round(displayProgress)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Streak - Hearts */}
                    <div
                        className="p-3 rounded border-2 border-stone-700 text-center"
                        style={{ background: 'linear-gradient(180deg, #44403c 0%, #292524 100%)' }}
                    >
                        <div className="flex justify-center gap-0.5 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`text-lg ${i < Math.ceil(hearts / 2) ? '' : 'opacity-30'}`}
                                >
                                    {i < Math.ceil(hearts / 2) ? '❤️' : '🖤'}
                                </motion.span>
                            ))}
                        </div>
                        <div className="text-xs text-amber-200/80 font-bold" style={{ fontFamily: 'monospace' }}>
                            {streak} DAY STREAK
                        </div>
                    </div>

                    {/* Videos Completed - Trophy */}
                    <div
                        className="p-3 rounded border-2 border-stone-700 text-center"
                        style={{ background: 'linear-gradient(180deg, #44403c 0%, #292524 100%)' }}
                    >
                        <div className="flex justify-center items-center gap-2 mb-1">
                            <motion.span
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                                className="text-2xl"
                            >
                                🏆
                            </motion.span>
                            <span className="text-2xl font-bold text-amber-300" style={{ fontFamily: 'monospace' }}>
                                {totalVideos}
                            </span>
                        </div>
                        <div className="text-xs text-amber-200/80 font-bold" style={{ fontFamily: 'monospace' }}>
                            VIDEOS DONE
                        </div>
                    </div>
                </div>

                {/* Total XP */}
                <div className="text-center pt-2 border-t border-stone-700">
                    <span className="text-xs text-stone-400" style={{ fontFamily: 'monospace' }}>
                        TOTAL XP: <span className="text-amber-400 font-bold">{xp.toLocaleString()}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}
