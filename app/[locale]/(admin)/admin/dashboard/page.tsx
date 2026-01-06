"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-context-provider";
import {
  Users,
  Layers,
  Video,
  FileText,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const date = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      label: "Toplam Öğrenci",
      value: "1,284",
      change: "+12%",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Kategoriler",
      value: "12",
      change: "+2",
      icon: Layers,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Aktif Dersler",
      value: "156",
      change: "+8%",
      icon: Video,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Materyaller",
      value: "432",
      change: "+24",
      icon: FileText,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "lesson",
      title: "Türev Giriş Videosu Yüklendi",
      time: "2 saat önce",
      user: "Admin",
    },
    {
      id: 2,
      type: "user",
      title: "Yeni öğrenci kaydı: Ahmet Y.",
      time: "5 saat önce",
      user: "Sistem",
    },
    {
      id: 3,
      type: "material",
      title: "İntegral PDF notları güncellendi",
      time: "1 gün önce",
      user: "Admin",
    },
    {
      id: 4,
      type: "category",
      title: "LGS Hazırlık kategorisi oluşturuldu",
      time: "2 gün önce",
      user: "Admin",
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 text-primary bg-primary/5 px-3 py-0.5 font-bold uppercase tracking-widest text-[10px]"
            >
              Yönetim Merkezi
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {date}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight flex items-center gap-3">
            Merhaba, {user?.name?.split(" ")[0] || "Yönetici"}{" "}
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Platformdaki son gelişmelere ve istatistiklere bir göz atalım.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/settings">
            <Button
              variant="outline"
              className="rounded-2xl h-12 px-6 font-bold gap-2"
            >
              Sistem Ayarları
            </Button>
          </Link>
          <Link href="/admin/lessons">
            <Button className="rounded-2xl h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> Yeni Ders
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="border-border/50 bg-card/50 backdrop-blur-sm rounded-[2rem] overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-500"
          >
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div
                  className={
                    stat.bg +
                    " p-4 rounded-2xl transition-transform group-hover:scale-110"
                  }
                >
                  <stat.icon className={stat.color + " w-6 h-6"} />
                </div>
                <Badge className="bg-green-500/10 text-green-600 border-none font-bold">
                  {stat.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </p>
                <h3 className="text-4xl font-black tracking-tighter">
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-border/50 rounded-[2.5rem] bg-card overflow-hidden shadow-sm">
          <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">
                Son Etkinlikler
              </CardTitle>
              <CardDescription>
                Sistem üzerinden gerçekleştirilen son işlemler
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full font-bold text-primary group"
            >
              Tümünü Gör{" "}
              <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-1">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    {activity.type === "lesson" && (
                      <Video className="w-5 h-5 text-orange-500" />
                    )}
                    {activity.type === "user" && (
                      <Users className="w-5 h-5 text-blue-500" />
                    )}
                    {activity.type === "material" && (
                      <FileText className="w-5 h-5 text-green-500" />
                    )}
                    {activity.type === "category" && (
                      <Layers className="w-5 h-5 text-purple-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{activity.user} tarafından</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status / Quick Tips */}
        <div className="space-y-8">
          <Card className="border-border/50 rounded-[2.5rem] bg-primary text-primary-foreground overflow-hidden shadow-xl shadow-primary/20 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" /> Sistem Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-80">
                  <span>Sunucu Kapasitesi</span>
                  <span>%24</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[24%] rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-80">
                  <span>Depolama (Video)</span>
                  <span>%68</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[68%] rounded-full" />
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-70">
                Tüm servisler normal çalışıyor. Yedekleme işlemi başarıyla
                tamamlandı.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 rounded-[2.5rem] bg-card p-8 space-y-4 shadow-sm border">
            <h3 className="font-bold flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
              Hızlı İpucu
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Derslerinizin sonuna &quot;Özet PDF&quot; eklemek, öğrenci
              memnuniyet oranını ortalama{" "}
              <span className="font-bold text-foreground">%15 artırıyor</span>.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl font-bold"
            >
              Daha Fazla Bilgi
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
