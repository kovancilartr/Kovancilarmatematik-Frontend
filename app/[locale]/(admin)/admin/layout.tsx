"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/components/providers/auth-context-provider";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import GlobalLoading from "@/components/layout/GlobalLoading";

import { toast } from "react-hot-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "tr";

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, go to login
      if (!isAuthenticated) {
        router.push(`/${locale}/login`);
        return;
      }

      // If authenticated but not admin, go to home with warning
      if (user?.role !== "ADMIN") {
        toast.error("Bu sayfaya erişim yetkiniz bulunmuyor.");
        router.push(`/${locale}`);
      }
    }
  }, [isLoading, isAuthenticated, user, router, locale]);

  // While loading auth state, or if user is not a valid admin, show a loading screen.
  // This prevents a flash of content before the redirect happens.
  if (isLoading || !isAuthenticated || user?.role !== "ADMIN") {
    return <GlobalLoading />;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Header for all screens */}
      <DashboardHeader />

      {/* Main content area */}
      <main className="flex-1 container mx-auto p-4 md:p-10">
        {children}
      </main>
    </div>
  );
}
