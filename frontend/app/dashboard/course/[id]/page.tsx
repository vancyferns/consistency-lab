'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { PlayCircle, CheckCircle2, Circle, ArrowLeft, Clock, Calendar, Target, Sword, Shield, X, Maximize2, Minimize2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'

export default function CourseDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [course, setCourse] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [activeVideo, setActiveVideo] = useState<any>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    useEffect(() => {
        if (params.id) fetchCourse()
    }, [params.id])

    const fetchCourse = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            const res = await fetch(`${apiUrl}/api/progress/course/${params.id}`)
            const data = await res.json()

            console.log('Course API Response:', data) // Debug log

            if (data.success) {
                setCourse(data)
            } else {
                console.error('API Error:', data.error)
            }
        } catch (e) {
            console.error('Fetch error:', e)
        } finally {
            setLoading(false)
        }
    }

    const toggleVideo = async (video: any, playlistId: string) => {
        if (updating) return
        setUpdating(video.video_id)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const newStatus = !video.completed
            if (newStatus) {
                // Epic confetti with game colors!
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#fbbf24', '#f59e0b', '#d97706', '#22c55e', '#84cc16']
                })
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

            await fetch(`${apiUrl}/api/progress/mark-complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    video_id: video.video_id,
                    playlist_id: playlistId,
                    completed: newStatus,
                    video_title: video.title || video.video_title || 'Untitled Video',
                    duration_seconds: video.duration_seconds || video.duration || 0
                })
            })

            // Optimistic update
            const updatedSchedule = { ...course.schedule }
            updatedSchedule.study_sessions = updatedSchedule.study_sessions.map((session: any) => ({
                ...session,
                videos: session.videos.map((v: any) =>
                    v.video_id === video.video_id ? { ...v, completed: newStatus } : v
                )
            }))

            const updatedVideos = course.videos.map((v: any) =>
                v.video_id === video.video_id ? { ...v, completed: newStatus } : v
            )

            setCourse({ ...course, schedule: updatedSchedule, videos: updatedVideos })

            // Also update activeVideo if it's the same video
            if (activeVideo && activeVideo.video_id === video.video_id) {
                setActiveVideo({ ...activeVideo, completed: newStatus })
            }

        } catch (e) {
            console.error(e)
        } finally {
            setUpdating(null)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-5xl"
                >
                    ⚔️
                </motion.div>
                <p className="text-amber-100" style={{ fontFamily: 'monospace' }}>LOADING QUEST...</p>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="container mx-auto p-10 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h2 className="text-2xl font-bold mb-4 text-amber-100" style={{ fontFamily: 'monospace' }}>QUEST NOT FOUND</h2>
                <Button onClick={() => router.push('/dashboard')}>Return to Base Camp</Button>
            </div>
        )
    }

    // Safe access with fallbacks
    const videos = course.videos || []
    const schedule = course.schedule || { study_sessions: [] }
    const studySessions = schedule.study_sessions || []

    console.log('Render Debug:', { videos: videos.length, studySessions: studySessions.length, schedule })

    const completedCount = videos.filter((v: any) => v.completed).length
    const totalCount = videos.length
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return (
        <div className="min-h-screen pb-20">
            {/* Header - Minecraft Style */}
            <div
                className="sticky top-16 z-10 border-b-4 border-stone-700"
                style={{
                    background: 'linear-gradient(180deg, #44403c 0%, #292524 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                }}
            >
                <div className="container mx-auto px-4 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/dashboard')}
                        className="mb-3 text-stone-400 hover:text-amber-200 -ml-2"
                        style={{ fontFamily: 'monospace' }}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        ← BACK TO BASE CAMP
                    </Button>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1
                                className="text-xl md:text-2xl font-bold text-amber-100"
                                style={{ fontFamily: 'monospace', letterSpacing: '1px', textShadow: '2px 2px 0 #000' }}
                            >
                                📜 {course.playlist.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-400 mt-2" style={{ fontFamily: 'monospace' }}>
                                <span className="flex items-center gap-1">
                                    <Target className="w-4 h-4 text-amber-500" />
                                    {new Date(course.goal.target_completion_date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-amber-500" />
                                    {course.schedule.total_days} DAYS
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar - Minecraft XP Style */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full lg:w-auto"
                        >
                            <div
                                className="p-4 rounded border-4 border-stone-600"
                                style={{
                                    background: 'linear-gradient(180deg, #1c1917 0%, #0c0a09 100%)',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                                }}
                            >
                                <div className="flex justify-between items-center mb-2" style={{ fontFamily: 'monospace' }}>
                                    <span className="text-xs text-stone-400">QUEST PROGRESS</span>
                                    <span className="text-xs text-green-400 font-bold">{completedCount}/{totalCount}</span>
                                </div>
                                <div
                                    className="relative h-6 rounded border-2 border-stone-700 overflow-hidden"
                                    style={{
                                        background: '#1c1917',
                                        minWidth: '200px'
                                    }}
                                >
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="absolute top-0 left-0 h-full"
                                        style={{
                                            background: 'linear-gradient(180deg, #84cc16 0%, #65a30d 50%, #4d7c0f 100%)',
                                            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.15) 10px, rgba(0,0,0,0.15) 12px)'
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span
                                            className="text-sm font-bold text-white"
                                            style={{ fontFamily: 'monospace', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                                        >
                                            {progressPercent}% COMPLETE
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content - Quest Sessions */}
            <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
                <AnimatePresence>
                    {studySessions.length > 0 ? studySessions.map((session: any, sessionIdx: number) => {
                        const sessionVideos = session.videos || []
                        const sessionComplete = sessionVideos.length > 0 && sessionVideos.every((v: any) => v.completed)
                        return (
                            <motion.div
                                key={session.date}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: sessionIdx * 0.1 }}
                            >
                                <div
                                    className={`rounded-lg border-4 overflow-hidden ${sessionComplete
                                        ? 'border-green-600'
                                        : 'border-stone-600'
                                        }`}
                                    style={{
                                        background: sessionComplete
                                            ? 'linear-gradient(180deg, #14532d 0%, #052e16 100%)'
                                            : 'linear-gradient(180deg, #44403c 0%, #292524 100%)',
                                        boxShadow: sessionComplete
                                            ? '0 0 20px rgba(34, 197, 94, 0.2), inset 0 2px 4px rgba(255,255,255,0.05)'
                                            : 'inset 0 2px 4px rgba(255,255,255,0.05)'
                                    }}
                                >
                                    {/* Session Header */}
                                    <div
                                        className="p-4 border-b-2"
                                        style={{
                                            borderColor: sessionComplete ? '#166534' : '#44403c',
                                            background: sessionComplete
                                                ? 'linear-gradient(90deg, #166534 0%, #14532d 100%)'
                                                : 'linear-gradient(90deg, #57534e 0%, #44403c 100%)'
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3
                                                    className="font-bold text-lg text-amber-100 flex items-center gap-2"
                                                    style={{ fontFamily: 'monospace' }}
                                                >
                                                    {sessionComplete && <span>✅</span>}
                                                    {sessionComplete ? '🏆' : '⚔️'} DAY {sessionIdx + 1}
                                                </h3>
                                                <p className="text-xs text-stone-400" style={{ fontFamily: 'monospace' }}>
                                                    {new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <div
                                                className="px-3 py-1 rounded border-2 border-stone-500 bg-stone-700/50 text-stone-300"
                                                style={{ fontFamily: 'monospace', fontSize: '12px' }}
                                            >
                                                <Clock className="w-3 h-3 inline mr-1" />
                                                {session.total_minutes} MIN
                                            </div>
                                        </div>
                                    </div>

                                    {/* Videos List - Inventory Slots */}
                                    <div className="p-2 space-y-2">
                                        {sessionVideos.map((video: any, videoIdx: number) => (
                                            <motion.div
                                                key={video.video_id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: (sessionIdx * 0.1) + (videoIdx * 0.05) }}
                                                className={`group flex items-center gap-3 p-3 rounded border-2 transition-all cursor-pointer ${video.completed
                                                    ? 'bg-green-900/30 border-green-700 hover:border-green-500'
                                                    : 'bg-stone-800/50 border-stone-600 hover:border-amber-500 hover:bg-stone-700/50'
                                                    }`}
                                                style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)' }}
                                            >
                                                {/* Checkbox - Inventory Slot Style */}
                                                <motion.button
                                                    whileTap={{ scale: 0.7 }}
                                                    whileHover={{ scale: 1.1 }}
                                                    onClick={() => toggleVideo(video, course.playlist.id)}
                                                    disabled={updating === video.video_id}
                                                    className={`flex-shrink-0 w-10 h-10 rounded border-2 flex items-center justify-center transition-all ${video.completed
                                                        ? 'bg-green-800 border-green-500 text-green-300'
                                                        : 'bg-stone-700 border-stone-500 text-stone-400 hover:border-amber-500 hover:text-amber-400'
                                                        }`}
                                                    style={{ boxShadow: video.completed ? '0 0 10px rgba(34, 197, 94, 0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
                                                    title={video.completed ? "Mark as incomplete" : "Mark as complete"}
                                                >
                                                    {video.completed ? (
                                                        <CheckCircle2 className="w-6 h-6" />
                                                    ) : (
                                                        <Circle className="w-6 h-6" />
                                                    )}
                                                </motion.button>

                                                {/* Video Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4
                                                        className={`font-medium text-sm mb-1 truncate transition-colors ${video.completed
                                                            ? 'text-green-300 line-through opacity-70'
                                                            : 'text-amber-100 group-hover:text-amber-200'
                                                            }`}
                                                        style={{ fontFamily: 'monospace' }}
                                                    >
                                                        {video.title}
                                                    </h4>
                                                    <div
                                                        className="text-xs text-stone-500"
                                                        style={{ fontFamily: 'monospace' }}
                                                    >
                                                        ⏱️ {video.duration_formatted}
                                                    </div>
                                                </div>

                                                {/* Play Button - Opens Embedded Player */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveVideo(video)
                                                    }}
                                                    className="flex-shrink-0 p-2 rounded border-2 border-red-700 bg-red-900/50 text-red-400 hover:bg-red-800 hover:border-red-500 hover:text-red-300 transition-all"
                                                    style={{ boxShadow: '0 2px 0 #7f1d1d' }}
                                                    title="Watch Video"
                                                >
                                                    <PlayCircle size={24} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    }) : null}
                </AnimatePresence>

                {studySessions.length === 0 && videos.length === 0 && (
                    <div
                        className="text-center py-16 rounded-lg border-4 border-stone-600"
                        style={{
                            background: 'linear-gradient(180deg, #44403c 0%, #292524 100%)'
                        }}
                    >
                        <div className="text-5xl mb-4">📭</div>
                        <h3 className="text-lg font-bold text-amber-100" style={{ fontFamily: 'monospace' }}>NO QUESTS AVAILABLE</h3>
                        <p className="text-stone-400 mt-2" style={{ fontFamily: 'monospace' }}>Could not load videos for this quest.</p>
                        <Button onClick={fetchCourse} className="mt-4">Try Refreshing</Button>
                    </div>
                )}

                {/* Fallback: Show flat video list if schedule is empty but videos exist */}
                {studySessions.length === 0 && videos.length > 0 && (
                    <div
                        className="rounded-lg border-4 border-stone-600 overflow-hidden"
                        style={{
                            background: 'linear-gradient(180deg, #44403c 0%, #292524 100%)',
                            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05)'
                        }}
                    >
                        <div
                            className="p-4 border-b-2 border-stone-700"
                            style={{ background: 'linear-gradient(90deg, #57534e 0%, #44403c 100%)' }}
                        >
                            <h3 className="font-bold text-amber-100" style={{ fontFamily: 'monospace' }}>
                                📜 ALL VIDEOS ({videos.length})
                            </h3>
                        </div>
                        <div className="p-2 space-y-2">
                            {videos.map((video: any, idx: number) => (
                                <motion.div
                                    key={video.video_id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className={`group flex items-center gap-3 p-3 rounded border-2 transition-all cursor-pointer ${video.completed
                                        ? 'bg-green-900/30 border-green-700 hover:border-green-500'
                                        : 'bg-stone-800/50 border-stone-600 hover:border-amber-500 hover:bg-stone-700/50'
                                        }`}
                                >
                                    <motion.button
                                        whileTap={{ scale: 0.7 }}
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() => toggleVideo(video, course.playlist?.id)}
                                        disabled={updating === video.video_id}
                                        className={`flex-shrink-0 w-10 h-10 rounded border-2 flex items-center justify-center transition-all ${video.completed
                                            ? 'bg-green-800 border-green-500 text-green-300'
                                            : 'bg-stone-700 border-stone-500 text-stone-400 hover:border-amber-500 hover:text-amber-400'
                                            }`}
                                    >
                                        {video.completed ? (
                                            <CheckCircle2 className="w-6 h-6" />
                                        ) : (
                                            <Circle className="w-6 h-6" />
                                        )}
                                    </motion.button>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-stone-200 text-sm truncate" style={{ fontFamily: 'monospace' }}>
                                            {idx + 1}. {video.title}
                                        </h4>
                                        <div className="text-xs text-stone-500" style={{ fontFamily: 'monospace' }}>
                                            <Clock className="w-3 h-3 inline mr-1" />
                                            {video.duration_formatted || `${Math.round((video.duration_seconds || 0) / 60)}m`}
                                        </div>
                                    </div>
                                    <a
                                        href={`https://www.youtube.com/watch?v=${video.video_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-red-500 hover:text-red-400"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setActiveVideo(video)
                                        }}
                                    >
                                        <PlayCircle size={24} />
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Video Player Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
                        onClick={() => setActiveVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl'}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Player Header */}
                            <div
                                className="flex items-center justify-between p-4 rounded-t-lg border-4 border-b-0 border-amber-600"
                                style={{
                                    background: 'linear-gradient(90deg, #78350f 0%, #451a03 100%)',
                                }}
                            >
                                <div className="flex-1 min-w-0 mr-4">
                                    <h3
                                        className="font-bold text-lg text-amber-100 truncate"
                                        style={{ fontFamily: 'monospace', textShadow: '1px 1px 0 #000' }}
                                    >
                                        🎬 {activeVideo.title}
                                    </h3>
                                    <p className="text-sm text-amber-300/70" style={{ fontFamily: 'monospace' }}>
                                        ⏱️ {activeVideo.duration_formatted || 'Unknown duration'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsFullscreen(!isFullscreen)}
                                        className="p-2 rounded border-2 border-amber-600 bg-amber-900/50 text-amber-300 hover:bg-amber-800 transition-all"
                                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                                    >
                                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                    </button>
                                    <button
                                        onClick={() => setActiveVideo(null)}
                                        className="p-2 rounded border-2 border-red-600 bg-red-900/50 text-red-300 hover:bg-red-800 transition-all"
                                        title="Close Player"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* YouTube Embed */}
                            <div
                                className={`relative bg-black border-4 border-t-0 border-amber-600 ${isFullscreen ? 'h-[calc(100%-140px)]' : ''}`}
                                style={{ aspectRatio: isFullscreen ? undefined : '16/9' }}
                            >
                                <iframe
                                    src={`https://www.youtube.com/embed/${activeVideo.video_id}?autoplay=1&rel=0`}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={activeVideo.title}
                                />
                            </div>

                            {/* Player Footer */}
                            <div
                                className="flex items-center justify-between p-4 rounded-b-lg border-4 border-t-0 border-amber-600"
                                style={{
                                    background: 'linear-gradient(90deg, #451a03 0%, #78350f 100%)',
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <Button
                                        onClick={() => {
                                            toggleVideo(activeVideo, course.playlist.id)
                                        }}
                                        disabled={updating === activeVideo.video_id}
                                        className={`font-bold border-2 ${activeVideo.completed
                                            ? 'border-amber-500 bg-amber-800 text-amber-100 hover:bg-amber-700'
                                            : 'border-green-500 bg-green-800 text-green-100 hover:bg-green-700'}`}
                                        style={{
                                            fontFamily: 'monospace',
                                            boxShadow: activeVideo.completed ? '0 3px 0 #78350f' : '0 3px 0 #166534'
                                        }}
                                    >
                                        {activeVideo.completed ? '↩️ MARK INCOMPLETE' : '✅ MARK AS COMPLETE'}
                                    </Button>
                                </div>
                                <a
                                    href={`https://www.youtube.com/watch?v=${activeVideo.video_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 rounded border-2 border-stone-600 bg-stone-800 text-stone-300 hover:bg-stone-700 hover:border-stone-500 transition-all"
                                    style={{ fontFamily: 'monospace', fontSize: '14px' }}
                                >
                                    Open on YouTube ↗
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
