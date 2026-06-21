"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Discover", href: "/explore" },
  { icon: Plus, label: "Upload", href: "/upload", isPrimary: true },
  { icon: MessageSquare, label: "Inbox", href: "/inbox" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] z-50 safe-bottom shadow-2xl overflow-hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center justify-center"
              >
                <div className="w-12 h-10 bg-white rounded-xl flex items-center justify-center transition-transform active:scale-90 shadow-lg group-hover:bg-primary group-hover:text-primary-foreground">
                  <Plus className="w-6 h-6 text-black" />
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
                isActive ? "text-white" : "text-white/40 hover:text-white/70"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
