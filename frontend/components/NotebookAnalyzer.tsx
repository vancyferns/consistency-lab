'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface NotebookData {
    filename: string
    text_len: number
    preview_text: string
    ai_summary: {
        summary: string
        key_topics: string[]
        difficulty_level: string
        learning_objectives: string[]
        suggested_questions: string[]
        audio_overview_script: string
    }
}

export default function NotebookAnalyzer() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [data, setData] = useState<NotebookData | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setError('')
        }
    }

    const analyzeDocument = async () => {
        if (!file) {
            setError('Please select a file first')
            return
        }

        setLoading(true)
        setError('')
        setData(null)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            const response = await fetch(`${apiUrl}/api/notebook/analyze`, {
                method: 'POST',
                body: formData, // No Content-Type header needed, browser sets it for FormData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to analyze document')
            }

            const result = await response.json()
            setData(result)
        } catch (err: any) {
            setError(err.message || 'Error analyzing document')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>📄 Analyze Document (NotebookLM Style)</CardTitle>
                    <CardDescription>
                        Upload a PDF, Text, or Markdown file to generate an AI summary and learning guide.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-center">
                        <Input
                            type="file"
                            accept=".pdf,.txt,.md,.markdown"
                            onChange={handleFileChange}
                            className="flex-1"
                        />
                        <Button
                            onClick={analyzeDocument}
                            disabled={loading || !file}
                            className="min-w-[120px]"
                        >
                            {loading ? 'Analyzing...' : 'Analyze Doc'}
                        </Button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results */}
            {data && (
                <Card className="border-purple-200 bg-purple-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span>🧠</span>
                            Analysis: {data.filename}
                        </CardTitle>
                        <CardDescription>
                            Processed {data.text_len.toLocaleString()} characters
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Summary */}
                        <div>
                            <h4 className="font-semibold mb-2">Summary</h4>
                            <p className="text-gray-700 leading-relaxed">
                                {data.ai_summary.summary}
                            </p>
                        </div>

                        {/* Topics */}
                        <div>
                            <h4 className="font-semibold mb-2">Key Topics</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.ai_summary.key_topics.map((topic, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-800">
                                        {topic}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <h4 className="font-semibold mb-2">Complexity Level</h4>
                            <Badge variant="outline" className="border-purple-500 text-purple-700">
                                {data.ai_summary.difficulty_level}
                            </Badge>
                        </div>

                        {/* Learning Objectives */}
                        {data.ai_summary.learning_objectives?.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Learning Objectives</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {data.ai_summary.learning_objectives.map((obj, idx) => (
                                        <li key={idx}>{obj}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Audio Overview Script - Chat UI */}
                        {data.ai_summary.audio_overview_script && (
                            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-slate-700">
                                    <span>🎙️</span> AI Podcast Script (Simulated)
                                </h4>
                                <div className="space-y-4 max-h-[500px] overflow-y-auto p-2 pr-4">
                                    {data.ai_summary.audio_overview_script.split('\n').map((line, i) => {
                                        if (!line.trim()) return null;
                                        // Detect speaker loosely to handle formatting variations
                                        const isHostB = line.toLowerCase().includes('host b');
                                        const isHostA = line.toLowerCase().includes('host a');

                                        // If not a dialogue line (e.g. title), render normally
                                        if (!isHostA && !isHostB) return (
                                            <div key={i} className="text-center text-xs text-gray-400 italic my-2">{line}</div>
                                        );

                                        const text = line.replace(/^.*?:\s*/, '').trim();
                                        if (!text) return null;

                                        return (
                                            <div key={i} className={`flex ${isHostB ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex flex-col max-w-[85%] ${isHostB ? 'items-end' : 'items-start'}`}>
                                                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 px-1 ${isHostB ? 'text-purple-600' : 'text-slate-500'}`}>
                                                        {isHostB ? 'Host B' : 'Host A'}
                                                    </div>
                                                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isHostB
                                                            ? 'bg-purple-600 text-white rounded-tr-sm'
                                                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                                                        }`}>
                                                        {text}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Suggested Questions */}
                        {data.ai_summary.suggested_questions?.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Deep Dive Questions</h4>
                                <ul className="space-y-2">
                                    {data.ai_summary.suggested_questions.map((q: string, idx: number) => (
                                        <li key={idx} className="bg-white p-3 rounded border text-sm text-gray-700 shadow-sm">
                                            🤔 {q}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
