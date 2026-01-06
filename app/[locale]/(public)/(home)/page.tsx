// app/[locale]/(public)/page.tsx
"use client";

import { useGetAllCategories } from "@/hooks/api/use-categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  BookOpen,
  Zap,
  Users,
  Award,
  ArrowRight,
  Clock,
  Video,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Hero from "@/components/layout/Hero";
import GlobalLoading from "@/components/layout/GlobalLoading";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Hızlı Öğrenme",
    description:
      "En karmaşık konuları bile en basit haliyle, mantığını kavrayarak öğrenin.",
  },
  {
    icon: <Users className="w-6 h-6 text-blue-500" />,
    title: "Birebir Destek",
    description:
      "Takıldığınız her noktada yanınızdayız. Sorularınızı sorun, anında yanıt alın.",
  },
  {
    icon: <Award className="w-6 h-6 text-purple-500" />,
    title: "Başarı Garantisi",
    description:
      "Sınav formatına %100 uyumlu içeriklerle hedeflerinize bir adım daha yaklaşın.",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-green-500" />,
    title: "Zengin Kaynaklar",
    description:
      "Video derslerin yanında PDF notlar ve çalışma kağıtları ile eğitiminizi destekleyin.",
  },
];

export default function HomePage() {
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useGetAllCategories();

  if (isLoading) {
    return <GlobalLoading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] text-destructive">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="font-semibold">Bir hata oluştu</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-24 pb-24">
      <Hero
        content={{
          hero_title: "Matematiğin",
          hero_subtitle: "Kovancılar Hali",
          hero_caption: "Kovancılar Matematik & Geometri",
          hero_paragraph1:
            "Sınav yolculuğunda yanındayız. TYT, AYT, LGS ve tüm okul derslerinde en güncel tekniklerle matematiği korkulan bir ders olmaktan çıkarıyoruz.",
          hero_cta_label: "Hemen Başla",
          hero_cta_url: "#courses",
        }}
      />

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl bg-card border border-border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-4 py-1 px-4 rounded-full border-primary/20 text-primary bg-primary/5"
            >
              Kurs Kataloğu
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight">
              Eğitim Kategorilerimiz
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Her seviyeye uygun, özenle hazırlanmış video kurslarımızla
              eksiklerinizi tamamlayın.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="ghost" className="group">
              Tümünü Gör
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/courses/${category.id}`}
                className="group block"
              >
                <Card className="h-full border-border bg-card overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-primary/20 group-hover:-translate-y-2 p-0 rounded-[2.5rem]">
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={`https://picsum.photos/seed/${category.id}/800/500`}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur-sm border-none font-bold">
                        Premium
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="space-y-1 px-6 pt-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Video className="w-3 h-3" />
                      <span>12+ Video</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <Clock className="w-3 h-3" />
                      <span>8 Saat</span>
                    </div>
                    <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-8">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {category.name} konularını kapsayan, sınavlarda en çok
                      çıkan soru tiplerini içeren kapsamlı eğitim seti.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-[3rem] bg-muted/30">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-semibold">
              Henüz hiç kurs eklenmemiş.
            </h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              Yönetici panelinden yeni kurslar ekleyerek kataloğunuzu
              oluşturmaya başlayabilirsiniz.
            </p>
          </div>
        )}
      </section>

      {/* Stats / Proof Section */}
      <section className="bg-primary text-primary-foreground py-20 rounded-[3rem] container mx-auto px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center relative z-10">
          <div className="space-y-2">
            <div className="text-4xl lg:text-6xl font-black">5.000+</div>
            <div className="text-primary-foreground/70 font-medium">
              Toplam Soru Çözümü
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl lg:text-6xl font-black">250+</div>
            <div className="text-primary-foreground/70 font-medium">
              Saatlik İçerik
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl lg:text-6xl font-black">%98</div>
            <div className="text-primary-foreground/70 font-medium">
              Memnuniyet Oranı
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl lg:text-6xl font-black">24/7</div>
            <div className="text-primary-foreground/70 font-medium">
              Erişim İmkanı
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-card border border-border rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 relative z-10 max-w-3xl mx-auto">
            Geleceğini <span className="text-primary">Matematik</span> İle İnşa
            Etmeye Hazır Mısın?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 relative z-10 max-w-2xl mx-auto">
            Hemen ücretsiz üye ol, deneme derslerine göz at ve öğrenmeye başla.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <Link href="/register">
              <Button
                size="lg"
                className="rounded-full px-12 h-16 text-lg font-bold"
              >
                Ücretsiz Kayıt Ol
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-12 h-16 text-lg font-bold"
              >
                Hakkımızda Daha Fazla Bilgi
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
