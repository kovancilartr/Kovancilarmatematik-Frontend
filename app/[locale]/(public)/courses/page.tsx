// app/[locale]/(public)/courses/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useGetAllCategories } from "@/hooks/api/use-categories";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Video,
  ArrowRight,
  Filter,
  GraduationCap,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GlobalLoading from "@/components/layout/GlobalLoading";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useGetAllCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Tümü");

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        selectedFilter === "Tümü" ||
        category.name.toUpperCase().includes(selectedFilter.toUpperCase());

      return matchesSearch && matchesFilter;
    });
  }, [categories, searchQuery, selectedFilter]);

  if (isLoading) return <GlobalLoading />;

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Filter className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-destructive">Bir hata oluştu</h2>
        <p className="text-muted-foreground mt-2">{error.message}</p>
        <Button
          variant="outline"
          className="mt-8 rounded-full"
          onClick={() => window.location.reload()}
        >
          {" "}
          Tekrar Dene{" "}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Page Header / Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-muted/30 border-b">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <Badge
            variant="outline"
            className="mb-6 py-1 px-4 rounded-full border-primary/20 text-primary bg-primary/5 font-black uppercase tracking-widest text-[10px]"
          >
            Eğitim Kataloğu
          </Badge>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1]">
            Bilgiyi <span className="text-primary">Kalıcı</span> Hale Getiren
            Eğitimler
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Hedeflerine ulaşman için özenle hazırladığımız TYT, AYT ve LGS
            odaklı matematik kurslarımızı keşfet.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-card border border-border shadow-2xl shadow-primary/5 rounded-[2.5rem] p-4 md:p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Kurs ara (örn: TYT Matematik, Logaritma...)"
              className="h-14 pl-12 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-primary/20 transition-all text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide max-w-full">
            {["Tümü", "TYT", "AYT", "LGS", "Geometri"].map((tag) => (
              <Button
                key={tag}
                variant={selectedFilter === tag ? "default" : "ghost"}
                className={cn(
                  "rounded-xl h-12 px-6 font-bold transition-all shrink-0",
                  selectedFilter === tag
                    ? "shadow-lg shadow-primary/20"
                    : "text-muted-foreground"
                )}
                onClick={() => setSelectedFilter(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="container mx-auto px-4 mt-20">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-black tracking-tight">
              Tüm Kurslar ({filteredCategories.length})
            </h2>
          </div>
          <div className="h-px bg-border flex-1 mx-8 hidden md:block" />
        </div>

        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/courses/${category.id}`}
                className="group h-full"
              >
                <Card className="h-full border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-primary/30 hover:-translate-y-2 flex flex-col rounded-[2.5rem] p-0">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={`https://picsum.photos/seed/${category.id}/800/500`}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-primary text-primary-foreground border-none font-bold rounded-lg backdrop-blur-md">
                        Premium
                      </Badge>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-3 text-white/90 text-xs font-bold">
                        <div className="flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5" />
                          <span>12+ Video</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>Sertifikalı</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pt-6">
                    <CardTitle className="text-xl font-black leading-tight group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {category.name} konularını en ince ayrıntısına kadar
                      öğreten, pratik çözüm yolları içeren kapsamlı eğitim
                      programı.
                    </p>
                  </CardContent>

                  <CardFooter className="pt-0 pb-8 px-6">
                    <Button className="w-full rounded-2xl h-12 font-bold gap-2 group/btn relative overflow-hidden">
                      <span className="relative z-10">İncele</span>
                      <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                      <div className="absolute inset-0 bg-linear-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-muted/20 border-2 border-dashed rounded-[3rem] border-border/50">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              Aradığınız kriterde kurs bulunamadı
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Lütfen farklı bir anahtar kelime deneyin veya filtreleri
              sıfırlayın.
            </p>
            <Button
              variant="outline"
              className="mt-8 rounded-full font-bold px-8"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("Tümü");
              }}
            >
              Filtreleri Temizle
            </Button>
          </div>
        )}
      </section>

      {/* Newsletter / CTA */}
      <section className="container mx-auto px-4 mt-32">
        <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="text-3xl md:text-5xl font-black text-primary-foreground mb-6 relative z-10">
            Yeni Kurslardan Haberdar Ol
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Kataloğumuza her ay yeni konular ekleniyor. Hiçbirini kaçırmamak
            için bültenimize katıl.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
            <Input
              placeholder="E-posta adresin"
              className="h-14 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/20"
            />
            <Button className="h-14 rounded-2xl px-10 bg-white text-primary hover:bg-white/90 font-black">
              Katıl
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
