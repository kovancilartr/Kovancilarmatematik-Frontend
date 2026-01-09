"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useGetAllQuestions, useDeleteQuestion } from "@/hooks/api/use-questions";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles } from "lucide-react";
import { UpsertQuestionModal } from "@/components/modal/UpsertQuestionModal";
import toast from "react-hot-toast";
import { QuestionCard } from "@/components/admin/QuestionCard";
import { QuestionFilters, ViewMode } from "@/components/admin/QuestionFilters";
import { QuestionStats } from "@/components/admin/QuestionStats";
import { Question } from "@/lib/api";

const QuestionsPage = () => {
  const {
    data: questions = [],
    isLoading,
    isError,
    error,
  } = useGetAllQuestions();

  const deleteQuestionMutation = useDeleteQuestion();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Load view mode from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem("questionsViewMode") as ViewMode;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode to localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("questionsViewMode", mode);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    toast.promise(deleteQuestionMutation.mutateAsync(questionId), {
      loading: "Soru siliniyor...",
      success: "Soru başarıyla silindi!",
      error: "Soru silinirken bir hata oluştu.",
    });
  };

  // Get all categories from questions
  const categories = useMemo(() => {
    if (!questions) return [];
    const categoryNames = questions
      .map((q) => q.learningObjective?.subject?.category?.name)
      .filter((name): name is string => !!name);
    return Array.from(new Set(categoryNames)).sort();
  }, [questions]);

  // Get subjects based on selected category
  const availableSubjects = useMemo(() => {
    if (!questions || selectedCategory === "all") return [];
    return Array.from(
      new Set(
        questions
          .filter((q) => q.learningObjective?.subject?.category?.name === selectedCategory)
          .map((q) => q.learningObjective?.subject?.name)
          .filter((name): name is string => !!name)
      )
    ).sort();
  }, [questions, selectedCategory]);

  // Reset subject when category changes
  useEffect(() => {
    setSelectedSubject("all");
  }, [selectedCategory]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.learningObjective?.name?.toLowerCase().includes(query) ||
          q.learningObjective?.subject?.category?.name?.toLowerCase().includes(query) ||
          q.learningObjective?.subject?.name?.toLowerCase().includes(query) ||
          q.id.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((q) => q.learningObjective?.subject?.category?.name === selectedCategory);
    }

    // Subject filter
    if (selectedSubject !== "all") {
      filtered = filtered.filter((q) => q.learningObjective?.subject?.name === selectedSubject);
    }

    // Difficulty filter
    if (selectedDifficulty !== "all") {
      if (selectedDifficulty === "easy") {
        filtered = filtered.filter((q) => q.difficulty <= 3);
      } else if (selectedDifficulty === "medium") {
        filtered = filtered.filter((q) => q.difficulty >= 4 && q.difficulty <= 6);
      } else if (selectedDifficulty === "hard") {
        filtered = filtered.filter((q) => q.difficulty >= 7);
      }
    }

    return filtered;
  }, [questions, searchQuery, selectedCategory, selectedSubject, selectedDifficulty]);

  // Calculate statistics
  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    const byDifficulty = { easy: 0, medium: 0, hard: 0 };

    questions.forEach((q) => {
      const categoryName = q.learningObjective?.subject?.category?.name || "Diğer";
      byCategory[categoryName] = (byCategory[categoryName] || 0) + 1;

      if (q.difficulty <= 3) byDifficulty.easy++;
      else if (q.difficulty <= 6) byDifficulty.medium++;
      else byDifficulty.hard++;
    });

    return { byCategory, byDifficulty };
  }, [questions]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedSubject !== "all" ||
    selectedDifficulty !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSubject("all");
    setSelectedDifficulty("all");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-muted dark:bg-muted/50 animate-pulse rounded" />
          <div className="h-10 w-40 bg-muted dark:bg-muted/50 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted dark:bg-muted/50 animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-12 bg-muted dark:bg-muted/50 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-muted dark:bg-muted/50 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 dark:border-destructive/30 rounded-lg p-6 text-center">
          <p className="text-destructive dark:text-destructive font-semibold">Hata: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Soru Bankası
          </h1>
          <p className="text-muted-foreground mt-1">
            Tüm sorularınızı yönetin ve düzenleyin
          </p>
        </div>
        <UpsertQuestionModal>
          <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl dark:shadow-primary/20 transition-shadow">
            <PlusCircle className="h-5 w-5" />
            Yeni Soru Ekle
          </Button>
        </UpsertQuestionModal>
      </div>

      {/* Statistics */}
      <QuestionStats
        totalQuestions={questions.length}
        byCategory={stats.byCategory}
        byDifficulty={stats.byDifficulty}
        filteredCount={filteredQuestions.length}
      />

      {/* Filters */}
      <QuestionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        categories={categories}
        subjects={availableSubjects}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Questions Grid/List */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-6xl opacity-20 dark:opacity-10">📚</div>
          <h3 className="text-xl font-semibold text-muted-foreground">
            {hasActiveFilters ? "Filtreye uygun soru bulunamadı" : "Henüz soru eklenmemiş"}
          </h3>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Filtreleri Temizle
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="flex items-center justify-between border-b border-border dark:border-border/50 pb-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredQuestions.length}</span> soru gösteriliyor
            </p>
          </div>

          {/* Grid Layout */}
          <div
            className={`grid gap-6 ${viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : viewMode === "list"
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              }`}
          >
            {filteredQuestions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index + 1}
                onDelete={handleDeleteQuestion}
                isDeleting={deleteQuestionMutation.isPending}
                viewMode={viewMode}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionsPage;
