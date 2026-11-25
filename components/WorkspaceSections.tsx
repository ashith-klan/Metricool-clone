'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  MailCheck,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { BrandWorkspace, NavSectionId } from '@/lib/analytics-data';
import { jetbrainsMono } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import PostScheduler from './PostScheduler';

interface WorkspaceSectionsProps {
  section: Exclude<NavSectionId, 'analytics'>;
  brand: BrandWorkspace;
  onReturnToAnalytics: () => void;
}

export default function WorkspaceSections({
  section,
  brand,
  onReturnToAnalytics,
}: WorkspaceSectionsProps) {
  const [readIds, setReadIds] = useState<Record<string, boolean>>({});
  const [flowToggles, setFlowToggles] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopySlug = (id: string, slug: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`https://${slug}`).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="space-y-6">
      {section !== 'planner' && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 capitalize">
              {section}
            </h2>
            <p className="text-sm text-slate-500">
              {brand.name} · {brand.handle}
            </p>
          </div>

          <button
            type="button"
            onClick={onReturnToAnalytics}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <ArrowLeft className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span>Back to Analytics</span>
          </button>
        </div>
      )}

      {section === 'planner' && (
        <PostScheduler
          key={brand.id}
          brand={brand}
          onReturnToAnalytics={onReturnToAnalytics}
        />
      )}

      {section === 'inbox' && (
        <div className="rounded-xl bg-white shadow-sm divide-y divide-slate-100 overflow-hidden">
          {brand.inbox.map((msg) => {
            const isUnread = msg.unread && !readIds[msg.id];
            return (
              <div
                key={msg.id}
                className={cn(
                  'flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between',
                  isUnread ? 'bg-indigo-50/30' : 'bg-white'
                )}
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="text-sm font-semibold text-slate-900">
                      {msg.author}
                    </span>
                    <span>{msg.handle}</span>
                    <span className="text-slate-300" aria-hidden="true">
                      ·
                    </span>
                    <span>{msg.channel}</span>
                    <span className="text-slate-300" aria-hidden="true">
                      ·
                    </span>
                    <span>{msg.receivedAt}</span>
                  </div>
                  <p className="text-sm text-slate-700">{msg.excerpt}</p>
                </div>

                {isUnread ? (
                  <button
                    type="button"
                    onClick={() =>
                      setReadIds((prev) => ({ ...prev, [msg.id]: true }))
                    }
                    className="inline-flex h-9 items-center gap-1.5 self-start sm:self-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                  >
                    <MailCheck className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                    <span>Mark read</span>
                  </button>
                ) : (
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap shrink-0">
                    Read
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {section === 'flows' && (
        <div className="rounded-xl bg-white shadow-sm divide-y divide-slate-100 overflow-hidden">
          {brand.flows.map((flow) => {
            const isActive =
              flowToggles[flow.id] !== undefined
                ? flowToggles[flow.id]
                : flow.active;
            return (
              <div
                key={flow.id}
                className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {flow.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {flow.trigger} ·{' '}
                    <span className={cn(jetbrainsMono.className, 'tabular-nums')}>
                      {flow.runsThisMonth.toLocaleString()}
                    </span>{' '}
                    runs ·{' '}
                    <span className={cn(jetbrainsMono.className, 'tabular-nums')}>
                      {flow.conversionRate}
                    </span>{' '}
                    conversion
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFlowToggles((prev) => ({
                      ...prev,
                      [flow.id]: !isActive,
                    }))
                  }
                  aria-pressed={isActive}
                  className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-md px-2 py-1"
                >
                  {isActive ? (
                    <>
                      <ToggleRight className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                      <span className="text-indigo-700">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-5 w-5 text-slate-400" aria-hidden="true" />
                      <span className="text-slate-500">Paused</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {section === 'smartlinks' && (
        <div className="rounded-xl bg-white shadow-sm divide-y divide-slate-100 overflow-hidden">
          {brand.smartlinks.map((link) => (
            <div
              key={link.id}
              className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  {link.title}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  <span className={jetbrainsMono.className}>{link.slug}</span>
                </p>
              </div>

              <div className="flex items-center gap-5 shrink-0">
                <div className="text-right">
                  <p
                    className={cn(
                      jetbrainsMono.className,
                      'text-sm font-semibold text-slate-900 tabular-nums'
                    )}
                  >
                    {link.clicks.toLocaleString()} clicks
                  </p>
                  <p
                    className={cn(
                      jetbrainsMono.className,
                      'text-xs text-slate-500 tabular-nums'
                    )}
                  >
                    {link.ctr} CTR
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopySlug(link.id, link.slug)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                  {copiedId === link.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'ads' && (
        <div className="rounded-xl bg-white shadow-sm overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-medium text-slate-500">
                <th scope="col" className="px-6 py-3.5">Campaign</th>
                <th scope="col" className="px-6 py-3.5 text-right">Spend</th>
                <th scope="col" className="px-6 py-3.5 text-right">Reach</th>
                <th scope="col" className="px-6 py-3.5 text-right">CPC</th>
                <th scope="col" className="px-6 py-3.5 text-right">ROAS</th>
                <th scope="col" className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {brand.ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-slate-50/80">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{ad.campaign}</p>
                    <p className="text-xs text-slate-500">{ad.channel}</p>
                  </td>
                  <td className={cn(jetbrainsMono.className, 'px-6 py-4 text-right tabular-nums text-slate-900')}>
                    {ad.spend}
                  </td>
                  <td className={cn(jetbrainsMono.className, 'px-6 py-4 text-right tabular-nums text-slate-700')}>
                    {ad.reach}
                  </td>
                  <td className={cn(jetbrainsMono.className, 'px-6 py-4 text-right tabular-nums text-slate-700')}>
                    {ad.cpc}
                  </td>
                  <td className={cn(jetbrainsMono.className, 'px-6 py-4 text-right tabular-nums font-medium text-emerald-600')}>
                    {ad.roas}
                  </td>
                  <td
                    className={cn(
                      'px-6 py-4 text-right text-xs font-medium whitespace-nowrap',
                      ad.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'
                    )}
                  >
                    {ad.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
