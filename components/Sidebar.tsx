'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronsUpDown,
  Inbox,
  Link2,
  Megaphone,
  Workflow,
  X,
} from 'lucide-react';
import { BrandWorkspace, NavSectionId } from '@/lib/analytics-data';
import { cn } from '@/lib/utils';

interface SidebarProps {
  brands: BrandWorkspace[];
  selectedBrand: BrandWorkspace;
  onSelectBrand: (brandId: string) => void;
  activeSection: NavSectionId;
  onSelectSection: (section: NavSectionId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: {
  id: NavSectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'planner', label: 'Planner', icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'flows', label: 'Flows', icon: Workflow },
  { id: 'smartlinks', label: 'Smartlinks', icon: Link2 },
  { id: 'ads', label: 'Ads', icon: Megaphone },
];

export default function Sidebar({
  brands,
  selectedBrand,
  onSelectBrand,
  activeSection,
  onSelectSection,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setBrandMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setBrandMenuOpen(false);
        onCloseMobile();
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseMobile]);

  const unreadInboxCount = selectedBrand.inbox.filter((m) => m.unread).length;

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-slate-200/80">
      {/* Brand Mark */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            MetricBoard
          </span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          aria-label="Close navigation menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Brand Selector Dropdown */}
      <div className="px-4 pb-5 border-b border-slate-100" ref={dropdownRef}>
        <label
          id="brand-selector-label"
          className="block px-1 pb-1.5 text-xs font-medium text-slate-500"
        >
          Brand workspace
        </label>
        <div className="relative">
          <button
            type="button"
            aria-labelledby="brand-selector-label"
            aria-haspopup="listbox"
            aria-expanded={brandMenuOpen}
            onClick={() => setBrandMenuOpen((prev) => !prev)}
            className="flex w-full items-center justify-between gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-left border border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/70 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tracking-tight',
                  selectedBrand.accentBg,
                  selectedBrand.accentText
                )}
              >
                {selectedBrand.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {selectedBrand.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {selectedBrand.handle}
                </p>
              </div>
            </div>
            <ChevronsUpDown
              className="h-4 w-4 shrink-0 text-slate-400"
              aria-hidden="true"
            />
          </button>

          {brandMenuOpen && (
            <div
              role="listbox"
              aria-label="Select brand workspace"
              className="absolute left-0 right-0 z-30 mt-1.5 rounded-xl bg-white p-1.5 shadow-lg border border-slate-200/90"
            >
              {brands.map((brand) => {
                const isSelected = brand.id === selectedBrand.id;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelectBrand(brand.id);
                      setBrandMenuOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
                      isSelected
                        ? 'bg-indigo-50/80 text-indigo-950'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold',
                          brand.accentBg,
                          brand.accentText
                        )}
                      >
                        {brand.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {brand.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {brand.industry}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check
                        className="h-4 w-4 shrink-0 text-indigo-600"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Primary Navigation */}
      <nav
        aria-label="Dashboard sections"
        className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectSection(item.id);
                onCloseMobile();
              }}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.label}</span>
              </span>
              {item.id === 'inbox' && unreadInboxCount > 0 && (
                <span className="text-xs font-medium text-indigo-600 tabular-nums">
                  {unreadInboxCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Workspace Footer */}
      <div className="border-t border-slate-100 px-5 py-4">
        <p className="truncate text-xs font-medium text-slate-700">
          {selectedBrand.name}
        </p>
        <p className="truncate text-xs text-slate-400">
          {selectedBrand.industry} · 4 channels
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Sidebar navigation"
        >
          <div
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw]">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
