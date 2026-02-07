'use client'

import { useState } from 'react'
import ConsistencyHeatmap from '@/components/ConsistencyHeatmap'
import VideoProgress from '@/components/VideoProgress'
import StudyLogger from '@/components/StudyLogger'

// Sample data for demonstration
const sampleConsistencyData = [
    { date: '2026-02-01', count: 1 },
    { date: '2026-02-03', count: 1 },
    { date: '2026-02-05', count: 1 },
    { date: '2026-02-06', count: 1 },
    { date: '2026-02-07', count: 1 },
]

const sampleVideos = [
    {
        video_id: '1',
        title: 'Introduction to the Course',
        duration_seconds: 600,
        current_timestamp: 600,
        completed: true,
        thumbnail: 'https://via.placeholder.com/120x90'
    },
    {
        video_id: '2',
        title: 'Understanding the Fundamentals',
        duration_seconds: 900,
        current_timestamp: 450,
        completed: false,
        thumbnail: 'https://via.placeholder.com/120x90'
    },
    {
        video_id: '3',
        title: 'Advanced Concepts Explained',
        duration_seconds: 1200,
        current_timestamp: 0,
        completed: false,
        thumbnail: 'https://via.placeholder.com/120x90'
    },
    {
        video_id: '4',
        title: 'Practical Examples and Projects',
        duration_seconds: 1500,
        current_timestamp: 0,
        completed: false,
        thumbnail: 'https://via.placeholder.com/120x90'
    },
]

export default function ProgressPage() {
    const [consistencyData, setConsistencyData] = useState(sampleConsistencyData)
    const [videos, setVideos] = useState(sampleVideos)

    const handleLogCreated = (log: any) => {
        const newEntry = {
            date: log.date,
            count: 1
        }

        setConsistencyData(prev => {
            const existing = prev.find(d => d.date === log.date)
            if (existing) {
                return prev.map(d => d.date === log.date ? { ...d, count: d.count + 1 } : d)
            }
            return [...prev, newEntry]
        })
    }

    const handleVideoClick = (video: any) => {
        console.log('Opening video:', video)
        // In real app: open video player
    }

    const handleProgressUpdate = (videoId: string, timestamp: number, completed: boolean) => {
        setVideos(prev => prev.map(v =>
            v.video_id === videoId
                ? { ...v, current_timestamp: timestamp, completed }
                : v
        ))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Track Your Progress</h1>
                            <p className="text-sm text-gray-600">Build consistency and complete your course</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors">
                                ← Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8">
                        <h2 className="text-3xl font-bold mb-2">Keep Going! 🚀</h2>
                        <p className="text-green-100 mb-4">
                            You're making great progress. Log today's study session to keep your streak alive.
                        </p>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left Column - Main Content */}
                        <div className="md:col-span-2 space-y-8">
                            <ConsistencyHeatmap data={consistencyData} />
                            <VideoProgress
                                videos={videos}
                                onVideoClick={handleVideoClick}
                                onProgressUpdate={handleProgressUpdate}
                            />
                        </div>

                        {/* Right Column - Study Logger */}
                        <div className="space-y-6">
                            <StudyLogger onLogCreated={handleLogCreated} />

                            {/* Quick Stats Card */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="font-semibold mb-4">This Week</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Study Days</span>
                                        <span className="font-semibold">5 / 7</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Minutes</span>
                                        <span className="font-semibold">240 min</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Avg per Day</span>
                                        <span className="font-semibold">48 min</span>
                                    </div>
                                </div>
                            </div>

                            {/* Achievements Card */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="font-semibold mb-4">Achievements 🏆</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                                        <span className="text-2xl">🔥</span>
                                        <div className="text-sm">
                                            <div className="font-medium">5 Day Streak</div>
                                            <div className="text-xs text-gray-600">Keep it going!</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                                        <span className="text-2xl">✅</span>
                                        <div className="text-sm">
                                            <div className="font-medium">First Video Done</div>
                                            <div className="text-xs text-gray-600">Great start!</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded opacity-50">
                                        <span className="text-2xl">📚</span>
                                        <div className="text-sm">
                                            <div className="font-medium">Course Complete</div>
                                            <div className="text-xs text-gray-600">Locked</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
