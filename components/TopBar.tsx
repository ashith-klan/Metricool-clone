'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Check, ChevronDown, Download, Menu } from 'lucide-react';
import {
  DATE_RANGE_OPTIONS,
  DateRangeId,
  NavSectionId,
} from '@/lib/analytics-data';
import { cn } from '@/lib/utils';

interface TopBarProps {
  brandName: string;
  activeSection: NavSectionId;
  selectedDateRange: DateRangeId;
  onSelectDateRange: (range: DateRangeId) => void;
  onExportReport: () => void;
  exportSuccess: boolean;
  onOpenMobileMenu: () => void;
}

const SECTION_LABELS: Record<NavSectionId, string> = {
  planner: 'Planner',
  analytics: 'Analytics',
  inbox: 'Inbox',
  flows: 'Flows',
  smartlinks: 'Smartlinks',
  ads: 'Ads',
};

export default function TopBar({
  brandName,
  activeSection,
  selectedDateRange,
  onSelectDateRange,
  onExportReport,
  exportSuccess,
  onOpenMobileMenu,
}: TopBarProps) {
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  const currentRange =
    DATE_RANGE_OPTIONS.find((opt) => opt.id === selectedDateRange) ??
    DATE_RANGE_OPTIONS[1];

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setDateMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDateMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Menu Trigger + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 min-w-0 text-sm">
            <span className="hidden sm:inline truncate font-medium text-slate-500">
              {brandName}
            </span>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">
              /
            </span>
            <h1 className="truncate font-semibold text-slate-900 text-base sm:text-sm">
              {SECTION_LABELS[activeSection]}
            </h1>
          </div>
        </div>

        {/* Right: Date Range Picker & Export Report */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative" ref={dateDropdownRef}>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={dateMenuOpen}
              onClick={() => setDateMenuOpen((prev) => !prev)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-3 sm:px-3.5 text-sm font-medium text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{currentRange.label}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-slate-400 shrink-0 transition-transform duration-150',
                  dateMenuOpen && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>

            {dateMenuOpen && (
              <div
                role="listbox"
                aria-label="Select date range"
                className="absolute right-0 z-30 mt-1.5 w-48 rounded-xl bg-white p-1.5 shadow-lg border border-slate-200/90"
              >
                {DATE_RANGE_OPTIONS.map((option) => {
                  const isSelected = option.id === selectedDateRange;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onSelectDateRange(option.id);
                        setDateMenuOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-indigo-600 shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onExportReport}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-lg px-3.5 sm:px-4 text-sm font-medium shadow-sm transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2',
              exportSuccess
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            )}
          >
            {exportSuccess ? (
              <>
                <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Report Exported</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Export Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
