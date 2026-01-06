// app/[locale]/(admin)/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { apiClient, SiteSettings } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-context-provider";
import {
  Loader2,
  Globe,
  Palette,
  Mail,
  Search,
  ShieldAlert,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import GlobalLoading from "@/components/layout/GlobalLoading";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const formSchema = z.object({
  siteName: z.string().min(1, "Site adı gereklidir").max(100).optional(),
  siteDescription: z.string().max(1000).optional(),
  logoUrl: z.string().optional().or(z.literal("")),
  faviconUrl: z.string().optional().or(z.literal("")),
  primaryColor: z
    .string()
    .regex(hexColorRegex, "Geçerli bir hex kodu giriniz")
    .optional(),
  secondaryColor: z
    .string()
    .regex(hexColorRegex, "Geçerli bir hex kodu giriniz")
    .optional(),
  contactEmail: z
    .string()
    .email("Geçerli bir e-posta giriniz")
    .optional()
    .or(z.literal("")),
  contactPhone: z.string().max(20).optional().or(z.literal("")),
  seoTitle: z.string().max(255).optional().or(z.literal("")),
  seoDescription: z.string().max(500).optional().or(z.literal("")),
  maintenanceMode: z.boolean().optional(),
  allowRegistration: z.boolean().optional(),
  maxFileSize: z.number().int().positive().optional(),
  allowedFileTypes: z.array(z.string()).optional(),
});

type SiteSettingsFormValues = z.infer<typeof formSchema>;

export default function AdminSettingsPage() {
  const { accessToken } = useAuth();
  const [initialSettings, setInitialSettings] = useState<SiteSettings | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: "",
      siteDescription: "",
      logoUrl: "",
      faviconUrl: "",
      primaryColor: "#000000",
      secondaryColor: "#000000",
      contactEmail: "",
      contactPhone: "",
      seoTitle: "",
      seoDescription: "",
      maintenanceMode: false,
      allowRegistration: true,
    },
  });

  useEffect(() => {
    async function fetchSettings() {
      if (!accessToken) return;
      setIsLoading(true);
      try {
        const response = await apiClient.getSiteSettings();
        if (response.success && response.data) {
          setInitialSettings(response.data);
          form.reset(response.data as any);
        }
      } catch (error) {
        toast.error("Ayarlar yüklenirken hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, [accessToken, form]);

  async function onSubmit(values: SiteSettingsFormValues) {
    setIsSubmitting(true);
    const toastId = toast.loading("Ayarlar kaydediliyor...");
    try {
      const response = await apiClient.updateSiteSettings(values);
      if (response.success) {
        toast.success("Ayarlar başarıyla güncellendi!", { id: toastId });
      } else {
        toast.error("Güncelleme başarısız.", { id: toastId });
      }
    } catch (error) {
      toast.error("Bir hata oluştu.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <GlobalLoading />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <Badge
            variant="outline"
            className="rounded-full border-primary/20 text-primary bg-primary/5 px-3 py-0.5 font-bold uppercase tracking-widest text-[10px] mb-2"
          >
            Sistem Konfigürasyonu
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight flex items-center gap-3">
            Site Ayarları
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Platformun kimliğini, görünümünü ve temel çalışma kurallarını
            yapılandırın.
          </p>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-primary/20 text-base"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Değişiklikleri Kaydet
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start bg-muted/30 p-1 rounded-2xl h-auto mb-8 border border-border/40">
              <TabsTrigger
                value="general"
                className="rounded-xl px-6 py-3 font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Globe className="w-4 h-4" /> Genel
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="rounded-xl px-6 py-3 font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Palette className="w-4 h-4" /> Görünüm
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="rounded-xl px-6 py-3 font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Mail className="w-4 h-4" /> İletişim
              </TabsTrigger>
              <TabsTrigger
                value="seo"
                className="rounded-xl px-6 py-3 font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Search className="w-4 h-4" /> SEO
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="rounded-xl px-6 py-3 font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <ShieldAlert className="w-4 h-4" /> Sistem
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="general"
              className="space-y-6 focus-visible:outline-none"
            >
              <Card className="border-border/40 rounded-[2rem] overflow-hidden shadow-sm">
                <CardHeader className="p-8 border-b bg-muted/10">
                  <CardTitle className="text-xl font-bold">
                    Genel Bilgiler
                  </CardTitle>
                  <CardDescription>
                    Sitenizin temel kimlik bilgileri.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Site Adı</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-12 rounded-xl border-border/50 bg-muted/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Site Açıklaması
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[120px] rounded-xl border-border/50 bg-muted/20 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="appearance"
              className="space-y-6 focus-visible:outline-none"
            >
              <Card className="border-border/40 rounded-[2rem] overflow-hidden shadow-sm">
                <CardHeader className="p-8 border-b bg-muted/10">
                  <CardTitle className="text-xl font-bold">
                    Marka & Stil
                  </CardTitle>
                  <CardDescription>
                    Logo, ikonlar ve ana renk ayarları.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold flex items-center gap-2 mb-4">
                            <ImageIcon className="w-4 h-4 text-primary" /> Logo
                            URL
                          </FormLabel>
                          <div className="flex flex-col gap-4">
                            <Input
                              {...field}
                              placeholder="https://..."
                              className="h-12 rounded-xl"
                            />
                            {field.value && (
                              <div className="p-4 rounded-2xl bg-muted/30 border border-dashed flex items-center justify-center">
                                <Image
                                  src={field.value}
                                  alt="Logo"
                                  width={120}
                                  height={40}
                                  className="object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="faviconUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold flex items-center gap-2 mb-4">
                            <Globe className="w-4 h-4 text-primary" /> Favicon
                            URL
                          </FormLabel>
                          <div className="flex flex-col gap-4">
                            <Input
                              {...field}
                              placeholder="https://..."
                              className="h-12 rounded-xl"
                            />
                            {field.value && (
                              <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-dashed flex items-center justify-center">
                                <Image
                                  src={field.value}
                                  alt="Favicon"
                                  width={32}
                                  height={32}
                                />
                              </div>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-border/40">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">
                            Ana Renk (Primary)
                          </FormLabel>
                          <div className="flex items-center gap-4">
                            <FormControl className="w-20">
                              <Input
                                type="color"
                                {...field}
                                className="h-12 rounded-xl p-1 cursor-pointer"
                              />
                            </FormControl>
                            <Input
                              {...field}
                              className="h-12 rounded-xl flex-1 font-mono uppercase"
                            />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">
                            İkincil Renk (Secondary)
                          </FormLabel>
                          <div className="flex items-center gap-4">
                            <FormControl className="w-20">
                              <Input
                                type="color"
                                {...field}
                                className="h-12 rounded-xl p-1 cursor-pointer"
                              />
                            </FormControl>
                            <Input
                              {...field}
                              className="h-12 rounded-xl flex-1 font-mono uppercase"
                            />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="contact"
              className="space-y-6 focus-visible:outline-none"
            >
              <Card className="border-border/40 rounded-[2rem] overflow-hidden shadow-sm">
                <CardHeader className="p-8 border-b bg-muted/10">
                  <CardTitle className="text-xl font-bold">
                    İletişim Bilgileri
                  </CardTitle>
                  <CardDescription>
                    Sitede yer alan resmi iletişim kanalları.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-muted-foreground">
                            Resmi E-posta
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-muted-foreground">
                            Telefon Numarası
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="seo"
              className="space-y-6 focus-visible:outline-none"
            >
              <Card className="border-border/40 rounded-[2rem] overflow-hidden shadow-sm">
                <CardHeader className="p-8 border-b bg-muted/10">
                  <CardTitle className="text-xl font-bold">
                    Arama Motoru Optimizasyonu (SEO)
                  </CardTitle>
                  <CardDescription>
                    Google ve diğer arama motorlarında görünürlüğünüzü artırın.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">SEO Başlığı</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12 rounded-xl" />
                        </FormControl>
                        <FormDescription>
                          Tarayıcı sekmesinde görünen başlık.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          SEO Açıklaması
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[100px] rounded-xl resize-none"
                          />
                        </FormControl>
                        <FormDescription>
                          Arama sonuçlarında başlığın altında çıkan metin.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="system"
              className="space-y-6 focus-visible:outline-none"
            >
              <Card className="border-border/40 rounded-[2rem] overflow-hidden shadow-sm">
                <CardHeader className="p-8 border-b bg-muted/10">
                  <CardTitle className="text-xl font-bold">
                    Sistem Kontrolleri
                  </CardTitle>
                  <CardDescription>
                    Platformun çalışma modlarını yönetin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <FormField
                    control={form.control}
                    name="maintenanceMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-6 rounded-2xl bg-muted/20 border border-border/40">
                        <div className="space-y-1">
                          <FormLabel className="text-base font-bold">
                            Bakım Modu
                          </FormLabel>
                          <FormDescription className="max-w-md">
                            Siteyi geçici olarak ziyaretçilere kapatın. Sadece
                            yöneticiler erişebilir.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="allowRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-6 rounded-2xl bg-muted/20 border border-border/40">
                        <div className="space-y-1">
                          <FormLabel className="text-base font-bold">
                            Yeni Kayıtlar
                          </FormLabel>
                          <FormDescription className="max-w-md">
                            Platforma yeni öğrencilerin kayıt olmasına izin
                            verin.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
