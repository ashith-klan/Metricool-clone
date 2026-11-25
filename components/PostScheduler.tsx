'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Image as ImageIcon,
  List,
  MessageSquarePlus,
  Plus,
  Send,
  Trash2,
} from 'lucide-react';
import SocialPlatformLogo from './SocialPlatformLogo';
import PostComposerDrawer from './PostComposerDrawer';
import {
  BrandWorkspace,
  PlannerPost,
  SOCIAL_PLATFORMS,
  SocialPlatform,
} from '@/lib/analytics-data';
import {
  formatPlannerDisplayDate,
  saveBrandPostsToStorage,
  useBrandPlannerPosts,
} from '@/lib/planner-store';
import { jetbrainsMono } from '@/lib/fonts';
import { cn } from '@/lib/utils';

interface PostSchedulerProps {
  brand: BrandWorkspace;
  onReturnToAnalytics?: () => void;
}

const TODAY_STR = '2026-11-25';

function getWeekDates(anchorDateStr: string): {
  dates: string[];
  label: string;
} {
  const [y, m, d] = anchorDateStr.split('-').map(Number);
  const base = new Date(Date.UTC(y || 2026, (m || 11) - 1, d || 25));
  const day = base.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(base);
  monday.setUTCDate(base.getUTCDate() + diffToMonday);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setUTCDate(monday.getUTCDate() + i);
    dates.push(current.toISOString().slice(0, 10));
  }

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  const startLabel = monday.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
  const endLabel = sunday.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return { dates, label: `${startLabel} – ${endLabel}` };
}

