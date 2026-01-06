// components/layout/modal/UpsertCategoryModal.tsx
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateCategory, useUpdateCategory } from '@/hooks/api/use-categories';
import { CategoryForm, CategoryFormValues } from '@/components/forms/CategoryForm';
import { Category } from '@/lib/api';

interface UpsertCategoryModalProps {
  children: React.ReactNode; // The trigger element, e.g., a button
  category?: Category; // Pass the category object for editing
}

export function UpsertCategoryModal({ children, category }: UpsertCategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!category;

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const isPending = isCreating || isUpdating;

  const handleSubmit = (values: CategoryFormValues) => {
    if (isEditMode) {
      // Update existing category
      updateCategory(
        { id: category.id, data: values },
        {
          onSuccess: () => {
            toast.success('Kategori başarıyla güncellendi!');
            setIsOpen(false);
          },
          onError: (error) => {
            toast.error(`Güncelleme başarısız: ${error.message}`);
          },
        }
      );
    } else {
      // Create new category
      createCategory(values, {
        onSuccess: () => {
          toast.success('Kategori başarıyla oluşturuldu!');
          setIsOpen(false);
        },
        onError: (error) => {
          toast.error(`Oluşturma başarısız: ${error.message}`);
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Mevcut kategorinin bilgilerini güncelleyin.'
              : 'Yeni bir ders kategorisi oluşturun.'}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          onSubmit={handleSubmit}
          isPending={isPending}
          initialData={category}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
