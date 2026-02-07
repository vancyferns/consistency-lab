'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface PlaylistData {
    playlist_id: string
    title: string
    total_duration_minutes: number
    video_count: number
    videos: Array<{
        video_id: string
        title: string
        duration_formatted: string
        thumbnail: string
    }>
}

interface PlaylistAnalyzerProps {
    onAnalyzed?: (data: PlaylistData) => void
    onNext?: () => void
}

export default function PlaylistAnalyzer({ onAnalyzed, onNext }: PlaylistAnalyzerProps = {}) {
    const [playlistUrl, setPlaylistUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null)

    const extractPlaylistId = (url: string): string | null => {
        // Handle both full URLs and just IDs
        if (url.includes('list=')) {
            const match = url.match(/[?&]list=([^&]+)/)
            return match ? match[1] : null
        }
        // Assume it's already an ID if no "list=" found
        return url.length > 10 ? url : null
    }

    const analyzePlaylist = async () => {
        const playlistId = extractPlaylistId(playlistUrl)

        if (!playlistId) {
            setError('Please enter a valid YouTube playlist URL or ID')
            return
        }

        setLoading(true)
        setError('')
        setPlaylistData(null)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            const response = await fetch(`${apiUrl}/api/playlist/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playlist_id: playlistId,
                    generate_summary: false // We'll do this separately
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to analyze playlist')
            }

            const data = await response.json()
            setPlaylistData(data)

            // Notify parent component
            if (onAnalyzed) {
                onAnalyzed(data)
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while analyzing the playlist')
        } finally {
            setLoading(false)
        }
    }

    const formatDuration = (minutes: number): string => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
    }

    return (
        <div className="space-y-6">
            {/* Input Section - Minecraft Inventory Style */}
            <div
                className="rounded-lg border-4 border-amber-600 overflow-hidden"
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
                        className="font-bold text-lg"
                        style={{
                            fontFamily: 'monospace',
                            letterSpacing: '1px',
                            textShadow: '1px 1px 0 #000',
                            color: '#fde68a'
                        }}
                    >
                        📺 ANALYZE YOUTUBE PLAYLIST
                    </h3>
                    <p style={{ fontFamily: 'monospace', color: '#a8a29e', marginTop: '4px', fontSize: '14px' }}>
                        Enter a playlist URL to begin your learning quest
                    </p>
                </div>
                <div className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <input
                            type="text"
                            placeholder="https://www.youtube.com/playlist?list=PLxxx"
                            value={playlistUrl}
                            onChange={(e) => setPlaylistUrl(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && analyzePlaylist()}
                            className="flex-1 min-w-0"
                            style={{
                                fontFamily: 'monospace',
                                backgroundColor: '#1c1917',
                                border: '2px solid #57534e',
                                borderRadius: '6px',
                                padding: '12px',
                                color: '#f5f5f4',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                        <Button
                            onClick={analyzePlaylist}
                            disabled={loading || !playlistUrl}
                            className="w-full sm:w-auto sm:min-w-[140px] font-bold border-2 border-amber-500 text-amber-100 py-3 h-auto"
                            style={{
                                fontFamily: 'monospace',
                                background: 'linear-gradient(180deg, #d97706 0%, #b45309 100%)',
                                boxShadow: '0 3px 0 #78350f'
                            }}
                        >
                            {loading ? '⏳ SCANNING...' : '🔍 ANALYZE'}
                        </Button>
                    </div>

                    {error && (
                        <div
                            className="mt-4 p-3 rounded border-2 border-red-600 bg-red-900/50 text-red-200 text-sm"
                            style={{ fontFamily: 'monospace' }}
                        >
                            ⚠️ {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            {playlistData && (
                <div className="space-y-6">
                    {/* Overview Card - Minecraft Style */}
                    <div
                        className="rounded-lg border-4 border-stone-600 overflow-hidden"
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
                                📜 {playlistData.title}
                            </h3>
                            <p className="text-xs text-stone-400 mt-1" style={{ fontFamily: 'monospace' }}>
                                ID: {playlistData.playlist_id}
                            </p>
                        </div>
                        <div className="p-3 sm:p-4">
                            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                                {[
                                    { value: playlistData.video_count, label: 'VIDEOS', icon: '🎬' },
                                    { value: formatDuration(playlistData.total_duration_minutes), label: 'DURATION', icon: '⏱️' },
                                    { value: Math.ceil(playlistData.total_duration_minutes / 60), label: 'HOURS', icon: '📚' },
                                    { value: Math.ceil(playlistData.total_duration_minutes / 180), label: 'WEEKS', icon: '📅' },
                                ].map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className="text-center p-3 rounded border-2 border-stone-600 bg-stone-800/50"
                                        style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
                                    >
                                        <div className="text-lg mb-1">{stat.icon}</div>
                                        <div
                                            className="text-2xl font-bold text-amber-400"
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
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Video List Card - Minecraft Style */}
                    <div
                        className="rounded-lg border-4 border-stone-600 overflow-hidden"
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
                                🎬 VIDEO LIST (First 10)
                            </h3>
                            <p className="text-xs text-stone-400 mt-1" style={{ fontFamily: 'monospace' }}>
                                {playlistData.video_count} total videos in playlist
                            </p>
                        </div>
                        <div className="p-4">
                            <div className="space-y-2">
                                {playlistData.videos.map((video, idx) => (
                                    <div
                                        key={video.video_id}
                                        className="flex gap-3 p-2 border-2 border-stone-600 rounded bg-stone-800/50 hover:border-amber-500 transition-colors"
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-24 h-16 object-cover rounded border border-stone-600"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div
                                                className="font-medium text-sm text-stone-200 line-clamp-2"
                                                style={{ fontFamily: 'monospace' }}
                                            >
                                                {idx + 1}. {video.title}
                                            </div>
                                            <div className="text-xs text-stone-500 mt-1" style={{ fontFamily: 'monospace' }}>
                                                ⏱️ {video.duration_formatted}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {playlistData.video_count > 10 && (
                                <div className="mt-4 text-center text-sm text-stone-400" style={{ fontFamily: 'monospace' }}>
                                    Showing 10 of {playlistData.video_count} videos
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Next Steps Card - Green Minecraft Style */}
                    <div
                        className="rounded-lg border-4 border-green-600 overflow-hidden"
                        style={{
                            background: 'linear-gradient(180deg, #14532d 0%, #052e16 100%)',
                            boxShadow: '0 4px 0 #022c22, 0 8px 20px rgba(0,0,0,0.3)'
                        }}
                    >
                        <div
                            className="p-4 border-b-2 border-green-700"
                            style={{ background: 'linear-gradient(90deg, #166534 0%, #14532d 100%)' }}
                        >
                            <h3
                                className="font-bold text-lg text-green-100"
                                style={{ fontFamily: 'monospace', letterSpacing: '1px', textShadow: '1px 1px 0 #000' }}
                            >
                                ✅ NEXT STEPS
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="space-y-2 text-sm text-green-100" style={{ fontFamily: 'monospace' }}>
                                <p>• Set your study schedule (days + hours)</p>
                                <p>• Get your personalized completion date</p>
                                <p>• Start tracking your consistency</p>
                                <p>• Take AI-generated quizzes</p>
                            </div>
                            <Button
                                className="mt-4 w-full font-bold border-2 border-green-400 text-green-100"
                                style={{
                                    fontFamily: 'monospace',
                                    background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
                                    boxShadow: '0 3px 0 #166534'
                                }}
                                onClick={onNext}
                            >
                                ⚔️ CREATE STUDY SCHEDULE →
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
