'use client';

import React from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Edit3,
  Plus,
} from 'lucide-react';
import SocialPlatformLogo from './SocialPlatformLogo';
import {
  AnalyticsChannelFilter,
  PlannerPost,
  SOCIAL_PLATFORMS,
} from '@/lib/analytics-data';
import { formatPlannerDisplayDate } from '@/lib/planner-store';
import { jetbrainsMono } from '@/lib/fonts';
import { cn } from '@/lib/utils';

interface UpcomingPostsCardProps {
  posts: PlannerPost[];
  selectedChannel?: AnalyticsChannelFilter;
  onScheduleNew: () => void;
  onEditPost: (post: PlannerPost) => void;
  onOpenPlanner: () => void;
}

export default function UpcomingPostsCard({
  posts,
  selectedChannel = 'all',
  onScheduleNew,
  onEditPost,
  onOpenPlanner,
}: UpcomingPostsCardProps) {
  const activeChannelMeta =
    selectedChannel !== 'all'
      ? SOCIAL_PLATFORMS.find((p) => p.id === selectedChannel)
      : undefined;

  const upcoming = [...posts]
    .filter((p) => p.status !== 'Published')
    .filter(
      (p) =>
        selectedChannel === 'all' || p.platforms.includes(selectedChannel)
    )
    .sort((a, b) =>
      `${a.scheduledDate}T${a.scheduledTime}`.localeCompare(
        `${b.scheduledDate}T${b.scheduledTime}`
      )
    )
    .slice(0, 4);

  return (
    <section
      aria-labelledby="upcoming-scheduled-posts-heading"
      className="rounded-xl bg-white shadow-sm overflow-hidden"
    >
      <div className="flex flex-col gap-3 px-6 py-5 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="upcoming-scheduled-posts-heading"
            className="text-base font-semibold text-slate-900"
          >
            Scheduled Posts
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {activeChannelMeta
              ? `Upcoming posts scheduled for ${activeChannelMeta.label}`
              : 'Upcoming multi-channel queue across Instagram, Facebook, LinkedIn, Twitter, and Threads'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenPlanner}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            <span>Open Planner</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onScheduleNew}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {upcoming.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <CalendarDays
            className="mx-auto h-6 w-6 text-slate-300"
            aria-hidden="true"
          />
          <p className="mt-2 text-sm font-medium text-slate-900">
            No upcoming posts scheduled
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Create a post and schedule it across your connected channels.
          </p>
          <button
            type="button"
            onClick={onScheduleNew}
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Schedule Post</span>
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {upcoming.map((post) => {
            const hasCustomCaptions = Boolean(
              post.channelCaptions &&
                Object.keys(post.channelCaptions).length > 1
            );
            return (
              <div
                key={post.id}
                className="flex flex-col gap-3 px-6 py-4 transition-colors duration-150 hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="sm:w-44 shrink-0">
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

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-700">
                    {post.platforms.map((pid) => {
                      const meta = SOCIAL_PLATFORMS.find((p) => p.id === pid);
                      return (
                        <span
                          key={pid}
                          className="inline-flex items-center gap-1.5"
                        >
                          <SocialPlatformLogo
                            platform={pid}
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
                  <p className="text-sm text-slate-800 line-clamp-1">
                    {post.caption}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap',
                      post.status === 'Scheduled'
                        ? 'text-indigo-600'
                        : post.status === 'Published'
                        ? 'text-emerald-600'
                        : 'text-slate-500'
                    )}
                  >
                    {post.status === 'Scheduled' ? (
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : post.status === 'Published' ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span>{post.status}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onEditPost(post)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap"
                  >
                    <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
