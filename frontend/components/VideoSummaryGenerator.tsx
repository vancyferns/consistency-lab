'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, Sparkles, BookOpen, Target, Lightbulb, ArrowRight } from 'lucide-react';

interface VideoSummary {
    tldr: string;
    key_points: string[];
    takeaways: string[];
    prerequisites: string[];
    next_steps: string[];
}

interface VideoSummaryProps {
    videoId: string;
    videoTitle: string;
}

export default function VideoSummaryGenerator({ videoId, videoTitle }: VideoSummaryProps) {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<VideoSummary | null>(null);

    const generateSummary = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/learning-tools/video-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    video_id: videoId,
                    title: videoTitle
                })
            });

            const data = await response.json();
            if (data.success) {
                setSummary(data.summary);
            }
        } catch (error) {
            console.error('Error generating summary:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!summary) {
        return (
            <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-indigo-600" />
                        AI Video Summary
                    </CardTitle>
                    <CardDescription>
                        Get a comprehensive summary of this video's content
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 space-y-4">
                        <div className="text-6xl">📝</div>
                        <p className="text-gray-600">
                            Generate an AI-powered summary to quickly understand the key concepts
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={generateSummary}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Summary...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Summary
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* TL;DR Section */}
            <Card className="border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-white">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-600">TL;DR</Badge>
                        <CardTitle className="text-lg">Quick Summary</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-lg leading-relaxed">{summary.tldr}</p>
                </CardContent>
            </Card>

            {/* Key Points */}
            <Card className="border-2 border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        Key Points
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {summary.key_points.map((point, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Badge variant="outline" className="mt-1 shrink-0">
                                    {index + 1}
                                </Badge>
                                <span className="flex-1">{point}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Main Takeaways */}
            <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-600" />
                        Main Takeaways
                    </CardTitle>
                    <CardDescription>
                        Actionable insights you can apply immediately
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {summary.takeaways.map((takeaway, index) => (
                            <div
                                key={index}
                                className="p-4 bg-white rounded-lg border-2 border-green-300"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">💡</span>
                                    <p className="flex-1 font-medium">{takeaway}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card className="border-2 border-orange-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-orange-600" />
                        Prerequisites
                    </CardTitle>
                    <CardDescription>
                        What you should know before watching
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {summary.prerequisites.map((prereq, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="border-orange-300 text-orange-700 px-3 py-1"
                            >
                                {prereq}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRight className="h-5 w-5 text-purple-600" />
                        Next Steps
                    </CardTitle>
                    <CardDescription>
                        Continue your learning journey
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {summary.next_steps.map((step, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                            >
                                <span className="text-xl shrink-0">→</span>
                                <span className="flex-1">{step}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Actions */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setSummary(null)}
                            variant="outline"
                            className="flex-1"
                        >
                            Generate New
                        </Button>
                        <Button
                            onClick={() => {
                                // Copy summary to clipboard
                                const text = `
TL;DR: ${summary.tldr}

Key Points:
${summary.key_points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Main Takeaways:
${summary.takeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Prerequisites: ${summary.prerequisites.join(', ')}

Next Steps:
${summary.next_steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
                `.trim();
                                navigator.clipboard.writeText(text);
                            }}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        >
                            📋 Copy Summary
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
