
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Feed", href: "/" },
  { icon: Search, label: "Discover", href: "/explore" },
  { icon: Plus, label: "", href: "/upload", isPrimary: true },
  { icon: MessageSquare, label: "Inbox", href: "/inbox" },
  { icon: User, label: "Me", href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-black/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] z-50 safe-bottom shadow-2xl">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center justify-center -mt-2"
              >
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-primary/30 group-hover:scale-105">
                  <Plus className="w-7 h-7 text-primary-foreground" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-12 transition-all active:scale-95",
                isActive ? "text-primary" : "text-white/40 hover:text-white/70"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
              <span className="text-[8px] font-bold uppercase tracking-[0.1em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
