"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Drawer,
  ScrollShadow,
  Separator,
} from "@heroui/react";

import { cn } from "@/utils";
import { useAppStore } from "@/stores";
import { APP_NAME } from "@/constants";
import { NAV_SECTIONS, type NavItem } from "./nav-items";

export function AppSidebar() {
  const pathname = usePathname();
  const { setSidebarOpen } = useAppStore();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const navContent = (
    <ScrollShadow
      hideScrollBar
      className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
    >
      {NAV_SECTIONS.map((section, sectionIdx) => (
        <div key={section.title} className={cn(sectionIdx > 0 && "mt-2")}>
          {sectionIdx > 0 && <Separator className="mb-2" />}
          <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-default-400">
            {section.title}
          </span>
          <nav className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </nav>
        </div>
      ))}
    </ScrollShadow>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-default-200 bg-surface dark:border-default-100 lg:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-default-200 px-4 dark:border-default-100">
          <Link
            href="/"
            className="flex items-center gap-2 overflow-hidden whitespace-nowrap font-semibold"
          >
            <span className="shrink-0 text-lg">P</span>
            <span>{APP_NAME}</span>
          </Link>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          {navContent}
        </div>
      </aside>

      <Drawer state={useMobileDrawerState()}>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog className="w-72">
              <Drawer.Header className="flex items-center gap-2">
                <span className="text-lg font-semibold">P</span>
                <Drawer.Heading className="font-semibold">
                  {APP_NAME}
                </Drawer.Heading>
                <Drawer.CloseTrigger className="ml-auto" />
              </Drawer.Header>
              <Drawer.Body className="overflow-hidden p-0">
                {navContent}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}

function SidebarNavItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-default-100 text-foreground dark:bg-default-150"
          : "text-default-500 hover:bg-default-100 hover:text-foreground dark:hover:bg-default-150"
      )}
    >
      <Icon
        className={cn(
          "size-5 shrink-0",
          isActive ? "text-foreground" : "text-default-400"
        )}
      />
      <span>{item.label}</span>
    </Link>
  );
}

function useMobileDrawerState() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return {
    isOpen: sidebarOpen,
    open: () => setSidebarOpen(true),
    close: () => setSidebarOpen(false),
    toggle: () => setSidebarOpen(!sidebarOpen),
    setOpen: (open: boolean) => setSidebarOpen(open),
  };
}
