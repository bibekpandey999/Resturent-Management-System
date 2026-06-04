'use client';

import { Bell, LogOut, Search } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 touch-target" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        {title && (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 pl-8 bg-secondary/50 border-none focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative touch-target">
                <Bell className="size-5" />
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 size-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-success" />
                  <span className="font-medium">Order Ready</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Order #1044 for Table 7 is ready to serve
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-info" />
                  <span className="font-medium">New Order</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  New order #1043 received for Table 3
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-warning" />
                  <span className="font-medium">Low Stock Alert</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  House Red Wine is running low (3 bottles left)
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:flex items-center px-2">
            <a href="/login" className="text-sm font-medium text-foreground">
              <LogOut className="size-5 text-yellow-500" /></a>
          </div>

          {/* Mobile search button */}
          <Button variant="ghost" size="icon" className="md:hidden touch-target">
            <Search className="size-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
