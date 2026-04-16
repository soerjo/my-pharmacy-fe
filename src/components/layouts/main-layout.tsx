"use client";

import { AppSidebar } from "./sidebar";
import { AppFooter } from "./app-footer";
import { TopNavbar } from "./top-navbar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-64">
        <TopNavbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <AppFooter />
      </div>
    </div>
  );
}
