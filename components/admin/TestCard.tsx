"use client";

import React from "react";
import { Test } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, FileText, Calendar, User, AlertTriangle } from "lucide-react";
import { UpsertTestModal } from "@/components/modal/UpsertTestModal";
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

interface TestCardProps {
    test: Test;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
}

export const TestCard: React.FC<TestCardProps> = ({
    test,
    onDelete,
    isDeleting = false,
}) => {
    const questionCount = test.questions?.length || 0;
    const createdDate = new Date(test.createdAt || Date.now()).toLocaleDateString('tr-TR');

    return (
        <div className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-1">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {test.name}
                        </h3>
                        {test.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {test.description}
                            </p>
                        )}
                    </div>

                    <Badge
                        variant="outline"
                        className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 font-medium shrink-0"
                    >
                        <FileText className="h-3 w-3 mr-1" />
                        {questionCount} Soru
                    </Badge>
                </div>

                {/* Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm pt-2 border-t border-border/50 dark:border-border/30">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{createdDate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="text-xs">ID: {test.id.slice(0, 8)}...</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                    <UpsertTestModal test={test}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary hover:border-primary transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                            Düzenle
                        </Button>
                    </UpsertTestModal>

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
                                    Testi Sil
                                </AlertDialogTitle>
                                <AlertDialogDescription className="space-y-2">
                                    <span className="block">
                                        Bu testi silmek istediğinizden emin misiniz?
                                    </span>
                                    <span className="block text-foreground font-medium">
                                        {test.name}
                                    </span>
                                    <span className="block text-muted-foreground text-sm">
                                        {questionCount} soru içeriyor
                                    </span>
                                    <span className="block text-destructive font-semibold">
                                        Bu işlem geri alınamaz!
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(test.id)}
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
