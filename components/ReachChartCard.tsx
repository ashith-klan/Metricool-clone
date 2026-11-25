'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { ReachSeries } from '@/lib/analytics-data';
import { jetbrainsMono } from '@/lib/fonts';
import { cn } from '@/lib/utils';

interface ReachChartCardProps {
  series: ReachSeries;
  dateRangeLabel: string;
  channelLabel?: string;
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

export default function ReachChartCard({
  series,
  dateRangeLabel,
  channelLabel,
}: ReachChartCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [showOrganic, setShowOrganic] = useState(true);
  const [showPaid, setShowPaid] = useState(true);

  const totals = useMemo(() => {
    const organicTotal = series.organic.reduce((sum, val) => sum + val, 0);
    const paidTotal = series.paid.reduce((sum, val) => sum + val, 0);
    const combined = organicTotal + paidTotal;
    const organicShare =
      combined > 0 ? Math.round((organicTotal / combined) * 100) : 0;
    return { organicTotal, paidTotal, combined, organicShare };
  }, [series]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const organicGradient = ctx.createLinearGradient(0, 0, 0, 320);
    organicGradient.addColorStop(0, 'rgba(79, 70, 229, 0.14)');
    organicGradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');

    const paidGradient = ctx.createLinearGradient(0, 0, 0, 320);
    paidGradient.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
    paidGradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const datasets = [];
    if (showOrganic) {
      datasets.push({
        label: 'Organic Reach',
        data: series.organic,
        borderColor: '#4F46E5',
        backgroundColor: organicGradient,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#4F46E5',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.36,
      });
    }
    if (showPaid) {
      datasets.push({
        label: 'Paid Reach',
        data: series.paid,
        borderColor: '#F59E0B',
        backgroundColor: paidGradient,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#F59E0B',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.36,
      });
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: series.labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: prefersReducedMotion ? 0 : 240,
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#0F172A',
            titleColor: '#F8FAFC',
            bodyColor: '#E2E8F0',
            borderColor: 'rgba(148, 163, 184, 0.2)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            callbacks: {
              label(context) {
                const value = Number(context.parsed.y ?? 0);
                return ` ${context.dataset.label}: ${value.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: '#64748B',
              font: {
                size: 12,
              },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8,
            },
          },
          y: {
            beginAtZero: true,
            border: {
              display: false,
            },
            grid: {
              color: '#F1F5F9',
            },
            ticks: {
              color: '#64748B',
              font: {
                size: 12,
              },
              padding: 10,
              callback(value) {
                const num = Number(value);
                if (num === 0) return '0';
                if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
                if (num >= 1_000) return `${Math.round(num / 1_000)}K`;
                return `${num}`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [series, showOrganic, showPaid]);

  const handleToggleOrganic = () => {
    if (showOrganic && !showPaid) return;
    setShowOrganic((prev) => !prev);
  };

  const handleTogglePaid = () => {
    if (showPaid && !showOrganic) return;
    setShowPaid((prev) => !prev);
  };

  return (
    <section
      aria-labelledby="reach-chart-heading"
      className="rounded-xl bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 pb-6 border-b border-slate-100 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h2
            id="reach-chart-heading"
            className="text-base font-semibold text-slate-900"
          >
            Organic vs Paid Reach
          </h2>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
            {channelLabel && (
              <>
                <span className="font-medium text-slate-700">
                  {channelLabel}
                </span>
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
              </>
            )}
            <span>{dateRangeLabel}</span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span>
              Organic{' '}
              <strong
                className={cn(
                  jetbrainsMono.className,
                  'font-semibold text-slate-800 tabular-nums'
                )}
              >
                {formatCompact(totals.organicTotal)}
              </strong>
            </span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span>
              Paid{' '}
              <strong
                className={cn(
                  jetbrainsMono.className,
                  'font-semibold text-slate-800 tabular-nums'
                )}
              >
                {formatCompact(totals.paidTotal)}
              </strong>
            </span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="tabular-nums">
              {totals.organicShare}% organic share
            </span>
          </div>
        </div>

        {/* Interactive Series Controls */}
        <div
          className="flex items-center gap-2 self-start lg:self-auto"
          role="group"
          aria-label="Toggle chart series"
        >
          <button
            type="button"
            onClick={handleToggleOrganic}
            aria-pressed={showOrganic}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium border transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
              showOrganic
                ? 'border-indigo-200 bg-indigo-50/70 text-slate-900'
                : 'border-slate-200 bg-white text-slate-400 hover:text-slate-600'
            )}
          >
            <span
              className={cn(
                'h-0.5 w-3.5 rounded-full',
                showOrganic ? 'bg-indigo-600' : 'bg-slate-300'
              )}
              aria-hidden="true"
            />
            <span>Organic Reach</span>
          </button>

          <button
            type="button"
            onClick={handleTogglePaid}
            aria-pressed={showPaid}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium border transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
              showPaid
                ? 'border-amber-200 bg-amber-50/70 text-slate-900'
                : 'border-slate-200 bg-white text-slate-400 hover:text-slate-600'
            )}
          >
            <span
              className={cn(
                'h-0.5 w-3.5 rounded-full',
                showPaid ? 'bg-amber-500' : 'bg-slate-300'
              )}
              aria-hidden="true"
            />
            <span>Paid Reach</span>
          </button>
        </div>
      </div>

      {/* Chart.js Canvas Container */}
      <div className="relative mt-6 h-72 w-full sm:h-80 lg:h-[340px]">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Line chart comparing Organic vs Paid Reach for ${dateRangeLabel}`}
        />
      </div>
    </section>
  );
}
