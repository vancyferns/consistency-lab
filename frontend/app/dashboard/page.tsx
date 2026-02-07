'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import PlaylistAnalyzer from '@/components/PlaylistAnalyzer'
import GoalPicker from '@/components/GoalPicker'
import AuthButton from '@/components/AuthButton'
import NotebookAnalyzer from '@/components/NotebookAnalyzer'
import GamificationStats from '@/components/GamificationStats'
import QuestModal from '@/components/QuestModal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'

interface PlaylistData {
    playlist_id: string
    title: string
    total_duration_minutes: number
    video_count: number
    videos: any[]
}

export default function DashboardPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<'analyze' | 'schedule' | 'track'>('analyze')
    const [activeCourses, setActiveCourses] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [questModalOpen, setQuestModalOpen] = useState(false)

    // Fetch user courses on load
    useEffect(() => {
        const fetchCourses = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
                try {
                    const res = await fetch(`${apiUrl}/api/progress/courses?user_id=${user.id}`)
                    const data = await res.json()
                    if (data.success) {
                        setActiveCourses(data.courses)
                    }

                    // Fetch Stats
                    const statsRes = await fetch(`${apiUrl}/api/progress/stats?user_id=${user.id}`)
                    const statsData = await statsRes.json()
                    if (statsData.success) {
                        setStats(statsData)
                    }
                } catch (e) {
                    console.error('Failed to fetch courses', e)
                }
            }
        }
        fetchCourses()
    }, [])
    const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null)

    const handlePlaylistAnalyzed = (data: PlaylistData) => {
        setPlaylistData(data)
    }

    const moveToSchedule = () => {
        setCurrentStep('schedule')
    }

    return (
        <div className="min-h-screen pt-20 sm:pt-24">
            {/* Progress Steps */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 fixed top-20 sm:top-24 left-0 right-0 z-10">
                <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-2xl mx-auto">
                        {/* Step 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center gap-1.5 sm:gap-2 cursor-pointer min-w-0 ${currentStep === 'analyze' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
                            onClick={() => setCurrentStep('analyze')}
                        >
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all flex-shrink-0 ${currentStep === 'analyze' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' :
                                playlistData ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}>
                                {playlistData ? '✓' : '1'}
                            </div>
                            <span className="hidden sm:inline font-medium text-sm truncate">Analyze Playlist</span>
                        </motion.div>

                        <div className="w-6 sm:w-8 md:w-16 h-0.5 bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>

                        {/* Step 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`flex items-center gap-1.5 sm:gap-2 cursor-pointer min-w-0 ${currentStep === 'schedule' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
                            onClick={() => playlistData && setCurrentStep('schedule')}
                        >
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all flex-shrink-0 ${currentStep === 'schedule' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}>
                                2
                            </div>
                            <span className="hidden sm:inline font-medium text-sm truncate">Create Schedule</span>
                        </motion.div>

                        <div className="w-6 sm:w-8 md:w-16 h-0.5 bg-gray-300 flex-shrink-0"></div>

                        {/* Step 3 */}
                        <div className={`flex items-center gap-1.5 sm:gap-2 min-w-0 ${currentStep === 'track' ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${currentStep === 'track' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                                }`}>
                                3
                            </div>
                            <span className="hidden sm:inline font-medium text-sm truncate">Track Progress</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Step 1: Analyze */}
                    {currentStep === 'analyze' && (
                        <>
                            {/* Welcome Banner - Minecraft Style */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative rounded-lg overflow-hidden mb-4 sm:mb-6 md:mb-8"
                                style={{
                                    background: 'linear-gradient(135deg, #78350f 0%, #451a03 50%, #292524 100%)',
                                    border: '3px solid #d97706',
                                    boxShadow: '0 0 0 2px #78350f, 0 10px 40px rgba(0,0,0,0.4)'
                                }}
                            >
                                {/* Pixel grid overlay */}
                                <div
                                    className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                                        backgroundSize: '8px 8px'
                                    }}
                                />
                                <div className="relative z-10 p-4 sm:p-6 md:p-8">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <motion.span
                                            className="text-3xl sm:text-4xl"
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                                        >
                                            ⚔️
                                        </motion.span>
                                        <h2
                                            className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight"
                                            style={{
                                                fontFamily: 'monospace',
                                                letterSpacing: '1px',
                                                textShadow: '2px 2px 0 #000',
                                                color: '#fef3c7'
                                            }}
                                        >
                                            WELCOME, ADVENTURER!
                                        </h2>
                                    </div>
                                    <p className="text-sm sm:text-base mb-3 sm:mb-4" style={{ fontFamily: 'monospace', color: '#fde68a' }}>
                                        Begin your quest by analyzing a YouTube playlist. Earn XP and level up!
                                    </p>
                                    <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-5">
                                        {[
                                            { emoji: '✨', label: 'AI POWER' },
                                            { emoji: '📅', label: 'SCHEDULER' },
                                            { emoji: '🔥', label: 'STREAKS' },
                                            { emoji: '🏆', label: 'QUESTS' },
                                        ].map((item, idx) => (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * idx }}
                                                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded"
                                                style={{
                                                    fontFamily: 'monospace',
                                                    fontSize: '11px',
                                                    border: '2px solid #d97706',
                                                    backgroundColor: 'rgba(120, 53, 15, 0.5)',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                <span className="text-sm sm:text-base">{item.emoji}</span>
                                                <span style={{ color: '#fde68a', fontWeight: 'bold', fontSize: '11px' }} className="sm:text-xs">{item.label}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Source Selection - Card Style */}
                            <div className="mb-10 sm:mb-12 md:mb-14">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 sm:p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50"
                                >
                                    <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-slate-900 dark:text-white">
                                        🎯 Choose Your Learning Source
                                    </h3>
                                    <Tabs defaultValue="youtube" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 gap-2 sm:gap-3 bg-transparent h-auto p-0">
                                            <TabsTrigger 
                                                value="youtube" 
                                                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-purple-500/20 data-[state=inactive]:bg-slate-100 data-[state=inactive]:dark:bg-slate-700/50 data-[state=inactive]:text-slate-700 data-[state=inactive]:dark:text-slate-300 rounded-lg sm:rounded-xl py-2 sm:py-4 px-2 sm:px-4 transition-all duration-300 border-2 data-[state=active]:border-purple-400 data-[state=inactive]:border-slate-300 dark:data-[state=inactive]:border-slate-600"
                                            >
                                                <div className="flex flex-col items-center gap-0.5 sm:gap-2">
                                                    <span className="text-lg sm:text-2xl">📺</span>
                                                    <span className="text-[11px] sm:text-sm font-bold leading-tight">YouTube</span>
                                                    <span className="text-[9px] sm:text-xs opacity-80 hidden sm:block">Analyze playlists</span>
                                                </div>
                                            </TabsTrigger>
                                            <TabsTrigger 
                                                value="notebook" 
                                                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-green-500/20 data-[state=inactive]:bg-slate-100 data-[state=inactive]:dark:bg-slate-700/50 data-[state=inactive]:text-slate-700 data-[state=inactive]:dark:text-slate-300 rounded-lg sm:rounded-xl py-2 sm:py-4 px-2 sm:px-4 transition-all duration-300 border-2 data-[state=active]:border-green-400 data-[state=inactive]:border-slate-300 dark:data-[state=inactive]:border-slate-600"
                                            >
                                                <div className="flex flex-col items-center gap-0.5 sm:gap-2">
                                                    <span className="text-lg sm:text-2xl">📄</span>
                                                    <span className="text-[11px] sm:text-sm font-bold leading-tight">Document</span>
                                                    <span className="text-[9px] sm:text-xs opacity-80 hidden sm:block">NotebookLM style</span>
                                                </div>
                                            </TabsTrigger>
                                        </TabsList>
                                        <div className="mt-4 sm:mt-6">
                                            <TabsContent value="youtube" className="mt-0">
                                                <PlaylistAnalyzer
                                                    onAnalyzed={handlePlaylistAnalyzed}
                                                    onNext={moveToSchedule}
                                                />
                                            </TabsContent>
                                            <TabsContent value="notebook" className="mt-0">
                                                <NotebookAnalyzer />
                                            </TabsContent>
                                        </div>
                                    </Tabs>
                                </motion.div>
                            </div>
                        </>
                    )}

                    {/* Step 2: Schedule */}
                    {currentStep === 'schedule' && playlistData && (
                        <>
                            <div className="mb-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep('analyze')}
                                    className="mb-4"
                                >
                                    ← Back to Playlist
                                </Button>
                            </div>

                            <GoalPicker
                                totalDurationMinutes={playlistData.total_duration_minutes}
                                playlistTitle={playlistData.title}
                                playlistId={playlistData.playlist_id}
                                videos={playlistData.videos}
                                onScheduleCreated={(schedule) => {
                                    console.log('Schedule created:', schedule)
                                }}
                                onScheduleSaved={() => {
                                    setCurrentStep('track')
                                }}
                            />
                        </>
                    )}


                    {currentStep === 'track' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl"
                        >
                            <div className="text-6xl mb-4">🚀</div>
                            <h2 className="text-3xl font-bold mb-4 text-green-600 dark:text-green-400">You're All Set!</h2>
                            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto px-4">
                                Your schedule for <strong>{playlistData?.title}</strong> has been saved successfully.
                                <br />
                                You can now track your progress and level up!
                            </p>
                            <div className="flex justify-center gap-4 flex-wrap px-4">
                                <Button
                                    size="lg"
                                    onClick={() => setCurrentStep('analyze')}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                >
                                    ✨ Add Another Course
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                    className="dark:border-slate-600 dark:text-slate-200"
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Quick Stats (always visible at bottom) */}
                    {currentStep === 'analyze' && (
                        <>
                            <div className="mt-8 grid md:grid-cols-12 gap-6">
                                <div className="md:col-span-8">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 mb-6"
                                    >
                                        <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">🎮 Your Progress</h3>
                                        {stats ? (
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <GamificationStats
                                                    level={stats.level}
                                                    xp={stats.xp}
                                                    xpInCurrentLevel={stats.xp_in_current_level}
                                                    nextLevelXp={stats.next_level_xp}
                                                    streak={stats.streak}
                                                    totalVideos={stats.total_videos}
                                                />
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex flex-col justify-center">
                                                    <div className="text-3xl mb-2">📚</div>
                                                    <h3 className="font-semibold text-lg mb-1 text-slate-900 dark:text-white">{activeCourses.length} Active Courses</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        {activeCourses.length > 0 ? 'Keep up the momentum!' : 'Analyze your first playlist to begin'}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-slate-500 dark:text-slate-400">Loading stats...</div>
                                        )}
                                    </motion.div>
                                </div>
                                <div className="md:col-span-4">
                                    {/* Motivation Card - Minecraft Inspired */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="relative overflow-hidden h-full"
                                    >
                                        <div
                                            className="h-full p-6 rounded-lg border-4 border-amber-700 dark:border-amber-800"
                                            style={{
                                                background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
                                                boxShadow: '0 0 0 2px #92400e, inset 0 2px 4px rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            <div className="text-4xl mb-3">📜</div>
                                            <h3 className="font-bold text-lg text-amber-100 mb-2" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
                                                DAILY QUEST
                                            </h3>
                                            <p className="text-sm text-amber-200/80 mb-4" style={{ fontFamily: 'monospace' }}>
                                                Complete 1 video to keep your streak!
                                            </p>
                                            <Button
                                                size="sm"
                                                onClick={() => setQuestModalOpen(true)}
                                                className="w-full font-bold border-2 border-amber-400 text-amber-100 hover:bg-amber-600"
                                                style={{
                                                    fontFamily: 'monospace',
                                                    background: 'linear-gradient(180deg, #d97706 0%, #b45309 100%)',
                                                    boxShadow: '0 4px 0 #78350f, 0 6px 10px rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                ⚔️ VIEW QUESTS
                                            </Button>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Active Courses List - Quest Board */}
                            {activeCourses.length > 0 && (
                                <motion.div
                                    id="my-courses"
                                    className="mt-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3
                                        className="font-bold text-xl mb-4 text-amber-100 dark:text-amber-100"
                                        style={{ fontFamily: 'monospace', letterSpacing: '1px', textShadow: '1px 1px 0 #000' }}
                                    >
                                        ⚔️ ACTIVE QUESTS
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {activeCourses.map((course, idx) => (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.1 * idx }}
                                                whileHover={{ scale: 1.02, y: -4 }}
                                                className="rounded-lg border-4 border-stone-600 dark:border-stone-700 overflow-hidden cursor-pointer"
                                                style={{
                                                    background: 'linear-gradient(180deg, #44403c 0%, #292524 100%)',
                                                    boxShadow: '0 4px 0 #1c1917, 0 8px 20px rgba(0,0,0,0.3)'
                                                }}
                                                onClick={() => router.push(`/dashboard/course/${course.id}`)}
                                            >
                                                <div
                                                    className="p-4 border-b-2 border-stone-700"
                                                    style={{ background: 'linear-gradient(90deg, #57534e 0%, #44403c 100%)' }}
                                                >
                                                    <h4
                                                        className="font-bold text-amber-100 truncate"
                                                        style={{ fontFamily: 'monospace', textShadow: '1px 1px 0 #000' }}
                                                    >
                                                        📜 {course.playlists?.title || 'Unknown Quest'}
                                                    </h4>
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex justify-between text-sm mb-4" style={{ fontFamily: 'monospace' }}>
                                                        <span className="text-stone-400">
                                                            🎯 {new Date(course.target_completion_date).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-amber-400">
                                                            🎥 {course.playlists?.video_count || 0}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            router.push(`/dashboard/course/${course.id}`)
                                                        }}
                                                        className="w-full font-bold border-2 border-amber-500 text-amber-100"
                                                        style={{
                                                            fontFamily: 'monospace',
                                                            background: 'linear-gradient(180deg, #d97706 0%, #b45309 100%)',
                                                            boxShadow: '0 3px 0 #78350f'
                                                        }}
                                                    >
                                                        ⚔️ CONTINUE QUEST
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* How to Play - Guide Book Style */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-8 rounded-lg border-4 border-stone-600 dark:border-stone-700 overflow-hidden"
                                style={{
                                    background: 'linear-gradient(180deg, #44403c 0%, #292524 100%)',
                                    boxShadow: '0 4px 0 #1c1917, 0 8px 20px rgba(0,0,0,0.3)'
                                }}
                            >
                                <div
                                    className="p-4 border-b-2 border-stone-700"
                                    style={{ background: 'linear-gradient(90deg, #57534e 0%, #44403c 100%)' }}
                                >
                                    <h3
                                        className="font-bold text-lg text-amber-100"
                                        style={{ fontFamily: 'monospace', letterSpacing: '1px', textShadow: '1px 1px 0 #000' }}
                                    >
                                        📖 ADVENTURER'S GUIDE
                                    </h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    {[
                                        { step: '1', icon: '🔗', title: 'PASTE URL', desc: 'Add any YouTube playlist link' },
                                        { step: '2', icon: '✨', title: 'AI ANALYSIS', desc: 'Get instant course breakdown' },
                                        { step: '3', icon: '📅', title: 'SET SCHEDULE', desc: 'Choose your learning pace' },
                                        { step: '4', icon: '⬆️', title: 'LEVEL UP!', desc: 'Earn XP and maintain streaks' },
                                    ].map((item, idx) => (
                                        <motion.div
                                            key={item.step}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + (idx * 0.1) }}
                                            className="flex gap-3 items-center p-2 rounded border-2 border-stone-700 bg-stone-800/50"
                                            style={{ fontFamily: 'monospace' }}
                                        >
                                            <div
                                                className="w-8 h-8 rounded border-2 border-amber-600 bg-amber-800 flex items-center justify-center text-amber-200 font-bold text-sm"
                                                style={{ boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1)' }}
                                            >
                                                {item.step}
                                            </div>
                                            <span className="text-xl">{item.icon}</span>
                                            <div>
                                                <span className="text-amber-200 font-bold">{item.title}</span>
                                                <span className="text-stone-400 ml-2">- {item.desc}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </div>
            </main>

            {/* Footer - Minecraft Credits Style */}
            <footer
                className="mt-16 py-8 border-t-4 border-stone-700"
                style={{
                    background: 'linear-gradient(180deg, #1c1917 0%, #0c0a09 100%)'
                }}
            >
                <div className="container mx-auto px-4 text-center">
                    <div className="text-3xl mb-3">⚔️</div>
                    <p
                        className="text-stone-500 text-sm"
                        style={{ fontFamily: 'monospace' }}
                    >
                        CRAFTED WITH ❤️ USING GEMINI AI • YOUTUBE API • SUPABASE
                    </p>
                    <p
                        className="text-stone-600 text-xs mt-2"
                        style={{ fontFamily: 'monospace' }}
                    >
                        © 2024 CONSISTENCY LAB - LEVEL UP YOUR LEARNING
                    </p>
                </div>
            </footer>

            {/* Quest Modal */}
            <QuestModal
                isOpen={questModalOpen}
                onClose={() => setQuestModalOpen(false)}
                stats={stats}
            />
        </div>
    )
}
