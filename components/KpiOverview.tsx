'use client';

import React from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  MousePointerClick,
  Users,
} from 'lucide-react';
import { KpiMetric } from '@/lib/analytics-data';
import { jetbrainsMono } from '@/lib/fonts';
import { cn } from '@/lib/utils';

interface KpiOverviewProps {
  kpis: KpiMetric[];
  comparisonLabel: string;
}

const KPI_ICONS: Record<
  KpiMetric['id'],
  React.ComponentType<{ className?: string }>
> = {
  followerGrowth: Users,
  totalImpressions: Eye,
  engagementRate: Activity,
  websiteClicks: MousePointerClick,
};

export default function KpiOverview({
  kpis,
  comparisonLabel,
}: KpiOverviewProps) {
  return (
    <section aria-labelledby="kpi-overview-heading">
      <h2 id="kpi-overview-heading" className="sr-only">
        KPI Overview
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((metric) => {
          const Icon = KPI_ICONS[metric.id];
          return (
            <div
              key={metric.id}
              className="rounded-xl bg-white p-6 shadow-sm transition-shadow duration-150 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-500">
                  {metric.label}
                </span>
                <Icon
                  className="h-4 w-4 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
              </div>

              <div className="mt-3 flex items-baseline gap-2.5 flex-wrap">
                <span
                  className={cn(
                    jetbrainsMono.className,
                    'text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900 tabular-nums'
                  )}
                >
                  {metric.value}
                </span>
                <span
                  className={cn(
                    jetbrainsMono.className,
                    'inline-flex items-center gap-0.5 text-sm font-medium tabular-nums',
                    metric.isPositive ? 'text-emerald-600' : 'text-rose-600'
                  )}
                >
                  {metric.isPositive ? (
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span>{metric.changePercent}</span>
                </span>
              </div>

              <p className="mt-2.5 text-xs text-slate-500">
                <span>{metric.sublabel}</span>
                <span className="mx-1.5 text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span>{comparisonLabel}</span>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
