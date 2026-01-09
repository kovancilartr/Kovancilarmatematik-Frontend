// components/forms/LearningObjectiveForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetAllSubjects } from "@/hooks/api/use-subjects";
import {
    learningObjectiveFormSchema,
    type LearningObjectiveFormValues,
} from "@/lib/validations";
import { LearningObjective } from "@/lib/api";
import { useEffect } from "react";

interface LearningObjectiveFormProps {
    initialData?: LearningObjective;
    isPending?: boolean;
    onSubmit: (values: LearningObjectiveFormValues) => void;
    onCancel?: () => void;
}

export default function LearningObjectiveForm({
    initialData,
    isPending,
    onSubmit,
    onCancel,
}: LearningObjectiveFormProps) {
    const { data: subjects = [], isLoading: isLoadingSubjects } = useGetAllSubjects();

    const form = useForm<LearningObjectiveFormValues>({
        resolver: zodResolver(learningObjectiveFormSchema),
        defaultValues: {
            name: "",
            subjectId: "",
            order: 1,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                subjectId: initialData.subjectId,
                order: initialData.order,
            });
        }
    }, [initialData, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Kazanım Adı */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">
                                Kazanım Adı *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Örn: Üslü denklemler ve çözümleri"
                                    className="h-11"
                                    {...field}
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Konu Seçimi */}
                <FormField
                    control={form.control}
                    name="subjectId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">Konu *</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={isLoadingSubjects || isPending}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Bir konu seçin" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {subjects?.map((subject) => (
                                        <SelectItem key={subject.id} value={subject.id}>
                                            {subject.name}
                                            {subject.category && (
                                                <span className="text-muted-foreground text-xs ml-2">
                                                    ({subject.category.name})
                                                </span>
                                            )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Sıra */}
                <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">
                                Sıra Numarası *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="1"
                                    className="h-11"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isPending}
                            className="flex-1 h-12 rounded-xl font-bold"
                        >
                            İptal
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 h-12 rounded-xl font-bold"
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Güncelle" : "Oluştur"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
