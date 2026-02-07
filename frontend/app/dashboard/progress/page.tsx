'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Trophy, Flame, Target, Calendar, Clock, TrendingUp, CheckCircle2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import GamificationStats from '@/components/GamificationStats'

export default function ProgressPage() {
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [courses, setCourses] = useState<any[]>([])
    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/')
                return
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

            // Fetch stats
            const statsRes = await fetch(`${apiUrl}/api/progress/stats?user_id=${user.id}`)
            const statsData = await statsRes.json()
            if (statsData.success) {
                setStats(statsData)
            }

            // Fetch courses
            const coursesRes = await fetch(`${apiUrl}/api/progress/courses?user_id=${user.id}`)
            const coursesData = await coursesRes.json()
            if (coursesData.success) {
                setCourses(coursesData.courses || [])
            }

            // Fetch recent activity (logs)
            const logsRes = await fetch(`${apiUrl}/api/progress/logs?user_id=${user.id}&limit=10`)
            const logsData = await logsRes.json()
            if (logsData.success) {
                setRecentActivity(logsData.logs || [])
            }

        } catch (e) {
            console.error('Failed to fetch progress data:', e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-5xl"
                >
                    ⚔️
                </motion.div>
                <p className="text-amber-100" style={{ fontFamily: 'monospace' }}>LOADING STATS...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div
                className="border-b-4 border-stone-700 mb-8"
                style={{
                    background: 'linear-gradient(180deg, #44403c 0%, #292524 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                }}
            >
                <div className="container mx-auto px-4 py-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-3xl font-bold text-amber-100 flex items-center gap-3"
                        style={{ fontFamily: 'monospace', letterSpacing: '2px', textShadow: '2px 2px 0 #000' }}
                    >
                        📊 ADVENTURER STATS
                    </motion.h1>
                    <p className="text-stone-400 mt-2" style={{ fontFamily: 'monospace' }}>
                        Track your learning journey and achievements
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl space-y-8">
                {/* Stats Overview */}
                {stats && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <GamificationStats
                            level={stats.level}
                            xp={stats.xp}
                            xpInCurrentLevel={stats.xp_in_current_level}
                            nextLevelXp={stats.next_level_xp}
                            streak={stats.streak}
                            totalVideos={stats.total_videos}
                        />
                    </motion.div>
                )}

                {/* Quick Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {[
                        { icon: Trophy, label: 'LEVEL', value: stats?.level || 1, color: 'amber' },
                        { icon: Flame, label: 'STREAK', value: `${stats?.streak || 0} days`, color: 'orange' },
                        { icon: CheckCircle2, label: 'COMPLETED', value: stats?.total_videos || 0, color: 'green' },
                        { icon: BookOpen, label: 'COURSES', value: courses.length, color: 'blue' },
                    ].map((stat, idx) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + idx * 0.05 }}
                                className="rounded-lg border-4 border-stone-600 p-4 text-center"
                                style={{
                                    background: 'linear-gradient(180deg, #44403c 0%, #292524 100%)',
                                    boxShadow: '0 3px 0 #1c1917'
                                }}
                            >
                                <Icon className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                                <div
                                    className="text-2xl font-bold text-amber-100"
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    {stat.value}
                                </div>
                                <div
                                    className="text-xs text-stone-400 mt-1"
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    {stat.label}
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {/* Active Quests */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-lg border-4 border-stone-600 overflow-hidden"
                    style={{
                        background: 'linear-gradient(180deg, #44403c 0%, #292524 100%)',
                        boxShadow: '0 4px 0 #1c1917'
                    }}
                >
                    <div
                        className="p-4 border-b-2 border-stone-700"
                        style={{ background: 'linear-gradient(90deg, #57534e 0%, #44403c 100%)' }}
                    >
                        <h2
                            className="font-bold text-lg text-amber-100"
                            style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
                        >
                            ⚔️ ACTIVE QUESTS ({courses.length})
                        </h2>
                    </div>
                    <div className="p-4">
                        {courses.length > 0 ? (
                            <div className="space-y-3">
                                {courses.map((course, idx) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + idx * 0.05 }}
                                        className="p-3 rounded border-2 border-stone-700 bg-stone-800/50 flex items-center justify-between gap-4 cursor-pointer hover:border-amber-600 transition-all"
                                        onClick={() => router.push(`/dashboard/course/${course.id}`)}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className="w-10 h-10 rounded border-2 border-amber-600 bg-amber-800 flex items-center justify-center flex-shrink-0"
                                                style={{ boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1)' }}
                                            >
                                                <span className="text-lg">📜</span>
                                            </div>
                                            <div className="min-w-0">
                                                <h3
                                                    className="font-bold text-amber-100 truncate"
                                                    style={{ fontFamily: 'monospace' }}
                                                >
                                                    {course.playlists?.title || 'Unknown Quest'}
                                                </h3>
                                                <p className="text-xs text-stone-400" style={{ fontFamily: 'monospace' }}>
                                                    🎯 {new Date(course.target_completion_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="flex-shrink-0 font-bold border-2 border-amber-500 text-amber-100"
                                            style={{
                                                fontFamily: 'monospace',
                                                background: 'linear-gradient(180deg, #d97706 0%, #b45309 100%)',
                                                boxShadow: '0 2px 0 #78350f'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.push(`/dashboard/course/${course.id}`)
                                            }}
                                        >
                                            PLAY →
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">📭</div>
                                <p className="text-stone-400" style={{ fontFamily: 'monospace' }}>
                                    No active quests yet
                                </p>
                                <Button
                                    className="mt-4 font-bold border-2 border-amber-500 text-amber-100"
                                    style={{
                                        fontFamily: 'monospace',
                                        background: 'linear-gradient(180deg, #d97706 0%, #b45309 100%)',
                                        boxShadow: '0 3px 0 #78350f'
                                    }}
                                    onClick={() => router.push('/dashboard')}
                                >
                                    ⚔️ START A QUEST
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-lg border-4 border-stone-600 overflow-hidden"
                    style={{
                        background: 'linear-gradient(180deg, #44403c 0%, #292524 100%)',
                        boxShadow: '0 4px 0 #1c1917'
                    }}
                >
                    <div
                        className="p-4 border-b-2 border-stone-700"
                        style={{ background: 'linear-gradient(90deg, #57534e 0%, #44403c 100%)' }}
                    >
                        <h2
                            className="font-bold text-lg text-amber-100"
                            style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
                        >
                            📜 ADVENTURE LOG
                        </h2>
                    </div>
                    <div className="p-4">
                        {recentActivity.length > 0 ? (
                            <div className="space-y-2">
                                {recentActivity.map((log, idx) => (
                                    <motion.div
                                        key={log.id || idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.03 }}
                                        className="p-3 rounded border-2 border-stone-700 bg-stone-800/30 flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 rounded border border-green-600 bg-green-900/50 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-sm text-stone-300 truncate"
                                                style={{ fontFamily: 'monospace' }}
                                            >
                                                {log.notes || 'Completed a study session'}
                                            </p>
                                            <p className="text-xs text-stone-500" style={{ fontFamily: 'monospace' }}>
                                                {new Date(log.date).toLocaleDateString()} • {log.duration || 0} min
                                            </p>
                                        </div>
                                        <span className="text-xs text-amber-400 font-bold" style={{ fontFamily: 'monospace' }}>
                                            +{(log.duration || 0) * 2} XP
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">📋</div>
                                <p className="text-stone-400" style={{ fontFamily: 'monospace' }}>
                                    No activity yet. Start learning!
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Back to Dashboard */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <Button
                        variant="outline"
                        onClick={() => router.push('/dashboard')}
                        className="font-bold border-2 border-stone-600 text-stone-300 hover:border-amber-500 hover:text-amber-200"
                        style={{ fontFamily: 'monospace' }}
                    >
                        ← BACK TO BASE CAMP
                    </Button>
                </motion.div>
            </div>
        </div>
    )
}
