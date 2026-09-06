"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Star,
  User,
  Settings,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
    };
    const getUnread = async () => {
      const { count } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);
      setUnreadCount(count ?? 0);
    };
    getUser();
    getUnread();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare, badge: unreadCount },
    { name: "Testimonials", href: "/admin/testimonials", icon: Star },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out flex-shrink-0`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!collapsed && (
            <Link href="/" className="font-bold text-lg tracking-tight text-accent truncate">
              Portfolio CMS
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-muted hover:bg-gray-100 hover:text-foreground transition-colors ml-auto"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors relative ${
                  isActive
                    ? "bg-accent text-white"
                    : "text-muted hover:bg-gray-100 hover:text-foreground"
                }`}
              >
                <item.icon size={18} className="flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && item.badge > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-gray-200 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? "View Live Site" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-muted hover:bg-gray-100 hover:text-foreground transition-colors"
          >
            <ExternalLink size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">View Live Site</span>}
          </a>

          <button
            onClick={handleSignOut}
            title={collapsed ? "Sign Out" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">Sign Out</span>}
          </button>

          {!collapsed && userEmail && (
            <div className="px-3 py-2 mt-2">
              <p className="text-xs text-muted truncate" title={userEmail}>
                {userEmail}
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
