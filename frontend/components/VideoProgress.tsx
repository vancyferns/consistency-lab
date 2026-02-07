'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface Video {
    video_id: string
    title: string
    duration_seconds: number
    current_timestamp: number
    completed: boolean
    thumbnail?: string
}

interface VideoProgressProps {
    videos: Video[]
    onVideoClick?: (video: Video) => void
    onProgressUpdate?: (videoId: string, timestamp: number, completed: boolean) => void
}

export default function VideoProgress({ videos, onVideoClick, onProgressUpdate }: VideoProgressProps) {
    const [expandedVideo, setExpandedVideo] = useState<string | null>(null)

    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    const calculateProgress = (current: number, total: number): number => {
        if (total === 0) return 0
        return Math.min(Math.round((current / total) * 100), 100)
    }

    const getNextVideo = (): Video | null => {
        return videos.find(v => !v.completed) || null
    }

    const completedCount = videos.filter(v => v.completed).length
    const totalVideos = videos.length
    const overallProgress = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0

    const nextVideo = getNextVideo()

    return (
        <div className="space-y-6">
            {/* Overall Progress Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Course Progress</CardTitle>
                    <CardDescription>
                        {completedCount} of {totalVideos} videos completed
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Overall Completion</span>
                                <span className="font-semibold">{overallProgress}%</span>
                            </div>
                            <Progress value={overallProgress} className="h-3" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                                <div className="text-xs text-gray-600">Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{totalVideos - completedCount}</div>
                                <div className="text-xs text-gray-600">Remaining</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {videos.filter(v => v.current_timestamp > 0 && !v.completed).length}
                                </div>
                                <div className="text-xs text-gray-600">In Progress</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {Math.round(videos.reduce((sum, v) => sum + v.duration_seconds, 0) / 60)}m
                                </div>
                                <div className="text-xs text-gray-600">Total Time</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Next Up Card */}
            {nextVideo && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span>👉</span>
                            Up Next
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-start">
                            {nextVideo.thumbnail && (
                                <img
                                    src={nextVideo.thumbnail}
                                    alt={nextVideo.title}
                                    className="w-32 h-20 object-cover rounded"
                                />
                            )}
                            <div className="flex-1">
                                <h4 className="font-semibold mb-1">{nextVideo.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Duration: {formatDuration(nextVideo.duration_seconds)}
                                </p>
                                <Button
                                    onClick={() => onVideoClick && onVideoClick(nextVideo)}
                                    className="w-full md:w-auto"
                                >
                                    Continue Learning →
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Video List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Videos</CardTitle>
                    <CardDescription>
                        Track your progress through each video
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {videos.map((video, idx) => {
                            const progress = calculateProgress(video.current_timestamp, video.duration_seconds)
                            const isExpanded = expandedVideo === video.video_id

                            return (
                                <div
                                    key={video.video_id}
                                    className={`border rounded-lg p-4 transition-all ${video.completed ? 'bg-green-50 border-green-200' :
                                            video.current_timestamp > 0 ? 'bg-blue-50 border-blue-200' :
                                                'bg-white'
                                        }`}
                                >
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => setExpandedVideo(isExpanded ? null : video.video_id)}
                                    >
                                        {/* Status Icon */}
                                        <div className="flex-shrink-0">
                                            {video.completed ? (
                                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                                                    ✓
                                                </div>
                                            ) : video.current_timestamp > 0 ? (
                                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                                                    {progress}%
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                                                    {idx + 1}
                                                </div>
                                            )}
                                        </div>

                                        {/* Video Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm line-clamp-1">{video.title}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-600">
                                                    {formatDuration(video.duration_seconds)}
                                                </span>
                                                {video.completed && (
                                                    <Badge variant="default" className="text-xs">Completed</Badge>
                                                )}
                                                {!video.completed && video.current_timestamp > 0 && (
                                                    <Badge variant="secondary" className="text-xs">In Progress</Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Progress Bar (for in-progress videos) */}
                                        {!video.completed && video.current_timestamp > 0 && (
                                            <div className="hidden md:block w-32">
                                                <Progress value={progress} className="h-2" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t space-y-3">
                                            {!video.completed && (
                                                <div>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span>Progress</span>
                                                        <span>{progress}%</span>
                                                    </div>
                                                    <Progress value={progress} className="h-2" />
                                                    <div className="text-xs text-gray-600 mt-1">
                                                        {formatDuration(video.current_timestamp)} / {formatDuration(video.duration_seconds)}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => onVideoClick && onVideoClick(video)}
                                                >
                                                    {video.completed ? 'Rewatch' : video.current_timestamp > 0 ? 'Continue' : 'Start'}
                                                </Button>
                                                {video.current_timestamp > 0 && !video.completed && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => onProgressUpdate && onProgressUpdate(video.video_id, video.duration_seconds, true)}
                                                    >
                                                        Mark Complete
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {videos.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <p>No videos yet. Analyze a playlist to get started!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
