// components/forms/SubjectForm.tsx
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
import { useGetAllCategories } from '@/hooks/api/use-categories';
import { Category } from '@/lib/api';

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(3, 'Kazanım adı en az 3 karakter olmalıdır.'),
  order: z.number().int().positive('Sıra pozitif bir tam sayı olmalıdır.'),
  categoryId: z.string().min(1, 'Kategori seçimi gereklidir.'),
});

// Type for form values
export type SubjectFormValues = z.infer<typeof formSchema>;

interface SubjectFormProps {
  onSubmit: (values: SubjectFormValues) => void;
  initialData?: Partial<SubjectFormValues>;
  isPending: boolean;
  onCancel: () => void;
}

export function SubjectForm({ onSubmit, initialData, isPending, onCancel }: SubjectFormProps) {
  // Fetch categories for the select dropdown
  const { data: categories, isLoading: isCategoriesLoading } = useGetAllCategories();

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: '', order: 1, categoryId: '' },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (values: SubjectFormValues) => {
    // Convert order to number to ensure type safety
    const processedValues = {
      ...values,
      order: Number(values.order),
    };
    onSubmit(processedValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kazanım Adı</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} placeholder="Örn: Üslü Sayılar" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sıra</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  disabled={isPending}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isPending || isCategoriesLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isCategoriesLoading ? "Kategoriler yükleniyor..." : "Bir kategori seçin"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
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
