"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Question } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, AlertTriangle, Target, GraduationCap, Tag } from "lucide-react";
import { UpsertQuestionModal } from "@/components/modal/UpsertQuestionModal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QuestionCardProps {
    question: Question;
    index: number;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
    viewMode?: "grid" | "list" | "compact";
}

const getDifficultyColor = (difficulty: number): string => {
    if (difficulty <= 3) return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    if (difficulty <= 6) return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
};

const getDifficultyLabel = (difficulty: number): string => {
    if (difficulty <= 3) return "Kolay";
    if (difficulty <= 6) return "Orta";
    return "Zor";
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    index,
    onDelete,
    isDeleting = false,
    viewMode = "grid",
}) => {
    // List view - Kompakt horizontal tasarım
    if (viewMode === "list") {
        return (
            <div className="group bg-card border border-border rounded-lg hover:shadow-lg transition-all p-4">
                <div className="flex items-center gap-4">
                    {/* Index */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        #{index}
                    </div>

                    {/* Image - Smaller */}
                    <div className="flex-shrink-0 relative w-24 h-24 rounded-lg overflow-hidden bg-muted/50">
                        <Image
                            src={question.imageUrl}
                            alt={`Soru ${index}`}
                            fill
                            className="object-contain"
                            sizes="96px"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5">
                            <Badge variant="outline" className={`${getDifficultyColor(question.difficulty)} text-xs py-0`}>
                                {getDifficultyLabel(question.difficulty)}
                            </Badge>
                            {question.learningObjective?.name && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs py-0">
                                    {question.learningObjective.name}
                                </Badge>
                            )}
                            {question.learningObjective?.subject?.name && (
                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-xs py-0">
                                    {question.learningObjective.subject.name}
                                </Badge>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Doğru: <strong className="text-primary">{question.correctAnswer.toUpperCase()}</strong></span>
                            <span>Zorluk: <strong>{question.difficulty}/10</strong></span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex gap-2">
                        <UpsertQuestionModal question={question}>
                            <Button variant="outline" size="sm" className="gap-1">
                                <Edit className="h-3 w-3" />
                            </Button>
                        </UpsertQuestionModal>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1" disabled={isDeleting}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Soru #{index} silinecektir. Bu işlem geri alınamaz.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(question.id)}
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
                                        Sil
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
        );
    }

    // Grid/Compact view - Original design
    return (
        <div className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-1">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary font-bold text-sm">
                            #{index}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-foreground">
                                Soru {index}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                ID: {question.id.slice(0, 8)}...
                            </p>
                        </div>
                    </div>

                    <Badge
                        variant="outline"
                        className={`${getDifficultyColor(question.difficulty)} font-medium border`}
                    >
                        {getDifficultyLabel(question.difficulty)}
                    </Badge>
                </div>

                {/* Question Image */}
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted/50 dark:bg-muted/30 group/image">
                    <Image
                        src={question.imageUrl}
                        alt={`Soru ${index}`}
                        fill
                        className="object-contain transition-transform duration-500 group-hover/image:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Image overlay action */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2"
                            onClick={() => window.open(question.imageUrl, '_blank')}
                        >
                            <Eye className="h-4 w-4" />
                            Büyük Göster
                        </Button>
                    </div>
                </div>


                {/* Learning Objective / Subject / Category */}
                {question.learningObjective && (
                    <div className="flex flex-wrap gap-2">
                        {question.learningObjective.name && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                <Target className="w-3 h-3 mr-1" />
                                {question.learningObjective.name}
                            </Badge>
                        )}
                        {question.learningObjective.subject?.name && (
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                                <GraduationCap className="w-3 h-3 mr-1" />
                                {question.learningObjective.subject.name}
                            </Badge>
                        )}
                        {question.learningObjective.subject?.category?.name && (
                            <Badge variant="outline" className="text-muted-foreground">
                                <Tag className="w-3 h-3 mr-1" />
                                {question.learningObjective.subject.category.name}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-muted-foreground">Doğru Cevap:</span>
                        <span className="font-bold text-primary text-base">
                            {question.correctAnswer.toUpperCase()}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-muted-foreground">Zorluk:</span>
                        <span className="font-semibold text-foreground">
                            {question.difficulty}/10
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/50 dark:border-border/30">
                    <UpsertQuestionModal question={question}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary hover:border-primary transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                            Düzenle
                        </Button>
                    </UpsertQuestionModal>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 gap-2 hover:bg-destructive/10 dark:hover:bg-destructive/20 hover:text-destructive hover:border-destructive transition-colors"
                                disabled={isDeleting}
                            >
                                <Trash2 className="h-4 w-4" />
                                {isDeleting ? "Siliniyor..." : "Sil"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                    Soruyu Sil
                                </AlertDialogTitle>
                                <AlertDialogDescription className="space-y-2">
                                    <span className="block">
                                        Bu soruyu silmek istediğinizden emin misiniz?
                                    </span>
                                    <span className="block text-foreground font-medium">
                                        Soru #{index} - ID: {question.id.slice(0, 8)}...
                                    </span>
                                    <span className="block text-destructive font-semibold">
                                        Bu işlem geri alınamaz!
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(question.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    Evet, Sil
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
};
