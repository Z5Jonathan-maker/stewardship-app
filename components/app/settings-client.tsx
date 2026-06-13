"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  Mail,
  ShieldCheck,
  KeyRound,
  MonitorSmartphone,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app/page-header";
import { useTheme } from "@/components/app/theme-provider";
import { household } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  { key: "budget", label: "Budget alerts", desc: "When a category is close to or over its limit." },
  { key: "large", label: "Large transactions", desc: "When a transaction over $250 posts." },
  { key: "summary", label: "Weekly summary", desc: "A Monday recap of spending, giving, and cash flow." },
  { key: "giving", label: "Giving reminders", desc: "A gentle nudge if you're behind your tithe goal." },
] as const;

export function SettingsClient() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    budget: true,
    large: true,
    summary: true,
    giving: false,
  });
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader title="Settings" subtitle="Manage your household, preferences, and security." />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-evergreen-700 font-display text-2xl font-semibold text-cream-50">
              {household.members[0][0]}
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-evergreen-900">
                {household.members[0]} Carter
              </p>
              <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> jonathan@example.com
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">Edit</Button>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-evergreen-800">Household</p>
            <div className="flex flex-wrap items-center gap-2">
              {household.members.map((m) => (
                <Badge key={m} variant="brand">{m}</Badge>
              ))}
              <Button variant="ghost" size="sm">+ Invite spouse</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how uniFi looks on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="inline-flex rounded-full border border-border bg-muted p-1">
            {(["light", "dark"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                  theme === t
                    ? "bg-card text-evergreen-900 shadow-soft"
                    : "text-muted-foreground hover:text-evergreen-800"
                )}
              >
                {t === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {t}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {NOTIFICATIONS.map((n) => (
            <div key={n.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-evergreen-900">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch
                checked={!!notifications[n.key]}
                onChange={(next) => setNotifications((s) => ({ ...s, [n.key]: next }))}
                label={n.label}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-brand-500" />
              <div>
                <p className="text-sm font-medium text-evergreen-900">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">Add a second step when signing in.</p>
              </div>
            </div>
            <Switch checked={twoFactor} onChange={setTwoFactor} label="Two-factor authentication" />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-border py-3">
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-evergreen-600" />
              <p className="text-sm font-medium text-evergreen-900">Password</p>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-border py-3">
            <div className="flex items-center gap-3">
              <MonitorSmartphone className="h-5 w-5 text-evergreen-600" />
              <p className="text-sm font-medium text-evergreen-900">Active sessions</p>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card className="bg-brand-50">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-evergreen-900">Free trial — 22 days left</p>
              <p className="text-xs text-evergreen-700">Upgrade to keep stewarding well, together.</p>
            </div>
          </div>
          <Button asChild size="sm">
            <Link href="/pricing">See plans</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-4">
        <Button asChild variant="ghost" className="text-destructive hover:bg-destructive/10">
          <Link href="/login">
            <LogOut className="h-4 w-4" /> Sign out
          </Link>
        </Button>
      </div>
    </div>
  );
}
