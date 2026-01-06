import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export interface HeroContent {
  hero_title: string;
  hero_subtitle?: string;
  hero_caption?: string;
  hero_paragraph1?: string;
  hero_paragraph2?: string;
  hero_paragraph3?: string;
  hero_cta_label?: string;
  hero_cta_url?: string;
}

interface HeroProps {
  content: HeroContent;
}

const Hero = ({ content }: HeroProps) => {
  return (
    <div className="relative overflow-hidden bg-background pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-1000">
              <Sparkles className="w-4 h-4" />
              <span>{content.hero_caption || "Matematikte Başarının Adresi"}</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                {content.hero_title}
                <span className="block text-primary mt-2">{content.hero_subtitle}</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
                {content.hero_paragraph1 || "Matematiği sevdirerek öğreten, başarıya giden yolda yanınızda olan dijital öğrenme platformu."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
              {content.hero_cta_label && (
                <Link href={content.hero_cta_url || "/courses"}>
                  <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold group">
                    {content.hero_cta_label}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-base font-semibold">
                <Play className="mr-2 w-5 h-5 fill-current" />
                Tanıtım Videosu
              </Button>
            </div>

            {/* Trust Badges / Stats */}
            <div className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-8 border-t border-border animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-400">
              <div>
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm text-muted-foreground">Aktif Öğrenci</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-muted-foreground">Video Kurs</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <div className="text-2xl font-bold">4.9/5</div>
                <div className="text-sm text-muted-foreground">Başarı Oranı</div>
              </div>
            </div>
          </div>

          {/* Hero Image / Visual */}
          <div className="flex-1 relative w-full max-w-[600px] animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-background ring-1 ring-border">
              <Image
                src="/bg.jpg"
                alt="Mathematics Education"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Floating Elements */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-xl border border-border animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-bold">Canlı Destek</div>
                  <div className="text-xs text-muted-foreground">Şu an çevrimiçi</div>
                </div>
              </div>
            </div>

            <div className="absolute top-10 -right-6 bg-card p-4 rounded-2xl shadow-xl border border-border animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  Σ
                </div>
                <div>
                  <div className="text-sm font-bold">Yeni İçerik</div>
                  <div className="text-xs text-muted-foreground">İntegral Serisi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

