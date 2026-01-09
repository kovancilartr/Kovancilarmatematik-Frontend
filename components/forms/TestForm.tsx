// components/forms/TestForm.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TestFormValues, testFormSchema } from "@/lib/validations";
import { Question, Test } from "@/lib/api";
import { useGetAllLearningObjectives } from "@/hooks/api/use-learning-objectives";
import { useGetAllQuestions } from "@/hooks/api/use-questions";
import {
  PlusCircle,
  XCircle,
  Loader2,
  FileText,
  Search,
  GripVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestFormProps {
  initialData?: Test;
  isPending: boolean;
  onSubmit: (values: TestFormValues) => void;
  onCancel: () => void;
}

const TestForm: React.FC<TestFormProps> = ({
  initialData,
  isPending,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<TestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      name: "",
      description: "",
      questionIds: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "questionIds",
  });

  const { data: allLearningObjectives, isLoading: isLoadingLO } =
    useGetAllLearningObjectives();

  const { data: fetchedAllQuestions, isLoading: isLoadingQuestions } =
    useGetAllQuestions();

  const [questionSelectionOpen, setQuestionSelectionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Combine fetched questions with questions from initialData
  const allAvailableQuestions = useMemo(() => {
    const combined = new Map<string, Question>();

    if (fetchedAllQuestions) {
      fetchedAllQuestions.forEach((q) => combined.set(q.id, q));
    }

    if (initialData?.questions) {
      initialData.questions.forEach((tq) => {
        if (tq.question) {
          combined.set(tq.question.id, tq.question);
        }
      });
    }

    return Array.from(combined.values());
  }, [fetchedAllQuestions, initialData?.questions]);

  useEffect(() => {
    if (initialData && allAvailableQuestions.length > 0 && allLearningObjectives) {
      // Set form values
      form.setValue("name", initialData.name);
      form.setValue("description", initialData.description || "");

      // Replace fields array directly to sync with useFieldArray
      const questionIdsData = initialData.questions?.map((tq) => ({
        questionId: tq.questionId,
        order: tq.order,
      })) || [];

      replace(questionIdsData);
    }
  }, [initialData, allAvailableQuestions.length, allLearningObjectives, form, replace]);

  const addQuestionToTest = (question: Question) => {
    if (!fields.some((item) => item.questionId === question.id)) {
      append({ questionId: question.id, order: fields.length + 1 });
    }
  };

  const removeQuestionFromTest = (index: number) => {
    remove(index);
    // useFieldArray's remove() automatically updates the order
  };

  const toggleQuestionSelection = (question: Question) => {
    const index = fields.findIndex((f) => f.questionId === question.id);
    if (index > -1) {
      remove(index);
    } else {
      append({ questionId: question.id, order: fields.length + 1 });
    }
  };

  const getQuestionDetails = (questionId: string) => {
    return allAvailableQuestions.find((q) => q.id === questionId);
  };

  const groupedQuestionsByLO = allLearningObjectives?.reduce((acc, lo) => {
    const questionsForThisLO = allAvailableQuestions.filter(
      (q) => q.learningObjectiveId === lo.id
    );

    if (questionsForThisLO && questionsForThisLO.length > 0) {
      acc[lo.id] = questionsForThisLO;
    }

    return acc;
  }, {} as Record<string, Question[]>);

  // Filter questions based on search
  const filteredGroupedQuestions = useMemo(() => {
    if (!searchQuery || !groupedQuestionsByLO) return groupedQuestionsByLO;

    const filtered: Record<string, Question[]> = {};
    Object.entries(groupedQuestionsByLO).forEach(([loId, questions]) => {
      const matchedQuestions = questions.filter((q) =>
        q.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchedQuestions.length > 0) {
        filtered[loId] = matchedQuestions;
      }
    });
    return filtered;
  }, [groupedQuestionsByLO, searchQuery]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Test Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Test Adı *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Örn: 5. Sınıf Matematik 1. Dönem Testi"
                  className="h-11"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>Test için açıklayıcı bir isim girin</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Test Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Açıklama</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Test hakkında kısa bir açıklama (Opsiyonel)"
                  className="min-h-[80px] resize-none"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>Test içeriği hakkında ek bilgi</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Test Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Test Soruları</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Teste eklenecek soruları seçin ve sıralayın
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <FileText className="h-3 w-3" />
              {fields.length} Soru
            </Badge>
          </div>

          {/* Selected Questions List */}
          <div className="border-2 border-dashed border-border dark:border-border/50 rounded-lg p-4 bg-muted/20 dark:bg-muted/10 min-h-[200px]">
            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-4xl mb-3 opacity-20 dark:opacity-10">📝</div>
                <p className="text-sm text-muted-foreground mb-4">
                  Henüz soru eklenmedi
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuestionSelectionOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  İlk Soruyu Ekle
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => {
                  const question = getQuestionDetails(field.questionId);
                  return (
                    <div
                      key={field.id}
                      className="group flex items-center gap-3 p-3 bg-background dark:bg-background/50 border border-border dark:border-border/50 rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                        <GripVertical className="h-4 w-4 cursor-move opacity-50 group-hover:opacity-100 transition-opacity" />
                        <Badge variant="outline" className="w-10 justify-center">
                          {index + 1}
                        </Badge>
                      </div>

                      {question ? (
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="relative w-20 h-14 shrink-0 bg-muted rounded overflow-hidden">
                            <Image
                              src={question.imageUrl}
                              alt={`Soru ${index + 1}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              Soru #{index + 1}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              ID: {question.id.slice(0, 12)}...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground flex-1">
                          Soru bulunamadı
                        </p>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestionFromTest(index)}
                        disabled={isPending}
                        className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 border-dashed"
                  disabled={isPending}
                  onClick={() => setQuestionSelectionOpen(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                  Soru Ekle
                </Button>
              </div>
            )}
          </div>

          <Dialog open={questionSelectionOpen} onOpenChange={setQuestionSelectionOpen}>
            <QuestionSelectionDialog
              isLoading={isLoadingLO || isLoadingQuestions}
              learningObjectives={allLearningObjectives}
              groupedQuestions={filteredGroupedQuestions}
              selectedQuestionIds={fields.map((f) => f.questionId)}
              onToggleQuestion={toggleQuestionSelection}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </Dialog>

          <FormMessage>{form.formState.errors.questionIds?.message}</FormMessage>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="min-w-24"
          >
            İptal
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-24 gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Question Selection Dialog Component
interface QuestionSelectionDialogProps {
  isLoading: boolean;
  learningObjectives: any[] | undefined;
  groupedQuestions: Record<string, Question[]> | undefined;
  selectedQuestionIds: string[];
  onToggleQuestion: (question: Question) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const QuestionSelectionDialog: React.FC<QuestionSelectionDialogProps> = ({
  isLoading,
  learningObjectives,
  groupedQuestions,
  selectedQuestionIds,
  onToggleQuestion,
  searchQuery,
  onSearchChange,
}) => {
  const totalSelected = selectedQuestionIds.length;

  // Varsayılan olarak tüm accordion'ları açık tutmak için ID listesi
  const allItemIds = useMemo(() => {
    return learningObjectives?.map(lo => lo.id) || [];
  }, [learningObjectives]);

  return (
    <DialogContent className="sm:max-w-[1000px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
      <DialogHeader className="p-6 pb-2 shrink-0 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl">Soru Havuzu</DialogTitle>
            <DialogDescription className="mt-1">
              Testinize eklemek için listeden soru seçin
            </DialogDescription>
          </div>
          <Badge variant={totalSelected > 0 ? "default" : "secondary"} className="text-sm px-3 py-1 h-8">
            {totalSelected} Soru Seçildi
          </Badge>
        </div>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Soru arayın..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto bg-muted/10 p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Sorular yükleniyor...</p>
          </div>
        ) : (
          <Accordion type="multiple" className="w-full space-y-4" defaultValue={allItemIds} key={allItemIds.join(',')}>
            {learningObjectives?.map((lo) => {
              const questionsForThisLO = groupedQuestions?.[lo.id];
              if (!questionsForThisLO || questionsForThisLO.length === 0) {
                return null;
              }

              return (
                <AccordionItem value={lo.id} key={lo.id} className="border rounded-lg bg-background px-4">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-2 w-full">
                      <div className="h-6 w-1 bg-primary rounded-full"></div>
                      <h4 className="font-semibold text-sm text-foreground text-left flex-1">{lo.name}</h4>
                      <Badge variant="secondary" className="text-xs mr-2">
                        {questionsForThisLO.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pt-2 pb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {questionsForThisLO.map((question) => {
                        const isSelected = selectedQuestionIds.includes(question.id);
                        return (
                          <div
                            key={question.id}
                            onClick={() => onToggleQuestion(question)}
                            className={`
                              group relative cursor-pointer border rounded-lg p-3 transition-all duration-200
                              hover:shadow-md hover:border-primary/50 flex flex-col items-center text-center gap-2
                              ${isSelected
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-border bg-card"}
                            `}
                          >
                            {/* Selection Check */}
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 z-10 text-primary">
                                <div className="bg-primary text-primary-foreground rounded-full p-0.5">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                              </div>
                            )}

                            {/* Icon Container with Hover Preview Trigger */}
                            <div className="relative group/preview w-12 h-12 flex items-center justify-center bg-muted rounded-lg text-muted-foreground">
                              <FileText className="h-6 w-6" />

                              {/* Hover Preview Tooltip */}
                              <div className="hidden group-hover/preview:block fixed z-50 bottom-16 left-1/2 -translate-x-1/2 p-2 bg-popover text-popover-foreground rounded-xl border shadow-2xl animate-in fade-in zoom-in-95 duration-200 pointer-events-none w-[320px]">
                                <div className="relative aspect-video bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center">
                                  <Image
                                    src={question.imageUrl}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                  />
                                  <div className="absolute bottom-2 left-2 flex gap-1">
                                    <Badge variant="secondary" className="h-5 text-[10px] backdrop-blur-md bg-background/50">
                                      {question.difficulty}/10 Seviye
                                    </Badge>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs font-medium text-center">
                                  ID: {question.id}
                                </div>
                              </div>
                            </div>

                            {/* Minimal Info */}
                            <div className="w-full">
                              <div className="text-xs font-medium truncate w-full" title={question.id}>
                                Soru #{question.id.slice(0, 5)}
                              </div>
                              <div className="text-[12px] text-muted-foreground text-red-500">
                                {question.difficulty} <span className="text-primary text-[10px]">Seviye</span>
                              </div>
                            </div>

                            {/* Hover Overlay Text */}
                            <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg font-medium text-xs text-primary pointer-events-none">
                              {isSelected ? "Çıkar" : "Görüntüle"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>

      <div className="p-4 border-t bg-background shrink-0 flex justify-end">
        <DialogTrigger asChild>
          <Button>Seçimi Tamamla ({totalSelected})</Button>
        </DialogTrigger>
      </div>
    </DialogContent>
  );
};

export default TestForm;
