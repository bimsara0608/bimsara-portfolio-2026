import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { FolderKanban, MessageSquare, Star, Plus, ArrowRight, Eye } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch real stats in parallel
  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: unreadMessages },
    { count: totalTestimonials },
    { data: recentMessages },
    { data: recentProjects },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase
      .from('contact_messages')
      .select('id, name, email, message, created_at, is_read')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('projects')
      .select('id, title, category, is_published, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const stats = [
    {
      label: 'Total Projects',
      value: totalProjects ?? 0,
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'bg-muted text-foreground',
    },
    {
      label: 'Published',
      value: publishedProjects ?? 0,
      icon: Eye,
      href: '/admin/projects',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      label: 'Unread Messages',
      value: unreadMessages ?? 0,
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'bg-orange-500/10 text-orange-500',
    },
    {
      label: 'Testimonials',
      value: totalTestimonials ?? 0,
      icon: Star,
      href: '/admin/testimonials',
      color: 'bg-purple-500/10 text-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back. Here&apos;s what&apos;s happening.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="magnetic inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={18} /> New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <p className="text-4xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-2 group-hover:text-foreground transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <h2 className="font-bold text-lg">Recent Messages</h2>
            <Link
              href="/admin/messages"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium magnetic"
            >
              View all
            </Link>
          </div>
          {recentMessages && recentMessages.length > 0 ? (
            <div className="divide-y divide-border/50">
              {recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  href="/admin/messages"
                  className={`flex items-start gap-3 px-6 py-4 hover:bg-muted transition-colors ${!msg.is_read ? 'border-l-2 border-foreground' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm truncate">{msg.name}</p>
                      {!msg.is_read && (
                        <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{msg.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground/50 flex-shrink-0">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-muted-foreground">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No messages yet</p>
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <h2 className="font-bold text-lg">Recent Projects</h2>
            <Link
              href="/admin/projects"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium magnetic"
            >
              View all
            </Link>
          </div>
          {recentProjects && recentProjects.length > 0 ? (
            <div className="divide-y divide-border/50">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-muted transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{project.title}</p>
                    <p className="text-xs text-muted-foreground">{project.category}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      project.is_published
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {project.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-muted-foreground">
              <FolderKanban size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No projects yet</p>
              <Link
                href="/admin/projects/new"
                className="text-sm text-foreground hover:underline mt-1 inline-block font-medium"
              >
                Add your first project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
