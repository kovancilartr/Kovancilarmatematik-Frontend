// components/forms/LessonForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useGetAllSubjects } from '@/hooks/api/use-subjects';
import { Subject } from '@/lib/api';

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(3, 'Ders adı en az 3 karakter olmalıdır.'),
  videoUrl: z.string().url('Geçerli bir video URL giriniz.'),
  subjectId: z.string().uuid('Kazanım seçimi gereklidir.'),
});

// Type for form values
export type LessonFormValues = z.infer<typeof formSchema>;

interface LessonFormProps {
  onSubmit: (values: LessonFormValues) => void;
  initialData?: Partial<LessonFormValues>;
  isPending: boolean;
  onCancel: () => void;
}

export function LessonForm({ onSubmit, initialData, isPending, onCancel }: LessonFormProps) {
  // Fetch subjects for the select dropdown
  const { data: subjects, isLoading: isSubjectsLoading } = useGetAllSubjects();

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: '', videoUrl: '', subjectId: '' },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ders Adı</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} placeholder="Örn: Ders 1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" disabled={isPending} placeholder="https://youtube.com/watch?v=..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kazanım</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isPending || isSubjectsLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isSubjectsLoading ? "Kazanımlar yükleniyor..." : "Bir kazanım seçin"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects?.map((subject: Subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            İptal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Kaydet
          </Button>
        </div>
      </form>
    </Form>
  );
}
