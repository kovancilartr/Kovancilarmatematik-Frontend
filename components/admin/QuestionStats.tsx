"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BookOpen, Target, BarChart3 } from "lucide-react";

interface QuestionStatsProps {
    totalQuestions: number;
    byCategory: Record<string, number>;
    byDifficulty: {
        easy: number;
        medium: number;
        hard: number;
    };
    filteredCount?: number;
}

export const QuestionStats: React.FC<QuestionStatsProps> = ({
    totalQuestions,
    byCategory,
    byDifficulty,
    filteredCount,
}) => {
    const isFiltered = filteredCount !== undefined && filteredCount !== totalQuestions;
    const displayCount = isFiltered ? filteredCount : totalQuestions;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Questions */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        {isFiltered ? "Gösterilen Sorular" : "Toplam Soru"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-primary">{displayCount}</p>
                        {isFiltered && (
                            <p className="text-sm text-muted-foreground">/ {totalQuestions}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Difficulty Distribution - Easy */}
            <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                        Kolay Sorular
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {byDifficulty.easy}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {totalQuestions > 0
                                ? `${Math.round((byDifficulty.easy / totalQuestions) * 100)}%`
                                : "0%"}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Difficulty Distribution - Medium */}
            <Card className="border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        Orta Sorular
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                            {byDifficulty.medium}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {totalQuestions > 0
                                ? `${Math.round((byDifficulty.medium / totalQuestions) * 100)}%`
                                : "0%"}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Difficulty Distribution - Hard */}
            <Card className="border-2 border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        Zor Sorular
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                            {byDifficulty.hard}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {totalQuestions > 0
                                ? `${Math.round((byDifficulty.hard / totalQuestions) * 100)}%`
                                : "0%"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
