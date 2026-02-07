'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Loader2, Sparkles, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

interface Flashcard {
    front: string;
    back: string;
    category: string;
}

interface FlashcardsProps {
    videoId: string;
    videoTitle: string;
}

export default function FlashcardsGenerator({ videoId, videoTitle }: FlashcardsProps) {
    const [loading, setLoading] = useState(false);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());

    const generateFlashcards = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/learning-tools/generate-flashcards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    video_id: videoId,
                    num_cards: 10
                })
            });

            const data = await response.json();
            if (data.success) {
                setFlashcards(data.flashcards);
                setCurrentCard(0);
                setIsFlipped(false);
                setMasteredCards(new Set());
            }
        } catch (error) {
            console.error('Error generating flashcards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
    };

    const handlePrevious = () => {
        setIsFlipped(false);
        setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    const markAsMastered = () => {
        const newMastered = new Set(masteredCards);
        newMastered.add(currentCard);
        setMasteredCards(newMastered);
        handleNext();
    };

    const markAsNeedReview = () => {
        const newMastered = new Set(masteredCards);
        newMastered.delete(currentCard);
        setMasteredCards(newMastered);
        handleNext();
    };

    if (flashcards.length === 0) {
        return (
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                        Study Flashcards
                    </CardTitle>
                    <CardDescription>
                        AI-generated flashcards for faster learning and retention
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 space-y-4">
                        <div className="text-6xl">🎴</div>
                        <p className="text-gray-600">
                            Generate flashcards to memorize key concepts from this video
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={generateFlashcards}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Flashcards...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Flashcards
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    const card = flashcards[currentCard];
    const progress = (masteredCards.size / flashcards.length) * 100;

    return (
        <div className="space-y-4">
            {/* Progress Bar */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                                Card {currentCard + 1} of {flashcards.length}
                            </span>
                            <span className="font-semibold text-green-600">
                                {masteredCards.size} mastered ({Math.round(progress)}%)
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Flashcard */}
            <div
                onClick={handleFlip}
                className="relative cursor-pointer"
                style={{ perspective: '1000px' }}
            >
                <div
                    className={`relative transition-transform duration-500 transform-gpu ${isFlipped ? 'rotate-y-180' : ''
                        }`}
                    style={{
                        transformStyle: 'preserve-3d',
                        minHeight: '300px'
                    }}
                >
                    {/* Front of Card */}
                    <Card
                        className={`absolute inset-0 border-4 border-blue-300 ${isFlipped ? 'invisible' : 'visible'
                            }`}
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <CardHeader className="text-center bg-blue-50">
                            <Badge variant="outline" className="w-fit mx-auto">
                                {card.category}
                            </Badge>
                            <CardTitle className="text-sm text-blue-600">Question</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center min-h-[200px] p-8">
                            <p className="text-2xl font-semibold text-center">{card.front}</p>
                        </CardContent>
                        <CardFooter className="justify-center text-sm text-gray-500">
                            Click to reveal answer
                        </CardFooter>
                    </Card>

                    {/* Back of Card */}
                    <Card
                        className={`absolute inset-0 border-4 border-green-300 ${!isFlipped ? 'invisible' : 'visible'
                            }`}
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                        }}
                    >
                        <CardHeader className="text-center bg-green-50">
                            <Badge variant="outline" className="w-fit mx-auto">
                                {card.category}
                            </Badge>
                            <CardTitle className="text-sm text-green-600">Answer</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center min-h-[200px] p-8">
                            <p className="text-xl text-center">{card.back}</p>
                        </CardContent>
                        <CardFooter className="justify-center text-sm text-gray-500">
                            Click to flip back
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="border-2 border-orange-200">
                    <CardContent className="pt-6">
                        <Button
                            onClick={markAsNeedReview}
                            variant="outline"
                            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                            <RotateCw className="mr-2 h-4 w-4" />
                            Need Review
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-2 border-green-200">
                    <CardContent className="pt-6">
                        <Button
                            onClick={markAsMastered}
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            ✓ Mastered
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Navigation */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-2">
                        <Button
                            onClick={handlePrevious}
                            variant="outline"
                            className="flex-1"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Button>
                        <Button
                            onClick={handleFlip}
                            variant="outline"
                            className="flex-1"
                        >
                            <RotateCw className="mr-2 h-4 w-4" />
                            Flip
                        </Button>
                        <Button
                            onClick={handleNext}
                            className="flex-1"
                        >
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            {masteredCards.size === flashcards.length && (
                <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="text-6xl">🎉</div>
                        <div>
                            <h3 className="text-2xl font-bold text-green-700">
                                All Cards Mastered!
                            </h3>
                            <p className="text-gray-600 mt-2">
                                Great job! You've reviewed all flashcards from this video.
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                setMasteredCards(new Set());
                                setCurrentCard(0);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Review Again
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
