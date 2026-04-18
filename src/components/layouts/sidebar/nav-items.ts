import type { ComponentType, SVGProps } from "react";
import { House, Person, Pill, Gear, HeartPulse, GeoPin, Cube } from "@gravity-ui/icons";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
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
      },
      {
        id: "admissions",
        label: "Admissions",
        href: "/admissions",
        icon: HeartPulse,
      },
      {
        id: "dispense-orders",
        label: "Dispense Orders",
        href: "/dispense-order",
        icon: Pill,
      },
      {
        id: "rooms",
        label: "Rooms",
        href: "/rooms",
        icon: GeoPin,
      },
      {
        id: "products",
        label: "Products",
        href: "/products",
        icon: Cube,
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
