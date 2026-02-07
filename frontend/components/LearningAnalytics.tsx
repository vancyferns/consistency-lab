'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Brain, Calendar, Lightbulb, Target, Loader2 } from 'lucide-react';

interface LearningInsights {
    pattern_analysis: string;
    completion_probability: string;
    optimal_review_times: string[];
    recommendations: string[];
}

interface LearningAnalyticsProps {
    userId: string;
}

export default function LearningAnalytics({ userId }: LearningAnalyticsProps) {
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState<LearningInsights | null>(null);
    const [showSpacedRepetition, setShowSpacedRepetition] = useState(false);
    const [srSchedule, setSRSchedule] = useState<any>(null);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/progress/ai-insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });

            const data = await response.json();
            if (data.success) {
                setInsights(data.insights);
            }
        } catch (error) {
            console.error('Error fetching insights:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSpacedRepetition = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/learning-tools/spaced-repetition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });

            const data = await response.json();
            if (data.success) {
                setSRSchedule(data.schedule);
                setShowSpacedRepetition(true);
            }
        } catch (error) {
            console.error('Error fetching spaced repetition:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, [userId]);

    if (loading && !insights) {
        return (
            <Card className="border-2 border-purple-200">
                <CardContent className="py-12 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Analyzing your learning patterns...</p>
                </CardContent>
            </Card>
        );
    }

    if (!insights) {
        return (
            <Card className="border-2 border-purple-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="h-6 w-6 text-purple-600" />
                        AI Learning Insights
                    </CardTitle>
                    <CardDescription>
                        Get personalized insights about your learning journey
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button
                        onClick={fetchInsights}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                        Generate Insights
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Pattern Analysis */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Learning Pattern Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg leading-relaxed">{insights.pattern_analysis}</p>
                </CardContent>
            </Card>

            {/* Completion Probability */}
            <Card className="border-2 border-green-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-600" />
                        Completion Prediction
                    </CardTitle>
                    <CardDescription>
                        AI-powered probability based on your current progress
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-green-600 mb-2">
                            {insights.completion_probability.match(/\d+/)?.[0] || '78'}%
                        </div>
                        <p className="text-gray-600">{insights.completion_probability}</p>
                    </div>
                    <Progress
                        value={parseInt(insights.completion_probability.match(/\d+/)?.[0] || '78')}
                        className="h-3"
                    />
                </CardContent>
            </Card>

            {/* Optimal Review Times */}
            <Card className="border-2 border-orange-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-orange-600" />
                        Optimal Review Schedule
                    </CardTitle>
                    <CardDescription>
                        Spaced repetition for maximum retention
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {insights.optimal_review_times.map((time, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                            >
                                <Badge className="bg-orange-600">{index + 1}</Badge>
                                <span className="flex-1 font-medium">{time}</span>
                                <span className="text-sm text-gray-500">📅</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={fetchSpacedRepetition}
                        variant="outline"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Calendar className="mr-2 h-4 w-4" />
                        )}
                        Get Detailed 30-Day Schedule
                    </Button>
                </CardFooter>
            </Card>

            {/* Spaced Repetition Schedule */}
            {showSpacedRepetition && srSchedule && (
                <Card className="border-2 border-purple-200 bg-purple-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-purple-600" />
                            30-Day Spaced Repetition Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {srSchedule.schedule?.map((day: any, index: number) => (
                                <div
                                    key={index}
                                    className="p-4 bg-white rounded-lg border-2 border-purple-300"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge variant="outline" className="text-lg">
                                            Day {day.day}
                                        </Badge>
                                        <span className="text-sm text-gray-500">
                                            {srSchedule.estimated_time_per_day?.[day.day] || '30 min'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{day.reason}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {day.topics?.map((topic: string, idx: number) => (
                                            <Badge key={idx} variant="secondary">
                                                {topic}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recommendations */}
            <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-indigo-600" />
                        Personalized Recommendations
                    </CardTitle>
                    <CardDescription>
                        AI-powered tips to improve your learning
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {insights.recommendations.map((rec, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-indigo-200 hover:border-indigo-400 transition-colors"
                            >
                                <span className="text-2xl shrink-0">💡</span>
                                <div className="flex-1">
                                    <p className="font-medium">{rec}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Refresh Button */}
            <Card>
                <CardContent className="pt-6">
                    <Button
                        onClick={fetchInsights}
                        variant="outline"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating Insights...
                            </>
                        ) : (
                            <>
                                <Brain className="mr-2 h-4 w-4" />
                                Refresh Insights
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
