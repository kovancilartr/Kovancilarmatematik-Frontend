"use client";

import React, { useMemo } from "react";
import { useGetAllTests, useDeleteTest } from "@/hooks/api/use-tests";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { UpsertTestModal } from "@/components/modal/UpsertTestModal";
import { TestCard } from "@/components/admin/TestCard";
import { TestStats } from "@/components/admin/TestStats";

const TestsPage = () => {
  const { data: tests, isLoading, isError, error } = useGetAllTests();
  const deleteTestMutation = useDeleteTest();

  const handleDeleteTest = async (testId: string) => {
    toast.promise(deleteTestMutation.mutateAsync(testId), {
      loading: "Test siliniyor...",
      success: "Test başarıyla silindi!",
      error: "Test silinirken bir hata oluştu.",
    });
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!tests) {
      return { totalTests: 0, totalQuestions: 0, averageQuestionsPerTest: 0 };
    }

    const totalTests = tests.length;
    const totalQuestions = tests.reduce(
      (sum, test) => sum + (test.questions?.length || 0),
      0
    );
    const averageQuestionsPerTest =
      totalTests > 0 ? totalQuestions / totalTests : 0;

    return { totalTests, totalQuestions, averageQuestionsPerTest };
  }, [tests]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-muted dark:bg-muted/50 animate-pulse rounded" />
          <div className="h-10 w-40 bg-muted dark:bg-muted/50 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted dark:bg-muted/50 animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted dark:bg-muted/50 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 dark:border-destructive/30 rounded-lg p-6 text-center">
          <p className="text-destructive dark:text-destructive font-semibold">
            Hata: {error.message}
          </p>
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
            Test Yönetimi
          </h1>
          <p className="text-muted-foreground mt-1">
            Testlerinizi oluşturun, düzenleyin ve yönetin
          </p>
        </div>
        <UpsertTestModal>
          <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl dark:shadow-primary/20 transition-shadow">
            <PlusCircle className="h-5 w-5" />
            Yeni Test Oluştur
          </Button>
        </UpsertTestModal>
      </div>

      {/* Statistics */}
      <TestStats
        totalTests={stats.totalTests}
        totalQuestions={stats.totalQuestions}
        averageQuestionsPerTest={stats.averageQuestionsPerTest}
      />

      {/* Tests Grid */}
      {!tests || tests.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-6xl opacity-20 dark:opacity-10">📝</div>
          <h3 className="text-xl font-semibold text-muted-foreground">
            Henüz test oluşturulmamış
          </h3>
          <p className="text-sm text-muted-foreground">
            Yeni bir test oluşturmak için yukarıdaki butona tıklayın
          </p>
          <UpsertTestModal>
            <Button variant="outline" className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              İlk Testi Oluştur
            </Button>
          </UpsertTestModal>
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="flex items-center justify-between border-b border-border dark:border-border/50 pb-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{tests.length}</span> test gösteriliyor
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                onDelete={handleDeleteTest}
                isDeleting={deleteTestMutation.isPending}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TestsPage;
