// components/forms/MaterialForm.tsx
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
import { useGetAllLessons } from '@/hooks/api/use-lessons';
import { Lesson } from '@/lib/api';

const formSchema = z.object({
  name: z.string().min(3, 'Materyal adı en az 3 karakter olmalıdır.'),
  url: z.string().url('Geçerli bir URL giriniz.'),
  lessonId: z.string().uuid('Ders seçimi gereklidir.'),
});

export type MaterialFormValues = z.infer<typeof formSchema>;

interface MaterialFormProps {
  onSubmit: (values: MaterialFormValues) => void;
  initialData?: Partial<MaterialFormValues>;
  isPending: boolean;
  onCancel: () => void;
}

export function MaterialForm({ onSubmit, initialData, isPending, onCancel }: MaterialFormProps) {
  const { data: lessons, isLoading: isLessonsLoading } = useGetAllLessons();

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: '', url: '', lessonId: '' },
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
              <FormLabel>Materyal Adı</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} placeholder="Örn: Ders Notları" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Materyal URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" disabled={isPending} placeholder="https://example.com/dosya.pdf" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lessonId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ders</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isPending || isLessonsLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLessonsLoading ? "Dersler yükleniyor..." : "Bir ders seçin"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lessons?.map((lesson: Lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.name}
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
