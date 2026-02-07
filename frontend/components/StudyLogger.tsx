'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface StudyLog {
    id: string
    date: string
    minutes_watched: number
    videos_completed: number
    notes?: string
}

interface StudyLoggerProps {
    onLogCreated?: (log: Omit<StudyLog, 'id'>) => void
}

export default function StudyLogger({ onLogCreated }: StudyLoggerProps) {
    const [minutes, setMinutes] = useState<number>(30)
    const [notes, setNotes] = useState<string>('')
    const [todayLogged, setTodayLogged] = useState(false)

    const handleLogSession = () => {
        const log: Omit<StudyLog, 'id'> = {
            date: new Date().toISOString().split('T')[0],
            minutes_watched: minutes,
            videos_completed: 0,
            notes: notes || undefined
        }

        if (onLogCreated) {
            onLogCreated(log)
        }

        setTodayLogged(true)
        setNotes('')

        // Show success message briefly
        setTimeout(() => {
            setTodayLogged(false)
        }, 3000)
    }

    const quickMinutes = [15, 30, 45, 60, 90, 120]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span>📝</span>
                    Log Today's Study Session
                </CardTitle>
                <CardDescription>
                    Track your daily learning to build consistency
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {todayLogged ? (
                    <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <h3 className="font-semibold text-lg mb-1">Session Logged!</h3>
                        <p className="text-sm text-gray-600">
                            Great job! You studied for {minutes} minutes today.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => setTodayLogged(false)}
                        >
                            Log Another Session
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Quick Time Buttons */}
                        <div>
                            <label className="block font-medium mb-2 text-sm">
                                How long did you study?
                            </label>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {quickMinutes.map((min) => (
                                    <button
                                        key={min}
                                        onClick={() => setMinutes(min)}
                                        className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${minutes === min
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                                            }`}
                                    >
                                        {min} min
                                    </button>
                                ))}
                            </div>

                            {/* Custom Input */}
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min="1"
                                    max="720"
                                    value={minutes}
                                    onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                                    className="max-w-[120px]"
                                />
                                <span className="text-sm text-gray-600">minutes</span>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label htmlFor="study-notes" className="block font-medium mb-2 text-sm">
                                Notes (Optional)
                            </label>
                            <Input
                                id="study-notes"
                                placeholder="What did you learn today?"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Quick reflection helps retention
                            </p>
                        </div>

                        {/* Log Button */}
                        <Button
                            onClick={handleLogSession}
                            disabled={minutes <= 0}
                            className="w-full"
                            size="lg"
                        >
                            Log {minutes} Minutes 🎯
                        </Button>

                        {/* Motivation */}
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
                            <p className="font-medium mb-1">💡 Pro Tip</p>
                            <p className="text-xs">
                                Even 15 minutes counts! Consistency beats intensity.
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
