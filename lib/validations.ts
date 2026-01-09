import { z } from 'zod';

// Authentication validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']).refine(
    (val) => val !== undefined,
    { message: 'Please select a role' }
  ),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const questionFormSchema = z.object({
  imageUrl: z.string().url({ message: "Lütfen geçerli bir URL girin." }),
  learningObjectiveId: z.string().min(1, "Kazanım seçmek zorunludur."),
  difficulty: z
    .number()
    .min(1, "Zorluk 1-10 arası olmalı")
    .max(10, "Zorluk 1-10 arası olmalı"),
  optionA: z.string().min(1, "Seçenek boş olamaz"),
  optionB: z.string().min(1, "Seçenek boş olamaz"),
  optionC: z.string().min(1, "Seçenek boş olamaz"),
  optionD: z.string().min(1, "Seçenek boş olamaz"),
  optionE: z.string().min(1, "Seçenek boş olamaz"),
  correctAnswer: z.enum(["a", "b", "c", "d", "e"]),
});

export const testFormSchema = z.object({
  name: z.string().min(1, "Test adı boş bırakılamaz."),
  description: z.string().optional(),
  questionIds: z
    .array(
      z.object({
        questionId: z.string().min(1, "Soru ID boş bırakılamaz."),
        order: z.number().min(0, "Sıra numarası negatif olamaz."),
      })
    )
    .min(1, "Test en az bir soru içermelidir."),
});

export const learningObjectiveFormSchema = z.object({
  name: z.string().min(3, "Kazanım adı en az 3 karakter olmalı"),
  subjectId: z.string().uuid("Lütfen bir konu seçin"),
  order: z.number().int().min(1, "Sıra 1'den küçük olamaz"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type QuestionFormValues = z.infer<typeof questionFormSchema>;
export type TestFormValues = z.infer<typeof testFormSchema>;
export type LearningObjectiveFormValues = z.infer<typeof learningObjectiveFormSchema>;
