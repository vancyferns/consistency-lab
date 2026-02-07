'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface GoalPickerProps {
    totalDurationMinutes: number
    playlistTitle: string
    playlistId: string
    videos?: any[]
    onScheduleCreated?: (schedule: any) => void
    onScheduleSaved?: () => void
}

interface ScheduleData {
    start_date: string
    completion_date: string
    total_days: number
    study_sessions: number
    average_hours_per_week: number
    schedule: Array<{
        date: string
        day: string
        duration_minutes: number
        total_minutes?: number
        is_study_day?: boolean
        videos?: Array<{ title: string, duration_timestamp: string }>
    }>
}

const WEEKDAYS = [
    { id: 0, name: 'Monday', short: 'Mon' },
    { id: 1, name: 'Tuesday', short: 'Tue' },
    { id: 2, name: 'Wednesday', short: 'Wed' },
    { id: 3, name: 'Thursday', short: 'Thu' },
    { id: 4, name: 'Friday', short: 'Fri' },
    { id: 5, name: 'Saturday', short: 'Sat' },
    { id: 6, name: 'Sunday', short: 'Sun' },
]

export default function GoalPicker({ totalDurationMinutes, playlistTitle, playlistId, videos, onScheduleCreated, onScheduleSaved }: GoalPickerProps) {
    const router = useRouter()
    const [selectedDays, setSelectedDays] = useState<number[]>([0, 2, 4]) // Default: Mon, Wed, Fri
    const [hoursPerDay, setHoursPerDay] = useState<number>(2)
    const [startDate, setStartDate] = useState<Date>(new Date())
    const [loading, setLoading] = useState(false)
    const [schedule, setSchedule] = useState<ScheduleData | null>(null)
    const [error, setError] = useState('')

    const toggleDay = (dayId: number) => {
        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter(d => d !== dayId))
        } else {
            setSelectedDays([...selectedDays, dayId].sort())
        }
    }

    const calculateSchedule = async () => {
        if (selectedDays.length === 0) {
            setError('Please select at least one study day')
            return
        }

        if (hoursPerDay <= 0 || hoursPerDay > 12) {
            setError('Hours per day must be between 0.5 and 12')
            return
        }

        setLoading(true)
        setError('')

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            const response = await fetch(`${apiUrl}/api/schedule/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    total_duration_minutes: totalDurationMinutes,
                    study_days: selectedDays,
                    hours_per_day: hoursPerDay,
                    start_date: startDate.toISOString().split('T')[0],
                    videos: videos || []
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to generate schedule')
            }

            const data = await response.json()
            setSchedule(data)

            if (onScheduleCreated) {
                onScheduleCreated(data)
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while generating the schedule')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const totalHours = Math.ceil(totalDurationMinutes / 60)
    const estimatedWeeks = selectedDays.length > 0
        ? Math.ceil(totalHours / (selectedDays.length * hoursPerDay))
        : 0

    return (
        <div className="space-y-6">
            {/* Configuration Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Create Your Study Schedule</CardTitle>
                    <CardDescription>
                        Set your pace and get a personalized completion date for: <strong>{playlistTitle}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Study Days Selector */}
                    <div>
                        <label className="block font-medium mb-3 text-sm sm:text-base">Select Your Study Days</label>
                        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                            {WEEKDAYS.map((day) => (
                                <button
                                    key={day.id}
                                    onClick={() => toggleDay(day.id)}
                                    className={`
                    p-2 sm:p-3 rounded-lg border-2 transition-all text-xs sm:text-sm font-medium min-h-[44px]
                    ${selectedDays.includes(day.id)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                                        }
                  `}
                                >
                                    <div className="hidden sm:block">{day.name}</div>
                                    <div className="sm:hidden">{day.short}</div>
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Selected: {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''} per week
                        </p>
                    </div>

                    {/* Hours Per Day */}
                    <div>
                        <label htmlFor="hours-per-day" className="block font-medium mb-2">
                            Hours Per Study Session
                        </label>
                        <div className="flex items-center gap-4">
                            <Input
                                id="hours-per-day"
                                type="number"
                                min="0.5"
                                max="12"
                                step="0.5"
                                value={hoursPerDay}
                                onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
                                className="max-w-[150px]"
                            />
                            <span className="text-sm text-gray-600">hours</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Recommended: 1-3 hours for optimal retention
                        </p>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block font-medium mb-2">Start Date</label>
                        <div className="border rounded-lg p-4 inline-block">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={(date) => date && setStartDate(date)}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                className="rounded-md"
                            />
                        </div>
                    </div>

                    {/* Quick Stats Preview */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold mb-3">Schedule Preview</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <div className="text-gray-600">Total Content</div>
                                <div className="font-bold text-lg">{totalHours}h</div>
                            </div>
                            <div>
                                <div className="text-gray-600">Days/Week</div>
                                <div className="font-bold text-lg">{selectedDays.length}</div>
                            </div>
                            <div>
                                <div className="text-gray-600">Hours/Week</div>
                                <div className="font-bold text-lg">{(selectedDays.length * hoursPerDay).toFixed(1)}h</div>
                            </div>
                            <div>
                                <div className="text-gray-600">Est. Duration</div>
                                <div className="font-bold text-lg">
                                    {estimatedWeeks} week{estimatedWeeks !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={calculateSchedule}
                        disabled={loading || selectedDays.length === 0}
                        className="w-full"
                        size="lg"
                    >
                        {loading ? 'Generating Schedule...' : 'Generate My Schedule 🎯'}
                    </Button>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Schedule Results */}
            {schedule && (
                <div className="space-y-6">
                    {/* Completion Summary */}
                    <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>🎉</span>
                                Your Personalized Study Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center py-4">
                                    <div className="text-sm text-gray-600 mb-2">You'll complete this course by</div>
                                    <div className="text-3xl font-bold text-green-700">
                                        {formatDate(schedule.completion_date)}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2">
                                        Starting {formatDate(schedule.start_date)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{schedule.total_days}</div>
                                        <div className="text-xs text-gray-600">Total Days</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{schedule.study_sessions}</div>
                                        <div className="text-xs text-gray-600">Study Sessions</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{schedule.average_hours_per_week.toFixed(1)}h</div>
                                        <div className="text-xs text-gray-600">Hours/Week</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{hoursPerDay}h</div>
                                        <div className="text-xs text-gray-600">Hours/Session</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Calendar View */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Study Calendar (Next 30 Days)</CardTitle>
                            <CardDescription>
                                Study days are highlighted below
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {schedule.schedule.slice(0, 30).map((session, idx) => {
                                    // Handle both simple schedule (is_study_day) and video schedule (videos array)
                                    if (!session.is_study_day && !session.videos) return null

                                    return (
                                        <div
                                            key={idx}
                                            className="flex flex-col p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-700">
                                                        {new Date(session.date).getDate()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{session.day}</div>
                                                        <div className="text-sm text-gray-600">
                                                            {formatDate(session.date)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="secondary">
                                                        {((session.total_minutes || session.duration_minutes) / 60).toFixed(1)}h session
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Show assigned videos if available */}
                                            {session.videos && session.videos.length > 0 && (
                                                <div className="mt-2 pl-16">
                                                    <p className="text-xs font-semibold text-gray-500 mb-1">
                                                        Selected Videos ({session.videos.length}):
                                                    </p>
                                                    <ul className="space-y-1">
                                                        {session.videos.map((vid, vIdx) => (
                                                            <li key={vIdx} className="text-xs text-gray-700 flex justify-between">
                                                                <span className="truncate pr-2">• {vid.title}</span>
                                                                <span className="text-gray-400 shrink-0">{vid.duration_timestamp}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                                <p className="font-medium mb-2">💡 Pro Tips:</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• Set reminders for your study days</li>
                                    <li>• Break longer sessions into 25-minute focus blocks (Pomodoro)</li>
                                    <li>• Review previous material at the start of each session</li>
                                    <li>• Track your progress to build consistency</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Next Steps */}
                    <Card className="border-purple-200 bg-purple-50">
                        <CardHeader>
                            <CardTitle>🚀 Ready to Start?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-gray-700">
                                Your personalized schedule is ready! Here's what you can do next:
                            </p>
                            <div className="space-y-2">
                                <Button
                                    className="w-full"
                                    variant="default"
                                    onClick={async () => {
                                        try {
                                            const { data: { user } } = await supabase.auth.getUser()
                                            if (!user) {
                                                alert('Please sign in to save your schedule')
                                                return
                                            }

                                            setLoading(true)
                                            // Save to backend
                                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
                                            await fetch(`${apiUrl}/api/schedule/save`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    user_id: user.id,
                                                    schedule_data: schedule,
                                                    playlist_data: {
                                                        playlist_id: playlistId,
                                                        title: playlistTitle,
                                                        total_duration_minutes: totalDurationMinutes,
                                                        video_count: videos?.length || 0
                                                    },
                                                    study_days: selectedDays,
                                                    hours_per_day: hoursPerDay
                                                })
                                            })

                                            if (onScheduleSaved) onScheduleSaved()

                                        } catch (e) {
                                            console.error(e)
                                            alert('Failed to save schedule')
                                        } finally {
                                            setLoading(false)
                                        }
                                    }}
                                >
                                    Save Schedule & Start Learning
                                </Button>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => alert('Quiz feature coming next!')}
                                >
                                    Generate Quizzes for First Video
                                </Button>
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => alert('Chat feature coming next!')}
                                >
                                    Chat with AI Learning Assistant
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
