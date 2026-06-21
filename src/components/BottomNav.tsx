
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusSquare, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: PlusSquare, label: "Upload", href: "/upload", isPrimary: true },
  { icon: Bell, label: "Snaps", href: "/activity" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-white/5 z-50 safe-bottom">
      <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-all duration-200 elastic-scale",
                item.isPrimary ? "text-primary -mt-8 bg-background p-3 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(193,102,242,0.3)]" : "text-muted-foreground",
                isActive && !item.isPrimary && "text-accent"
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6",
                  isActive && "fill-current"
                )} 
              />
              {!item.isPrimary && (
                <span className="text-[10px] font-medium tracking-tight">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
