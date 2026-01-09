// components/forms/CategoryForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetAllUsers } from '@/hooks/api/use-users';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Category } from '@/lib/api';

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(3, 'Kategori adı en az 3 karakter olmalıdır.'),
  order: z.number().int().positive('Sıra pozitif bir tam sayı olmalıdır.'),
  isPublished: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  allowedUserIds: z.array(z.string()).optional(),
});

// Type for form values
export type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  // The function to call when the form is submitted and valid
  onSubmit: (values: CategoryFormValues) => void;
  // The initial data for the form, used for editing
  initialData?: Category; // Use Category type to get allowedUsers
  // The loading state for the submit button
  isPending: boolean;
  // A function to call when the cancel button is clicked
  onCancel: () => void;
}

export function CategoryForm({ onSubmit, initialData, isPending, onCancel }: CategoryFormProps) {
  // Try to reconstruct initial form values from Category object
  const defaultValues: Partial<CategoryFormValues> = {
    name: initialData?.name || '',
    order: initialData?.order || 1,
    isPublished: initialData?.isPublished ?? false, // Default to draft if undefined
    isPublic: initialData?.isPublic ?? false, // Default to private if undefined
    allowedUserIds: initialData?.allowedUsers?.map(u => u.id) || [],
  };

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // If initialData changes, reset the form
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        order: initialData.order,
        isPublished: initialData.isPublished,
        isPublic: initialData.isPublic,
        allowedUserIds: initialData.allowedUsers?.map(u => u.id) || [],
      });
    }
  }, [initialData, form]);

  // Fetch students for assignment
  const { data: students, isLoading: isLoadingStudents } = useGetAllUsers("STUDENT");

  const isPublic = form.watch("isPublic");

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

        <div className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/20">
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                <div className="space-y-0.5">
                  <FormLabel>Yayında</FormLabel>
                  <FormDescription>
                    Aktif edilirse öğrenciler bu kursu görebilir. Taslak için kapatın.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                <div className="space-y-0.5">
                  <FormLabel>Herkese Açık</FormLabel>
                  <FormDescription>
                    {field.value
                      ? "Tüm öğrenciler bu kursa erişebilir."
                      : "Sadece aşağıda seçilen öğrenciler erişebilir (Özel)."}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {!isPublic && (
            <FormField
              control={form.control}
              name="allowedUserIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Erişim İzni Olan Öğrenciler</FormLabel>
                    <FormDescription>
                      Listeden erişim izni vermek istediğiniz öğrencileri seçin.
                    </FormDescription>
                  </div>
                  {isLoadingStudents ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-background">
                      {students?.map((student) => (
                        <FormField
                          key={student.id}
                          control={form.control}
                          name="allowedUserIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={student.id}
                                className="flex flex-row items-start space-x-3 space-y-0 py-2 border-b last:border-0"
                              >
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={field.value?.includes(student.id)}
                                    onChange={(checked) => {
                                      return checked.target.checked
                                        ? field.onChange([...(field.value || []), student.id])
                                        : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== student.id
                                          )
                                        )
                                    }}
                                    disabled={isPending}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex-1">
                                  {student.name} <span className="text-xs text-muted-foreground">({student.email})</span>
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      {students?.length === 0 && (
                        <div className="text-sm text-muted-foreground text-center py-4">
                          Kayıtlı öğrenci bulunamadı.
                        </div>
                      )}
                    </ScrollArea>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

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
