"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { UserData } from "@/hooks/api/use-users";

// Schema Validation
const userFormSchema = z.object({
    name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir email adresi giriniz"),
    role: z.enum(["ADMIN", "TEACHER", "STUDENT"], {
        message: "Lütfen bir rol seçiniz",
    }),
    password: z.string().optional(),
}).refine((data) => {
    // If creating new user (no logic inside schema to know context, handled by props/logic outside mostly, 
    // but here we can make password required if it's strictly a create schema, reusing for edit makes it optional)
    // We'll handle "Password required on create" via a separate refine or conditional validation if needed, 
    // or just check in submit handler / form props.
    // For simplicity: Password is min 6 if provided.
    if (data.password && data.password.length > 0 && data.password.length < 6) {
        return false;
    }
    return true;
}, {
    message: "Şifre en az 6 karakter olmalıdır",
    path: ["password"],
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
    initialData?: UserData | null;
    onSubmit: (values: UserFormValues) => void;
    isPending: boolean;
    mode: "create" | "edit";
    onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
    initialData,
    onSubmit,
    isPending,
    mode,
    onCancel,
}) => {
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: initialData?.name || "",
            email: initialData?.email || "",
            role: initialData?.role || "STUDENT",
            password: "",
        },
    });

    const handleSubmit = (values: UserFormValues) => {
        // If edit mode and password empty, remove it (undefined)
        if (mode === 'edit' && !values.password) {
            delete (values as any).password;
        }
        onSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ad Soyad</FormLabel>
                            <FormControl>
                                <Input placeholder="Ad Soyad" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="ornek@email.com" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {mode === "create" ? "Şifre *" : "Yeni Şifre (Opsiyonel)"}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder={mode === "create" ? "******" : "Değiştirmek için giriniz"}
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value)} // ensure empty string is passed
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormDescription>
                                {mode === "create" && "En az 6 karakter uzunluğunda olmalıdır"}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rol</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Rol seçiniz" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="STUDENT">Öğrenci</SelectItem>
                                    <SelectItem value="TEACHER">Öğretmen</SelectItem>
                                    <SelectItem value="ADMIN">Yönetici</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                        İptal
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {mode === "create" ? "Oluştur" : "Güncelle"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
