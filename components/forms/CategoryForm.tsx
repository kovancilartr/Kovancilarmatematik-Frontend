// components/forms/CategoryForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(3, 'Kategori adı en az 3 karakter olmalıdır.'),
  order: z.number().int().positive('Sıra pozitif bir tam sayı olmalıdır.'),
});

// Type for form values
export type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  // The function to call when the form is submitted and valid
  onSubmit: (values: CategoryFormValues) => void;
  // The initial data for the form, used for editing
  initialData?: Partial<CategoryFormValues>;
  // The loading state for the submit button
  isPending: boolean;
  // A function to call when the cancel button is clicked
  onCancel: () => void;
}

export function CategoryForm({ onSubmit, initialData, isPending, onCancel }: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: '', order: 1 },
  });

  // If initialData changes, reset the form
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (values: CategoryFormValues) => {
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
              <FormLabel>Kategori Adı</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} placeholder="Örn: TYT Matematik" />
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
