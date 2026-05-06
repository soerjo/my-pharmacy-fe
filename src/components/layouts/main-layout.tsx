"use client";

import { AppSidebar } from "./sidebar";
import { AppFooter } from "./app-footer";
import { TopNavbar } from "./top-navbar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-64">
        <TopNavbar />
        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1">{children}</div>
          <AppFooter />
        </main>
      </div>
    </div>
  );
}
