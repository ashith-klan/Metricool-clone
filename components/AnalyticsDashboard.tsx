'use client';

import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CalendarDays, Check, Layers } from 'lucide-react';
import {
  AnalyticsChannelFilter,
  BRAND_WORKSPACES,
  DATE_RANGE_OPTIONS,
  DateRangeId,
  NavSectionId,
  PlannerPost,
  SOCIAL_PLATFORMS,
  getChannelAnalyticsMetrics,
} from '@/lib/analytics-data';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import KpiOverview from './KpiOverview';
import ReachChartCard from './ReachChartCard';
import CompetitorTable, {
  CompetitorSortDirection,
  CompetitorSortKey,
} from './CompetitorTable';
import WorkspaceSections from './WorkspaceSections';
import UpcomingPostsCard from './UpcomingPostsCard';
import PostComposerDrawer from './PostComposerDrawer';
import SocialPlatformLogo from './SocialPlatformLogo';
import { downloadAnalyticsReportCsv } from '@/lib/csv-export';
import {
  saveBrandPostsToStorage,
  useBrandPlannerPosts,
} from '@/lib/planner-store';
import { cn } from '@/lib/utils';

export default function AnalyticsDashboard() {
  const [selectedBrandId, setSelectedBrandId] = useState<string>(
    BRAND_WORKSPACES[0].id
  );
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeId>('30d');
  const [selectedChannel, setSelectedChannel] =
    useState<AnalyticsChannelFilter>('all');
  const [activeSection, setActiveSection] = useState<NavSectionId>('analytics');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [competitorSearch, setCompetitorSearch] = useState('');
  const [competitorSortKey, setCompetitorSortKey] =
    useState<CompetitorSortKey>('followers');
  const [competitorSortDir, setCompetitorSortDir] =
    useState<CompetitorSortDirection>('desc');
  const [mainComposerOpen, setMainComposerOpen] = useState(false);
  const [mainEditingPost, setMainEditingPost] = useState<PlannerPost | null>(
    null
  );
  const [scheduleFeedback, setScheduleFeedback] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();

  const selectedBrand = useMemo(
    () =>
      BRAND_WORKSPACES.find((b) => b.id === selectedBrandId) ??
      BRAND_WORKSPACES[0],
    [selectedBrandId]
  );

  const brandPlannerPosts = useBrandPlannerPosts(selectedBrand);

  const dateRangeOption = useMemo(
    () =>
      DATE_RANGE_OPTIONS.find((d) => d.id === selectedDateRange) ??
      DATE_RANGE_OPTIONS[1],
    [selectedDateRange]
  );

  const activeChannelLabel = useMemo(() => {
    if (selectedChannel === 'all') return 'All Channels';
    return (
      SOCIAL_PLATFORMS.find((p) => p.id === selectedChannel)?.label ??
      'All Channels'
    );
  }, [selectedChannel]);

  const currentMetrics = useMemo(
    () =>
      getChannelAnalyticsMetrics(
        selectedBrand,
        selectedDateRange,
        selectedChannel
      ),
    [selectedBrand, selectedDateRange, selectedChannel]
  );

  const visibleCompetitors = useMemo(() => {
    const query = competitorSearch.trim().toLowerCase();
    const filtered = query
      ? currentMetrics.competitors.filter(
          (row) =>
            row.name.toLowerCase().includes(query) ||
            row.handle.toLowerCase().includes(query) ||
            row.primaryChannel.toLowerCase().includes(query)
        )
      : currentMetrics.competitors;

    return [...filtered].sort((a, b) => {
      const comparison =
        competitorSortKey === 'name'
          ? a.name.localeCompare(b.name)
          : a[competitorSortKey] - b[competitorSortKey];
      return competitorSortDir === 'asc' ? comparison : -comparison;
    });
  }, [
    currentMetrics.competitors,
    competitorSearch,
    competitorSortKey,
    competitorSortDir,
  ]);

  const handleExportReport = () => {
    downloadAnalyticsReportCsv({
      brand: selectedBrand,
      dateRange: dateRangeOption,
      channelId: selectedChannel,
      channelLabel: activeChannelLabel,
      kpis: currentMetrics.kpis,
      reachSeries: currentMetrics.reachSeries,
      competitors: visibleCompetitors,
      competitorFilterQuery: competitorSearch,
    });

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2200);
  };

  const handleSaveMainScheduledPost = (
    savedPost: PlannerPost,
    isEdit: boolean
  ) => {
    const updatedPosts = isEdit
      ? brandPlannerPosts.map((p) => (p.id === savedPost.id ? savedPost : p))
      : [savedPost, ...brandPlannerPosts];
    saveBrandPostsToStorage(selectedBrand.id, updatedPosts);
    setMainComposerOpen(false);
    setScheduleFeedback(
      isEdit
        ? 'Post updated'
        : savedPost.status === 'Draft'
        ? 'Saved to drafts'
        : 'Post scheduled'
    );
    setTimeout(() => setScheduleFeedback(null), 2600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        brands={BRAND_WORKSPACES}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrandId}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-64 flex min-h-screen flex-col">
        <TopBar
          brandName={selectedBrand.name}
          activeSection={activeSection}
          selectedDateRange={selectedDateRange}
          onSelectDateRange={setSelectedDateRange}
          onExportReport={handleExportReport}
          exportSuccess={exportSuccess}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1280px]">
            <motion.div
              key={`${activeSection}-${selectedBrand.id}-${selectedDateRange}-${selectedChannel}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeSection === 'analytics' ? (
                <div className="space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                        Performance Overview
                      </h2>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {selectedBrand.name} ({selectedBrand.handle}) ·{' '}
                        {activeChannelLabel} · {dateRangeOption.label}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {scheduleFeedback && (
                        <div
                          role="status"
                          aria-live="polite"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700"
                        >
                          <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>{scheduleFeedback}</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setMainEditingPost(null);
                          setMainComposerOpen(true);
                        }}
                        className="inline-flex h-9 items-center gap-2 self-start sm:self-auto rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                      >
                        <CalendarDays className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                        <span>Schedule Post</span>
                      </button>
                    </div>
                  </div>

                  {/* Channel-Wise Segmented Toggle Bar */}
                  <div className="flex items-center justify-between gap-4">
                    <div
                      role="tablist"
                      aria-label="Filter analytics by social channel"
                      className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-xl bg-white p-1.5 shadow-sm"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={selectedChannel === 'all'}
                        onClick={() => setSelectedChannel('all')}
                        className={cn(
                          'inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
                          selectedChannel === 'all'
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        )}
                      >
                        <Layers
                          className={cn(
                            'h-3.5 w-3.5 shrink-0',
                            selectedChannel === 'all'
                              ? 'text-indigo-600'
                              : 'text-slate-400'
                          )}
                          aria-hidden="true"
                        />
                        <span>All Channels</span>
                      </button>

                      {SOCIAL_PLATFORMS.map((platform) => {
                        const isActive = selectedChannel === platform.id;
                        return (
                          <button
                            key={platform.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setSelectedChannel(platform.id)}
                            className={cn(
                              'inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
                              isActive
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            )}
                          >
                            <SocialPlatformLogo
                              platform={platform.id}
                              className="h-3.5 w-3.5"
                            />
                            <span>{platform.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <KpiOverview
                    kpis={currentMetrics.kpis}
                    comparisonLabel={dateRangeOption.comparisonLabel}
                  />

                  <ReachChartCard
                    series={currentMetrics.reachSeries}
                    dateRangeLabel={dateRangeOption.label}
                    channelLabel={activeChannelLabel}
                  />

                  <CompetitorTable
                    competitors={currentMetrics.competitors}
                    searchQuery={competitorSearch}
                    onSearchQueryChange={setCompetitorSearch}
                    sortKey={competitorSortKey}
                    sortDir={competitorSortDir}
                    onSortChange={(key, dir) => {
                      setCompetitorSortKey(key);
                      setCompetitorSortDir(dir);
                    }}
                  />

                  <UpcomingPostsCard
                    posts={brandPlannerPosts}
                    selectedChannel={selectedChannel}
                    onScheduleNew={() => {
                      setMainEditingPost(null);
                      setMainComposerOpen(true);
                    }}
                    onEditPost={(post) => {
                      setMainEditingPost(post);
                      setMainComposerOpen(true);
                    }}
                    onOpenPlanner={() => setActiveSection('planner')}
                  />
                </div>
              ) : (
                <WorkspaceSections
                  section={activeSection}
                  brand={selectedBrand}
                  onReturnToAnalytics={() => setActiveSection('analytics')}
                />
              )}
            </motion.div>
          </div>
        </main>
      </div>

      <PostComposerDrawer
        open={mainComposerOpen}
        brand={selectedBrand}
        editingPost={mainEditingPost}
        onClose={() => setMainComposerOpen(false)}
        onSave={handleSaveMainScheduledPost}
      />
    </div>
  );
}