function shiftDateString(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y || 2026, (m || 11) - 1, d || 25));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export default function PostScheduler({
  brand,
  onReturnToAnalytics,
}: PostSchedulerProps) {
  const posts = useBrandPlannerPosts(brand);

  const [viewMode, setViewMode] = useState<'calendar' | 'queue'>('calendar');
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Scheduled' | 'Draft' | 'Published'
  >('All');
  const [platformFilter, setPlatformFilter] = useState<'all' | SocialPlatform>(
    'all'
  );
  const [weekAnchor, setWeekAnchor] = useState(TODAY_STR);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const [composerOpen, setComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PlannerPost | null>(null);
  const [presetDate, setPresetDate] = useState<string | undefined>(undefined);

  const counts = useMemo(() => {
    return {
      scheduled: posts.filter((p) => p.status === 'Scheduled').length,
      draft: posts.filter((p) => p.status === 'Draft').length,
      published: posts.filter((p) => p.status === 'Published').length,
    };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return [...posts]
      .filter((p) => statusFilter === 'All' || p.status === statusFilter)
      .filter(
        (p) =>
          platformFilter === 'all' || p.platforms.includes(platformFilter)
      )
      .sort((a, b) => {
        const aKey = `${a.scheduledDate}T${a.scheduledTime}`;
        const bKey = `${b.scheduledDate}T${b.scheduledTime}`;
        return aKey.localeCompare(bKey);
      });
  }, [posts, statusFilter, platformFilter]);

  const weekInfo = useMemo(() => getWeekDates(weekAnchor), [weekAnchor]);

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 2600);
  };

  const openNewPostDrawer = (date?: string) => {
    setEditingPost(null);
    setPresetDate(date);
    setComposerOpen(true);
  };

  const openEditPostDrawer = (post: PlannerPost) => {
    setEditingPost(post);
    setPresetDate(undefined);
    setComposerOpen(true);
  };

  const handleSaveFromDrawer = (savedPost: PlannerPost, isEdit: boolean) => {
    const updatedPosts = isEdit
      ? posts.map((p) => (p.id === savedPost.id ? savedPost : p))
      : [savedPost, ...posts];

    saveBrandPostsToStorage(brand.id, updatedPosts);
    setComposerOpen(false);
    showToast(
      isEdit
        ? 'Post updated'
        : savedPost.status === 'Draft'
        ? 'Saved to drafts'
        : 'Post scheduled'
    );
  };

  const handlePublishNow = (postId: string) => {
    const updated = posts.map((p) =>
      p.id === postId ? { ...p, status: 'Published' as const } : p
    );
    saveBrandPostsToStorage(brand.id, updated);
    showToast('Post marked as published');
  };

  const handleDeletePost = (postId: string) => {
    const updated = posts.filter((p) => p.id !== postId);
    saveBrandPostsToStorage(brand.id, updated);
    if (editingPost?.id === postId) {
      setComposerOpen(false);
    }
    showToast('Post removed');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Content Planner
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            <span>
              {brand.name} ({brand.handle})
            </span>
            <span className="mx-2 text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="tabular-nums">{counts.scheduled} scheduled</span>
            <span className="mx-1.5 text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="tabular-nums">{counts.draft} drafts</span>
            <span className="mx-1.5 text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="tabular-nums">{counts.published} published</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {feedbackMessage && (
            <div
              role="status"
              aria-live="polite"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 mr-1"
            >
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {onReturnToAnalytics && (
            <button
              type="button"
              onClick={onReturnToAnalytics}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <ArrowLeft className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span>Back to Analytics</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => openNewPostDrawer()}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Main Full-Width Planner Surface */}
      <section
        aria-labelledby="planner-workspace-heading"
        className="rounded-xl bg-white shadow-sm overflow-hidden"
      >
        <h3 id="planner-workspace-heading" className="sr-only">
          Publishing Calendar and Queue
        </h3>

        {/* Single-Row Toolbar */}
        <div className="flex flex-col gap-3 px-6 py-4 border-b border-slate-100 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex items-center gap-1 rounded-lg bg-slate-100 p-1"
              role="group"
              aria-label="Planner view mode"
            >
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap',
                  viewMode === 'calendar'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Calendar</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('queue')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap',
                  viewMode === 'queue'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <List className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Queue</span>
              </button>
            </div>

            {viewMode === 'calendar' && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setWeekAnchor((prev) => shiftDateString(prev, -7))
                  }
                  aria-label="Previous week"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span
                  className={cn(
                    jetbrainsMono.className,
                    'px-2 text-xs font-semibold text-slate-700 tabular-nums whitespace-nowrap'
                  )}
                >
                  {weekInfo.label}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setWeekAnchor((prev) => shiftDateString(prev, 7))
                  }
                  aria-label="Next week"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              {(['All', 'Scheduled', 'Draft', 'Published'] as const).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap',
                      statusFilter === status
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            <div>
              <label htmlFor="planner-platform-filter" className="sr-only">
                Filter by channel
              </label>
              <select
                id="planner-platform-filter"
                value={platformFilter}
                onChange={(e) =>
                  setPlatformFilter(e.target.value as 'all' | SocialPlatform)
                }
                className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              >
                <option value="all">All channels</option>
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Content */}
        {viewMode === 'calendar' ? (
          <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-7 md:divide-y-0 md:divide-x">
            {weekInfo.dates.map((dateStr) => {
              const [y, m, d] = dateStr.split('-').map(Number);
              const dt = new Date(Date.UTC(y, m - 1, d));
              const dayName = dt.toLocaleDateString('en-US', {
                weekday: 'short',
                timeZone: 'UTC',
              });
              const dayPosts = filteredPosts.filter(
                (p) => p.scheduledDate === dateStr
              );
              const isToday = dateStr === TODAY_STR;

              return (
                <div
                  key={dateStr}
                  className={cn(
                    'flex flex-col min-h-[240px] md:min-h-[420px] p-3 transition-colors',
                    isToday ? 'bg-indigo-50/25' : 'bg-white'
                  )}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-medium text-slate-500">
                        {dayName}
                      </span>
                      <span
                        className={cn(
                          jetbrainsMono.className,
                          'text-sm font-semibold tabular-nums',
                          isToday ? 'text-indigo-600' : 'text-slate-900'
                        )}
                      >
                        {d}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openNewPostDrawer(dateStr)}
                      aria-label={`Schedule post on ${formatPlannerDisplayDate(dateStr)}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-2.5">
                    {dayPosts.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => openNewPostDrawer(dateStr)}
                        className="group flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-slate-200/80 text-xs text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-colors"
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          + Add post
                        </span>
                      </button>
                    ) : (
                      dayPosts.map((post) => (
                        <div
                          key={post.id}
                          className="group rounded-lg border border-slate-200/90 bg-white p-3 shadow-sm hover:border-indigo-300 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                jetbrainsMono.className,
                                'text-xs font-semibold text-slate-800 tabular-nums'
                              )}
                            >
                              {post.scheduledTime}
                            </span>
                            <div className="flex items-center gap-1">
                              {post.platforms.map((pid) => (
                                <SocialPlatformLogo
                                  key={pid}
                                  platform={pid}
                                  className="h-3.5 w-3.5"
                                />
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => openEditPostDrawer(post)}
                            className="mt-2 block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded"
                          >
                            <p className="text-xs leading-relaxed text-slate-600 line-clamp-3 group-hover:text-slate-900">
                              {post.caption}
                            </p>
                          </button>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                'text-[11px] font-medium',
                                post.status === 'Published'
                                  ? 'text-emerald-600'
                                  : post.status === 'Scheduled'
                                  ? 'text-indigo-600'
                                  : 'text-slate-500'
                              )}
                            >
                              {post.status}
                            </span>

                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => openEditPostDrawer(post)}
                                aria-label="Edit post"
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePost(post.id)}
                                aria-label="Delete post"
                                className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPosts.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <CalendarDays
                  className="mx-auto h-7 w-7 text-slate-300"
                  aria-hidden="true"
                />
                <p className="mt-3 text-sm font-medium text-slate-900">
                  No posts match the current filters
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Reset your filters or schedule a new post for {brand.name}.
                </p>
                <div className="mt-5 flex items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('All');
                      setPlatformFilter('all');
                    }}
                    className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Reset filters
                  </button>
                  <button
                    type="button"
                    onClick={() => openNewPostDrawer()}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Schedule Post</span>
                  </button>
                </div>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const hasCustomCaptions = Boolean(
                  post.channelCaptions &&
                    Object.keys(post.channelCaptions).length > 1
                );
                return (
                  <div
                    key={post.id}
                    className="flex flex-col gap-4 px-6 py-5 transition-colors duration-150 hover:bg-slate-50/70 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="md:w-44 shrink-0">
                      <p
                        className={cn(
                          jetbrainsMono.className,
                          'text-sm font-semibold text-slate-900 tabular-nums'
                        )}
                      >
                        {formatPlannerDisplayDate(post.scheduledDate)}
                      </p>
                      <p
                        className={cn(
                          jetbrainsMono.className,
                          'mt-0.5 text-xs text-slate-500 tabular-nums'
                        )}
                      >
                        {post.scheduledTime} · {post.format}
                      </p>
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-700">
                        {post.platforms.map((platformId) => {
                          const meta = SOCIAL_PLATFORMS.find(
                            (p) => p.id === platformId
                          );
                          return (
                            <span
                              key={platformId}
                              className="inline-flex items-center gap-1.5"
                            >
                              <SocialPlatformLogo
                                platform={platformId}
                                className="h-3.5 w-3.5"
                              />
                              <span>{meta?.label}</span>
                            </span>
                          );
                        })}
                        {hasCustomCaptions && (
                          <>
                            <span className="text-slate-300" aria-hidden="true">
                              ·
                            </span>
                            <span className="text-indigo-600 font-normal">
                              Custom per channel
                            </span>
                          </>
                        )}
                      </div>

                      <p className="text-sm leading-relaxed text-slate-800 line-clamp-2">
                        {post.caption}
                      </p>

                      {(post.mediaName || post.firstComment) && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          {post.mediaName && (
                            <span className="inline-flex items-center gap-1.5">
                              <ImageIcon
                                className="h-3.5 w-3.5 text-slate-400"
                                aria-hidden="true"
                              />
                              <span>{post.mediaName}</span>
                            </span>
                          )}
                          {post.firstComment && (
                            <span className="inline-flex items-center gap-1.5 truncate max-w-md">
                              <MessageSquarePlus
                                className="h-3.5 w-3.5 text-slate-400 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="truncate">
                                {post.firstComment}
                              </span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap',
                          post.status === 'Published'
                            ? 'text-emerald-600'
                            : post.status === 'Scheduled'
                            ? 'text-indigo-600'
                            : 'text-slate-500'
                        )}
                      >
                        {post.status === 'Published' ? (
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : post.status === 'Scheduled' ? (
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        <span>{post.status}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditPostDrawer(post)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Edit</span>
                        </button>

                        {post.status !== 'Published' && (
                          <button
                            type="button"
                            onClick={() => handlePublishNow(post.id)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                          >
                            <Send className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Publish</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          aria-label="Delete post"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>

      <PostComposerDrawer
        open={composerOpen}
        brand={brand}
        editingPost={editingPost}
        presetDate={presetDate}
        onClose={() => setComposerOpen(false)}
        onSave={handleSaveFromDrawer}
      />
    </div>
  );
}
