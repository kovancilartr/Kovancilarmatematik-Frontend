// components/forms/QuestionForm.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllLearningObjectives } from "@/hooks/api/use-learning-objectives";
import { QuestionFormValues, questionFormSchema } from "@/lib/validations";
import { Question } from "@/lib/api";
import { Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface QuestionFormProps {
  initialData?: Question;
  isPending: boolean;
  onSubmit: (values: QuestionFormValues) => void;
  onCancel: () => void;
  isOpen: boolean; // Add isOpen prop
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  initialData,
  isPending,
  onSubmit,
  onCancel,
  isOpen, // Add isOpen prop
}) => {
  const { data: learningObjectives, isLoading: isLoadingLearningObjectives } =
    useGetAllLearningObjectives();

  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: initialData
      ? {
        imageUrl: initialData.imageUrl,
        learningObjectiveId: initialData.learningObjectiveId,
        difficulty: initialData.difficulty,
        optionA: initialData.options?.a || "",
        optionB: initialData.options?.b || "",
        optionC: initialData.options?.c || "",
        optionD: initialData.options?.d || "",
        optionE: initialData.options?.e || "",
        correctAnswer: initialData.correctAnswer as "a" | "b" | "c" | "d" | "e",
      }
      : {
        imageUrl: "",
        learningObjectiveId: "",
        difficulty: 1,
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        optionE: "",
        correctAnswer: "a",
      },
  });

  // Preview image update only
  const imageUrl = form.watch("imageUrl");
  useEffect(() => {
    if (initialData?.imageUrl) {
      setImagePreview(initialData.imageUrl);
    }
  }, [initialData]);
  const correctAnswer = form.watch("correctAnswer");

  useEffect(() => {
    if (imageUrl && imageUrl.startsWith("http")) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  const getOptionBadgeStyle = (option: string) => {
    if (correctAnswer === option) {
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 ring-2 ring-green-500/50";
    }
    return "bg-muted dark:bg-muted/50 text-foreground border-border";
  };

  // Group learning objectives by subject
  const groupedObjectives = useMemo(() => {
    if (!learningObjectives) return {};

    const groups: Record<string, typeof learningObjectives> = {};

    learningObjectives.forEach((objective) => {
      const subjectName = objective.subject?.name || "Diğer";
      if (!groups[subjectName]) {
        groups[subjectName] = [];
      }
      groups[subjectName].push(objective);
    });

    // Sort objectives within each group by order
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.order - b.order);
    });

    return groups;
  }, [learningObjectives]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Kazanım Seçimi */}
        <FormField
          control={form.control}
          name="learningObjectiveId"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-base font-semibold">Kazanım *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoadingLearningObjectives || isPending}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Bir kazanım seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(groupedObjectives)
                      .sort()
                      .map((subjectName) => (
                        <React.Fragment key={subjectName}>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                            {subjectName}
                          </div>
                          {groupedObjectives[subjectName].map((objective) => (
                            <SelectItem
                              key={objective.id}
                              value={objective.id}
                              className="pl-6"
                            >
                              {objective.name}
                            </SelectItem>
                          ))}
                        </React.Fragment>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Separator />

        {/* Soru Görseli */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Soru Görsel URL *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="https://example.com/image.png"
                      className="pl-10 h-11"
                      {...field}
                      disabled={isPending}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Soru görselinin URL adresini girin
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="border-2 border-dashed border-border dark:border-border/50 rounded-lg p-4 bg-muted/20 dark:bg-muted/10">
              <p className="text-sm font-medium mb-2 text-muted-foreground">Önizleme:</p>
              <div className="relative w-full aspect-[4/3] bg-background rounded-md overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Soru önizleme"
                  fill
                  className="object-contain"
                  onError={() => setImagePreview("")}
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Seçenekler */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Seçenekler</h3>
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Doğru: {correctAnswer.toUpperCase()}
            </Badge>
          </div>

          {/* First row: A, B, C */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["A", "B", "C"].map((option) => (
              <FormField
                key={option}
                control={form.control}
                name={`option${option}` as keyof QuestionFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${getOptionBadgeStyle(option.toLowerCase())} transition-all duration-200`}
                      >
                        {option}
                      </Badge>
                      <span>Seçenek {option}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${option} şıkkı`}
                        className="h-11"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* Second row: D, E */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["D", "E"].map((option) => (
              <FormField
                key={option}
                control={form.control}
                name={`option${option}` as keyof QuestionFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`${getOptionBadgeStyle(option.toLowerCase())} transition-all duration-200`}
                      >
                        {option}
                      </Badge>
                      <span>Seçenek {option}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${option} şıkkı`}
                        className="h-11"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Doğru Cevap ve Zorluk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="correctAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Doğru Cevap *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Doğru seçeneği belirleyin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["a", "b", "c", "d", "e"].map((option) => (
                      <SelectItem key={option} value={option}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="w-8 justify-center">
                            {option.toUpperCase()}
                          </Badge>
                          <span>Seçenek {option.toUpperCase()}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Zorluk Derecesi *
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    className="h-11"
                    {...field}
                    disabled={isPending}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>1 (Kolay) - 10 (Zor)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button
            type="submit"
            disabled={isPending}
            className="min-w-24 gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
