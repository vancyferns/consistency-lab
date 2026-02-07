'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ConsistencyData {
    date: string
    count: number // 0 = no study, 1 = studied
}

interface HeatmapProps {
    data?: ConsistencyData[]
    startDate?: Date
}

export default function ConsistencyHeatmap({ data = [], startDate = new Date() }: HeatmapProps) {
    // Generate last 12 weeks of data
    const weeks = 12
    const daysPerWeek = 7
    const totalDays = weeks * daysPerWeek

    // Create date grid for heatmap
    const generateDateGrid = () => {
        const grid: ConsistencyData[][] = []
        const today = new Date()
        const start = new Date(today)
        start.setDate(start.getDate() - totalDays)

        let currentWeek: ConsistencyData[] = []

        for (let i = 0; i < totalDays; i++) {
            const date = new Date(start)
            date.setDate(date.getDate() + i)

            const dateString = date.toISOString().split('T')[0]
            const existingData = data.find(d => d.date === dateString)

            currentWeek.push({
                date: dateString,
                count: existingData?.count || 0
            })

            if (currentWeek.length === daysPerWeek) {
                grid.push([...currentWeek])
                currentWeek = []
            }
        }

        if (currentWeek.length > 0) {
            grid.push(currentWeek)
        }

        return grid
    }

    const grid = generateDateGrid()

    // Calculate stats
    const totalStudyDays = data.filter(d => d.count > 0).length
    const currentStreak = calculateStreak(data)
    const longestStreak = calculateLongestStreak(data)

    // Get color based on activity level
    const getColor = (count: number): string => {
        if (count === 0) return 'bg-gray-100'
        if (count === 1) return 'bg-green-500'
        if (count === 2) return 'bg-green-600'
        return 'bg-green-700'
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const getDayOfWeek = (dateString: string): string => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const date = new Date(dateString)
        return days[date.getDay()]
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span>🔥</span>
                    Consistency Heatmap
                </CardTitle>
                <CardDescription>
                    Your learning activity over the last {weeks} weeks
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">{totalStudyDays}</div>
                        <div className="text-sm text-gray-600">Total Study Days</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-orange-600">{currentStreak}</div>
                        <div className="text-sm text-gray-600">Current Streak</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">{longestStreak}</div>
                        <div className="text-sm text-gray-600">Longest Streak</div>
                    </div>
                </div>

                {/* Heatmap Grid */}
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        {/* Month labels */}
                        <div className="flex mb-2">
                            <div className="w-8"></div>
                            {grid.map((week, weekIdx) => {
                                if (weekIdx === 0 || weekIdx % 4 === 0) {
                                    const firstDate = new Date(week[0].date)
                                    return (
                                        <div key={weekIdx} className="text-xs text-gray-600 w-[52px]">
                                            {months[firstDate.getMonth()]}
                                        </div>
                                    )
                                }
                                return <div key={weekIdx} className="w-[13px]"></div>
                            })}
                        </div>

                        {/* Day labels + Grid */}
                        <div className="flex gap-[3px]">
                            {/* Day of week labels */}
                            <div className="flex flex-col gap-[3px] mr-2">
                                <div className="h-[10px] text-xs text-gray-600">Mon</div>
                                <div className="h-[10px]"></div>
                                <div className="h-[10px] text-xs text-gray-600">Wed</div>
                                <div className="h-[10px]"></div>
                                <div className="h-[10px] text-xs text-gray-600">Fri</div>
                                <div className="h-[10px]"></div>
                                <div className="h-[10px]"></div>
                            </div>

                            {/* Heatmap cells */}
                            <div className="flex gap-[3px]">
                                {grid.map((week, weekIdx) => (
                                    <div key={weekIdx} className="flex flex-col gap-[3px]">
                                        {week.map((day, dayIdx) => (
                                            <div
                                                key={dayIdx}
                                                className={`w-[10px] h-[10px] rounded-sm ${getColor(day.count)} hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all`}
                                                title={`${formatDate(day.date)}: ${day.count > 0 ? 'Studied' : 'No activity'}`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
                            <span>Less</span>
                            <div className="w-[10px] h-[10px] bg-gray-100 rounded-sm"></div>
                            <div className="w-[10px] h-[10px] bg-green-300 rounded-sm"></div>
                            <div className="w-[10px] h-[10px] bg-green-500 rounded-sm"></div>
                            <div className="w-[10px] h-[10px] bg-green-700 rounded-sm"></div>
                            <span>More</span>
                        </div>
                    </div>
                </div>

                {/* Motivation Message */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                        {currentStreak === 0 ? (
                            <>
                                <strong>Start your streak today!</strong> Study for just 15 minutes to keep the momentum going.
                            </>
                        ) : currentStreak === 1 ? (
                            <>
                                <strong>Great start!</strong> Keep it going tomorrow to build your streak.
                            </>
                        ) : currentStreak < 7 ? (
                            <>
                                <strong>{currentStreak} days strong!</strong> You're building an amazing habit. Don't break the chain!
                            </>
                        ) : (
                            <>
                                <strong>🔥 {currentStreak} day streak!</strong> You're unstoppable! Keep this consistency going.
                            </>
                        )}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

// Calculate current streak (consecutive days from today backwards)
function calculateStreak(data: ConsistencyData[]): number {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let streak = 0

    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(checkDate.getDate() - i)
        const dateString = checkDate.toISOString().split('T')[0]

        const dayData = data.find(d => d.date === dateString)
        if (dayData && dayData.count > 0) {
            streak++
        } else if (i > 0) {
            // Allow one skip for "yesterday" in case user hasn't studied today yet
            break
        }
    }

    return streak
}

// Calculate longest streak ever
function calculateLongestStreak(data: ConsistencyData[]): number {
    if (data.length === 0) return 0

    // Sort by date
    const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    let maxStreak = 0
    let currentStreak = 0
    let lastDate: Date | null = null

    for (const day of sorted) {
        if (day.count === 0) continue

        const currentDate = new Date(day.date)

        if (lastDate === null) {
            currentStreak = 1
        } else {
            const dayDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
            if (dayDiff === 1) {
                currentStreak++
            } else {
                maxStreak = Math.max(maxStreak, currentStreak)
                currentStreak = 1
            }
        }

        lastDate = currentDate
    }

    return Math.max(maxStreak, currentStreak)
}
