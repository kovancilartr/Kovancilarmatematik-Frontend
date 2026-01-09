"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    X,
    Grid3x3,
    List,
    SlidersHorizontal,
    Filter
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type ViewMode = "grid" | "list" | "compact";

interface QuestionFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    selectedSubject: string;
    onSubjectChange: (subject: string) => void;
    selectedDifficulty: string;
    onDifficultyChange: (difficulty: string) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    categories: string[];
    subjects: string[];
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

export const QuestionFilters: React.FC<QuestionFiltersProps> = ({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    selectedSubject,
    onSubjectChange,
    selectedDifficulty,
    onDifficultyChange,
    viewMode,
    onViewModeChange,
    categories,
    subjects,
    onClearFilters,
    hasActiveFilters,
}) => {
    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <Input
                    type="text"
                    placeholder="Soru ara... (kazanım adı, kategori, konu)"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-12 pr-12 h-12 text-base bg-card dark:bg-card border-2 border-border dark:border-border focus:border-primary dark:focus:border-primary transition-colors shadow-sm"
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted dark:hover:bg-muted"
                        onClick={() => onSearchChange("")}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Filters and View Mode */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-3 flex-1 w-full lg:w-auto">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Filtreler:</span>
                    </div>

                    {/* Category Filter */}
                    <Select value={selectedCategory} onValueChange={onCategoryChange}>
                        <SelectTrigger className="w-[180px] bg-card border-border">
                            <SelectValue placeholder="Tüm Kategoriler" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Kategoriler</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Subject Filter */}
                    <Select
                        value={selectedSubject}
                        onValueChange={onSubjectChange}
                        disabled={!selectedCategory || selectedCategory === "all"}
                    >
                        <SelectTrigger className="w-[180px] bg-card border-border">
                            <SelectValue placeholder="Tüm Konular" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Konular</SelectItem>
                            {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                    {subject}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Difficulty Filter */}
                    <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
                        <SelectTrigger className="w-[160px] bg-card border-border">
                            <SelectValue placeholder="Tüm Zorluklar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Zorluklar</SelectItem>
                            <SelectItem value="easy">Kolay (1-3)</SelectItem>
                            <SelectItem value="medium">Orta (4-6)</SelectItem>
                            <SelectItem value="hard">Zor (7-10)</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClearFilters}
                            className="gap-2 hover:bg-destructive/10 dark:hover:bg-destructive/20 hover:text-destructive hover:border-destructive transition-colors"
                        >
                            <X className="h-4 w-4" />
                            Filtreleri Temizle
                        </Button>
                    )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-muted/50 dark:bg-muted/30 p-1 rounded-lg border border-border dark:border-border">
                    <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewModeChange("grid")}
                        className="gap-2"
                        title="Grid Görünüm"
                    >
                        <Grid3x3 className="h-4 w-4" />
                        <span className="hidden sm:inline">Grid</span>
                    </Button>

                    <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewModeChange("list")}
                        className="gap-2"
                        title="Liste Görünüm"
                    >
                        <List className="h-4 w-4" />
                        <span className="hidden sm:inline">Liste</span>
                    </Button>

                    <Button
                        variant={viewMode === "compact" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onViewModeChange("compact")}
                        className="gap-2"
                        title="Kompakt Görünüm"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline">Kompakt</span>
                    </Button>
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">Aktif filtreler:</span>

                    {selectedCategory !== "all" && (
                        <Badge variant="secondary" className="gap-1">
                            Kategori: {selectedCategory}
                            <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => onCategoryChange("all")}
                            />
                        </Badge>
                    )}

                    {selectedSubject !== "all" && (
                        <Badge variant="secondary" className="gap-1">
                            Konu: {selectedSubject}
                            <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => onSubjectChange("all")}
                            />
                        </Badge>
                    )}

                    {selectedDifficulty !== "all" && (
                        <Badge variant="secondary" className="gap-1">
                            Zorluk: {
                                selectedDifficulty === "easy" ? "Kolay" :
                                    selectedDifficulty === "medium" ? "Orta" : "Zor"
                            }
                            <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => onDifficultyChange("all")}
                            />
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
};
