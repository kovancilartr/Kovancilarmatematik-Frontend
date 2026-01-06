// components/layout/modal/UpsertMaterialModal.tsx
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
import { useCreateMaterial, useUpdateMaterial } from '@/hooks/api/use-materials';
import { MaterialForm, MaterialFormValues } from '@/components/forms/MaterialForm';
import { Material } from '@/lib/api';

interface UpsertMaterialModalProps {
  children: React.ReactNode; 
  material?: Material; 
}

export function UpsertMaterialModal({ children, material }: UpsertMaterialModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!material;

  const { mutate: createMaterial, isPending: isCreating } = useCreateMaterial();
  const { mutate: updateMaterial, isPending: isUpdating } = useUpdateMaterial();

  const isPending = isCreating || isUpdating;

  const handleSubmit = (values: MaterialFormValues) => {
    if (isEditMode) {
      updateMaterial(
        { id: material.id, data: values },
        {
          onSuccess: () => {
            toast.success('Materyal başarıyla güncellendi!');
            setIsOpen(false);
          },
          onError: (error) => {
            toast.error(`Güncelleme başarısız: ${error.message}`);
          },
        }
      );
    } else {
      createMaterial(values, {
        onSuccess: () => {
          toast.success('Materyal başarıyla oluşturuldu!');
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
          <DialogTitle>{isEditMode ? 'Materyali Düzenle' : 'Yeni Materyal Ekle'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Mevcut materyalin bilgilerini güncelleyin.'
              : 'Yeni bir ders materyali oluşturun.'}
          </DialogDescription>
        </DialogHeader>
        <MaterialForm
          onSubmit={handleSubmit}
          isPending={isPending}
          initialData={material}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
