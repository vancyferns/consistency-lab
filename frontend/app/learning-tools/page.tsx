'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuizGenerator from '@/components/QuizGenerator';
import FlashcardsGenerator from '@/components/FlashcardsGenerator';
import VideoSummaryGenerator from '@/components/VideoSummaryGenerator';
import LearningAnalytics from '@/components/LearningAnalytics';
import { Brain, BookOpen, FileText, TrendingUp, Sparkles } from 'lucide-react';

export default function LearningToolsPage() {
    // Mock data - replace with actual data from your app state
    const [selectedVideo] = useState({
        id: 'dQw4w9WgXcQ',
        title: 'Introduction to Linear Algebra'
    });
    const [userId] = useState('user123');

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <Sparkles className="h-10 w-10 text-purple-600" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            AI Learning Tools
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Supercharge your learning with AI-powered quizzes, flashcards, summaries, and personalized insights
                    </p>
                </div>

                {/* Main Content */}
                <Card className="border-2 border-purple-200 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                        <CardTitle className="text-2xl">
                            Currently Learning: {selectedVideo.title}
                        </CardTitle>
                        <CardDescription>
                            Choose a learning tool below to enhance your study session
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Tabs defaultValue="summary" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-4 h-auto">
                                <TabsTrigger value="summary" className="flex flex-col gap-2 py-3">
                                    <FileText className="h-5 w-5" />
                                    <span className="text-sm">Summary</span>
                                </TabsTrigger>
                                <TabsTrigger value="quiz" className="flex flex-col gap-2 py-3">
                                    <Brain className="h-5 w-5" />
                                    <span className="text-sm">Quiz</span>
                                </TabsTrigger>
                                <TabsTrigger value="flashcards" className="flex flex-col gap-2 py-3">
                                    <BookOpen className="h-5 w-5" />
                                    <span className="text-sm">Flashcards</span>
                                </TabsTrigger>
                                <TabsTrigger value="analytics" className="flex flex-col gap-2 py-3">
                                    <TrendingUp className="h-5 w-5" />
                                    <span className="text-sm">Analytics</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="summary" className="space-y-4">
                                <VideoSummaryGenerator
                                    videoId={selectedVideo.id}
                                    videoTitle={selectedVideo.title}
                                />
                            </TabsContent>

                            <TabsContent value="quiz" className="space-y-4">
                                <QuizGenerator
                                    videoId={selectedVideo.id}
                                    videoTitle={selectedVideo.title}
                                />
                            </TabsContent>

                            <TabsContent value="flashcards" className="space-y-4">
                                <FlashcardsGenerator
                                    videoId={selectedVideo.id}
                                    videoTitle={selectedVideo.title}
                                />
                            </TabsContent>

                            <TabsContent value="analytics" className="space-y-4">
                                <LearningAnalytics userId={userId} />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Features Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <FileText className="h-8 w-8 text-indigo-600 mb-2" />
                            <CardTitle className="text-lg">AI Summaries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Get comprehensive video summaries with key points, takeaways, and next steps
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <Brain className="h-8 w-8 text-purple-600 mb-2" />
                            <CardTitle className="text-lg">Smart Quizzes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Test your knowledge with AI-generated quizzes tailored to video content
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                            <CardTitle className="text-lg">Flashcards</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Master concepts faster with AI-generated flashcards and spaced repetition
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                            <CardTitle className="text-lg">Analytics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">
                                Get personalized insights and predictions about your learning journey
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tips Section */}
                <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            💡 Pro Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600 font-bold">→</span>
                                <span>Start with the <strong>Summary</strong> to get a quick overview before watching</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600 font-bold">→</span>
                                <span>Use <strong>Flashcards</strong> for daily review using spaced repetition</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600 font-bold">→</span>
                                <span>Take <strong>Quizzes</strong> after watching to test your understanding</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600 font-bold">→</span>
                                <span>Check <strong>Analytics</strong> weekly to optimize your study schedule</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
