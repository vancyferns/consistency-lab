'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Flame, BookOpen, Target, Star, Lock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Quest {
    id: string
    title: string
    description: string
    xpReward: number
    icon: React.ReactNode
    progress: number
    target: number
    completed: boolean
    locked: boolean
}

interface QuestModalProps {
    isOpen: boolean
    onClose: () => void
    stats: {
        level: number
        xp: number
        streak: number
        total_videos: number
    } | null
}

export default function QuestModal({ isOpen, onClose, stats }: QuestModalProps) {
    const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly' | 'achievements'>('daily')

    // Generate quests based on user stats
    const dailyQuests: Quest[] = [
        {
            id: 'daily-1',
            title: 'First Steps',
            description: 'Complete 1 video today',
            xpReward: 50,
            icon: <BookOpen className="w-5 h-5" />,
            progress: Math.min(stats?.total_videos || 0, 1),
            target: 1,
            completed: (stats?.total_videos || 0) >= 1,
            locked: false
        },
        {
            id: 'daily-2',
            title: 'On Fire!',
            description: 'Maintain your learning streak',
            xpReward: 100,
            icon: <Flame className="w-5 h-5" />,
            progress: stats?.streak || 0,
            target: 1,
            completed: (stats?.streak || 0) >= 1,
            locked: false
        },
        {
            id: 'daily-3',
            title: 'Triple Threat',
            description: 'Complete 3 videos in one day',
            xpReward: 150,
            icon: <Target className="w-5 h-5" />,
            progress: 0,
            target: 3,
            completed: false,
            locked: (stats?.level || 1) < 2
        }
    ]

    const achievements: Quest[] = [
        {
            id: 'ach-1',
            title: 'Beginner Scholar',
            description: 'Complete your first video',
            xpReward: 100,
            icon: <Star className="w-5 h-5" />,
            progress: Math.min(stats?.total_videos || 0, 1),
            target: 1,
            completed: (stats?.total_videos || 0) >= 1,
            locked: false
        },
        {
            id: 'ach-2',
            title: 'Dedicated Learner',
            description: 'Complete 10 videos total',
            xpReward: 500,
            icon: <Trophy className="w-5 h-5" />,
            progress: Math.min(stats?.total_videos || 0, 10),
            target: 10,
            completed: (stats?.total_videos || 0) >= 10,
            locked: false
        },
        {
            id: 'ach-3',
            title: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            xpReward: 1000,
            icon: <Flame className="w-5 h-5" />,
            progress: Math.min(stats?.streak || 0, 7),
            target: 7,
            completed: (stats?.streak || 0) >= 7,
            locked: false
        },
        {
            id: 'ach-4',
            title: 'Master Scholar',
            description: 'Reach Level 10',
            xpReward: 2000,
            icon: <Star className="w-5 h-5" />,
            progress: Math.min(stats?.level || 1, 10),
            target: 10,
            completed: (stats?.level || 1) >= 10,
            locked: false
        }
    ]

    const currentQuests = selectedTab === 'achievements' ? achievements : dailyQuests

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-gradient-to-b from-amber-900 to-stone-900 rounded-lg border-4 border-amber-700 shadow-2xl overflow-hidden"
                        style={{
                            boxShadow: '0 0 0 2px #78350f, 0 0 0 4px #451a03, 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            imageRendering: 'pixelated'
                        }}
                    >
                        {/* Header - Minecraft Style */}
                        <div className="bg-gradient-to-r from-amber-800 to-amber-700 px-4 py-3 border-b-4 border-amber-950 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-amber-100 tracking-wide flex items-center gap-2" style={{ fontFamily: 'monospace' }}>
                                📜 QUEST LOG
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-amber-600 rounded transition-colors"
                            >
                                <X className="w-5 h-5 text-amber-200" />
                            </button>
                        </div>

                        {/* Tabs - Inventory Style */}
                        <div className="flex border-b-2 border-amber-800 bg-stone-800">
                            {(['daily', 'weekly', 'achievements'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`flex-1 py-2 px-4 text-sm font-bold uppercase tracking-wider transition-all ${selectedTab === tab
                                            ? 'bg-amber-700 text-amber-100 border-b-2 border-amber-400'
                                            : 'text-stone-400 hover:text-stone-200 hover:bg-stone-700'
                                        }`}
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Quest List - Inventory Slots */}
                        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                            {currentQuests.map((quest, idx) => (
                                <motion.div
                                    key={quest.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`relative p-3 rounded border-2 transition-all ${quest.completed
                                            ? 'bg-green-900/50 border-green-600'
                                            : quest.locked
                                                ? 'bg-stone-800/50 border-stone-600 opacity-60'
                                                : 'bg-stone-800 border-amber-700 hover:border-amber-500'
                                        }`}
                                    style={{
                                        boxShadow: quest.completed ? '0 0 10px rgba(34, 197, 94, 0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.3)'
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon Slot */}
                                        <div className={`w-10 h-10 rounded border-2 flex items-center justify-center flex-shrink-0 ${quest.completed
                                                ? 'bg-green-800 border-green-500 text-green-300'
                                                : quest.locked
                                                    ? 'bg-stone-700 border-stone-500 text-stone-400'
                                                    : 'bg-amber-800 border-amber-600 text-amber-300'
                                            }`}>
                                            {quest.locked ? <Lock className="w-5 h-5" /> : quest.completed ? <CheckCircle className="w-5 h-5" /> : quest.icon}
                                        </div>

                                        {/* Quest Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-bold text-amber-100 text-sm" style={{ fontFamily: 'monospace' }}>
                                                    {quest.title}
                                                </h3>
                                                <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                                                    ⭐ +{quest.xpReward} XP
                                                </span>
                                            </div>
                                            <p className="text-xs text-stone-400 mb-2">{quest.description}</p>

                                            {/* Progress Bar - Minecraft Style */}
                                            <div className="relative h-3 bg-stone-900 rounded border border-stone-600 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                    className={`h-full ${quest.completed ? 'bg-green-500' : 'bg-amber-500'}`}
                                                    style={{
                                                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)'
                                                    }}
                                                />
                                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-lg">
                                                    {quest.progress}/{quest.target}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Locked Overlay */}
                                    {quest.locked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
                                            <span className="text-xs text-stone-400 font-bold" style={{ fontFamily: 'monospace' }}>
                                                🔒 Unlock at Level 2
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-stone-900 border-t-2 border-amber-800 flex justify-between items-center">
                            <div className="text-sm text-stone-400" style={{ fontFamily: 'monospace' }}>
                                Complete quests to earn XP!
                            </div>
                            <Button
                                onClick={onClose}
                                className="bg-amber-700 hover:bg-amber-600 text-amber-100 border-2 border-amber-500 font-bold"
                                style={{ fontFamily: 'monospace' }}
                            >
                                CLOSE
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
