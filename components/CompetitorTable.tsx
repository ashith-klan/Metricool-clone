'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Search,
  X,
} from 'lucide-react';
import { CompetitorRow } from '@/lib/analytics-data';
import { jetbrainsMono } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export type CompetitorSortKey =
  | 'name'
  | 'followers'
  | 'postsThisWeek'
  | 'engagementRate';
export type CompetitorSortDirection = 'asc' | 'desc';

interface CompetitorTableProps {
  competitors: CompetitorRow[];
  searchQuery?: string;
  onSearchQueryChange?: (value: string) => void;
  sortKey?: CompetitorSortKey;
  sortDir?: CompetitorSortDirection;
  onSortChange?: (key: CompetitorSortKey, dir: CompetitorSortDirection) => void;
}

export default function CompetitorTable({
  competitors,
  searchQuery: controlledSearch,
  onSearchQueryChange,
  sortKey: controlledSortKey,
  sortDir: controlledSortDir,
  onSortChange,
}: CompetitorTableProps) {
  const [internalSearch, setInternalSearch] = useState('');
  const [internalSortKey, setInternalSortKey] =
    useState<CompetitorSortKey>('followers');
  const [internalSortDir, setInternalSortDir] =
    useState<CompetitorSortDirection>('desc');

  const searchQuery = controlledSearch ?? internalSearch;
  const sortKey = controlledSortKey ?? internalSortKey;
  const sortDir = controlledSortDir ?? internalSortDir;

  const setSearchQuery = (val: string) => {
    if (onSearchQueryChange) {
      onSearchQueryChange(val);
    } else {
      setInternalSearch(val);
    }
  };

  const handleSort = (key: CompetitorSortKey) => {
    const nextDir: CompetitorSortDirection =
      sortKey === key
        ? sortDir === 'asc'
          ? 'desc'
          : 'asc'
        : key === 'name'
        ? 'asc'
        : 'desc';

    if (onSortChange) {
      onSortChange(key, nextDir);
    } else {
      setInternalSortKey(key);
      setInternalSortDir(nextDir);
    }
  };

  const filteredAndSorted = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? competitors.filter(
          (row) =>
            row.name.toLowerCase().includes(query) ||
            row.handle.toLowerCase().includes(query) ||
            row.primaryChannel.toLowerCase().includes(query)
        )
      : competitors;

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = a[sortKey] - b[sortKey];
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [competitors, searchQuery, sortKey, sortDir]);

  const renderSortIcon = (key: CompetitorSortKey) => {
    if (sortKey !== key) {
      return (
        <ArrowUpDown
          className="h-3.5 w-3.5 text-slate-300 shrink-0"
          aria-hidden="true"
        />
      );
    }
    return sortDir === 'asc' ? (
      <ArrowUp
        className="h-3.5 w-3.5 text-indigo-600 shrink-0"
        aria-hidden="true"
      />
    ) : (
      <ArrowDown
        className="h-3.5 w-3.5 text-indigo-600 shrink-0"
        aria-hidden="true"
      />
    );
  };

  return (
    <section
      aria-labelledby="competitor-benchmarking-heading"
      className="rounded-xl bg-white shadow-sm overflow-hidden"
    >
      <div className="flex flex-col gap-4 px-6 py-5 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="competitor-benchmarking-heading"
            className="text-base font-semibold text-slate-900"
          >
            Competitor Benchmarking
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Audience size, weekly publishing cadence, and engagement rate across tracked peers
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter competitors..."
            aria-label="Filter competitors"
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-900">
            No competitors match &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Adjust your filter query to view tracked competitor benchmarks.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-4 inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            Clear filter
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-medium text-slate-500">
                <th scope="col" className="px-6 py-3.5">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
                  >
                    <span>Competitor Name</span>
                    {renderSortIcon('name')}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('followers')}
                    className="inline-flex items-center justify-end gap-1.5 font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
                  >
                    <span>Followers</span>
                    {renderSortIcon('followers')}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('postsThisWeek')}
                    className="inline-flex items-center justify-end gap-1.5 font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
                  >
                    <span>Posts this week</span>
                    {renderSortIcon('postsThisWeek')}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('engagementRate')}
                    className="inline-flex items-center justify-end gap-1.5 font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
                  >
                    <span>Engagement Rate</span>
                    {renderSortIcon('engagementRate')}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAndSorted.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'transition-colors duration-150',
                    row.isOwnBrand
                      ? 'bg-indigo-50/40 hover:bg-indigo-50/60'
                      : 'hover:bg-slate-50/80'
                  )}
                >
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          'font-medium',
                          row.isOwnBrand ? 'text-indigo-950' : 'text-slate-900'
                        )}
                      >
                        {row.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {row.handle}
                        <span className="mx-1.5 text-slate-300" aria-hidden="true">
                          ·
                        </span>
                        {row.primaryChannel}
                      </span>
                    </div>
                  </td>
                  <td
                    className={cn(
                      jetbrainsMono.className,
                      'px-6 py-3.5 text-right text-slate-900 tabular-nums whitespace-nowrap'
                    )}
                  >
                    {row.followers.toLocaleString()}
                  </td>
                  <td
                    className={cn(
                      jetbrainsMono.className,
                      'px-6 py-3.5 text-right text-slate-700 tabular-nums whitespace-nowrap'
                    )}
                  >
                    {row.postsThisWeek}
                  </td>
                  <td
                    className={cn(
                      jetbrainsMono.className,
                      'px-6 py-3.5 text-right font-medium tabular-nums whitespace-nowrap',
                      row.engagementRate >= 5
                        ? 'text-emerald-600'
                        : 'text-slate-900'
                    )}
                  >
                    {row.engagementRate.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
