import type { ComponentType, SVGProps } from "react";
import {
  House,
  Person,
  Pill,
  Gear,
  HeartPulse,
  GeoPin,
  Cube,
  Shield,
} from "@gravity-ui/icons";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  permission?: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        id: "home",
        label: "Home",
        href: "/",
        icon: House,
      },
      {
        id: "patients",
        label: "Patients",
        href: "/patients",
        icon: Person,
        permission: "depo:read",
      },
      {
        id: "admissions",
        label: "Admissions",
        href: "/admissions",
        icon: HeartPulse,
        permission: "depo:read",
      },
      {
        id: "dispense-orders",
        label: "Dispense Orders",
        href: "/dispense-order",
        icon: Pill,
        permission: "depo:read",
      },
      {
        id: "rooms",
        label: "Rooms",
        href: "/rooms",
        icon: GeoPin,
        permission: "depo:read",
      },
      {
        id: "products",
        label: "Products",
        href: "/products",
        icon: Cube,
        permission: "warehouse:read",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        id: "users",
        label: "Users",
        href: "/users",
        icon: Person,
        permission: "user:read",
      },
      {
        id: "roles",
        label: "Roles",
        href: "/roles",
        icon: Shield,
        permission: "role:manage",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        icon: Gear,
      },
    ],
  },
];
