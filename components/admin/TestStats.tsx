"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, BarChart3 } from "lucide-react";

interface TestStatsProps {
    totalTests: number;
    totalQuestions: number;
    averageQuestionsPerTest: number;
}

export const TestStats: React.FC<TestStatsProps> = ({
    totalTests,
    totalQuestions,
    averageQuestionsPerTest,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Tests */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Toplam Test
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-primary">{totalTests}</p>
                </CardContent>
            </Card>

            {/* Total Questions */}
            <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Toplam Soru
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {totalQuestions}
                    </p>
                </CardContent>
            </Card>

            {/* Average Questions per Test */}
            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-accent" />
                        Ortalama Soru/Test
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-accent">
                        {averageQuestionsPerTest.toFixed(1)}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
