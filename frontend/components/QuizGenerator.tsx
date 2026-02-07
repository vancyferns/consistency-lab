'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';

interface QuizQuestion {
    question: string;
    options: { [key: string]: string };
    correct_answer: string;
    explanation: string;
}

interface QuizGeneratorProps {
    videoId: string;
    videoTitle: string;
}

export default function QuizGenerator({ videoId, videoTitle }: QuizGeneratorProps) {
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

    const generateQuiz = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/learning-tools/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    video_id: videoId,
                    difficulty,
                    num_questions: 5
                })
            });

            const data = await response.json();
            if (data.success) {
                setQuiz(data.quiz);
                setCurrentQuestion(0);
                setSelectedAnswers({});
                setShowResults(false);
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex: number, answer: string) => {
        setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answer });
    };

    const submitQuiz = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/learning-tools/submit-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 'user123', // TODO: Get from auth
                    video_id: videoId,
                    answers: selectedAnswers,
                    questions: quiz
                })
            });

            const data = await response.json();
            if (data.success) {
                setResults(data);
                setShowResults(true);
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    if (quiz.length === 0) {
        return (
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="h-6 w-6 text-purple-600" />
                        Test Your Knowledge
                    </CardTitle>
                    <CardDescription>
                        Generate an AI-powered quiz based on this video
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Select Difficulty</label>
                        <div className="flex gap-2">
                            {(['easy', 'medium', 'hard'] as const).map((level) => (
                                <Button
                                    key={level}
                                    variant={difficulty === level ? 'default' : 'outline'}
                                    onClick={() => setDifficulty(level)}
                                    className="capitalize"
                                >
                                    {level}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={generateQuiz}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Quiz...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Quiz
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    if (showResults && results) {
        return (
            <Card className="border-2 border-green-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                        Quiz Results
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center space-y-4">
                        <div className="text-6xl font-bold text-purple-600">{results.score}%</div>
                        <div className="text-xl">
                            {results.correct} out of {results.total} correct
                        </div>
                        <Badge variant={results.passed ? 'default' : 'destructive'} className="text-lg py-2 px-4">
                            {results.passed ? '✅ Passed!' : '❌ Keep Practicing'}
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Review Your Answers</h3>
                        {results.results.map((result: any, idx: number) => (
                            <div
                                key={idx}
                                className={`p-4 rounded-lg border-2 ${result.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                    }`}
                            >
                                <div className="flex items-start gap-2 mb-2">
                                    {result.is_correct ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-600 mt-1" />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium">{quiz[idx].question}</p>
                                        {!result.is_correct && (
                                            <div className="mt-2 space-y-1 text-sm">
                                                <p className="text-red-700">
                                                    Your answer: <span className="font-semibold">{result.user_answer}</span>
                                                </p>
                                                <p className="text-green-700">
                                                    Correct answer: <span className="font-semibold">{result.correct_answer}</span>
                                                </p>
                                            </div>
                                        )}
                                        <p className="mt-2 text-sm text-gray-600">{result.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button onClick={generateQuiz} variant="outline" className="flex-1">
                        Try Again
                    </Button>
                    <Button
                        onClick={() => {
                            setQuiz([]);
                            setShowResults(false);
                        }}
                        className="flex-1"
                    >
                        New Quiz
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    const question = quiz[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.length) * 100;

    return (
        <Card className="border-2 border-purple-200">
            <CardHeader>
                <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">
                        Question {currentQuestion + 1} of {quiz.length}
                    </CardTitle>
                    <Badge variant="outline">{difficulty}</Badge>
                </div>
                <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <h3 className="text-xl font-semibold">{question.question}</h3>

                <div className="space-y-3">
                    {Object.entries(question.options).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => handleAnswerSelect(currentQuestion, key)}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${selectedAnswers[currentQuestion] === key
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-200 hover:border-purple-300'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <span className="font-bold text-purple-600 mt-1">{key}.</span>
                                <span className="flex-1">{value}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    variant="outline"
                    disabled={currentQuestion === 0}
                >
                    Previous
                </Button>
                {currentQuestion === quiz.length - 1 ? (
                    <Button
                        onClick={submitQuiz}
                        disabled={Object.keys(selectedAnswers).length !== quiz.length || loading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Quiz'
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={() => setCurrentQuestion(Math.min(quiz.length - 1, currentQuestion + 1))}
                        className="flex-1"
                        disabled={!selectedAnswers[currentQuestion]}
                    >
                        Next Question
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
