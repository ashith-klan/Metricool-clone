'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  Clock,
  Eye,
  Hash,
  Image as ImageIcon,
  MessageSquarePlus,
  X,
} from 'lucide-react';
import SocialPlatformLogo from './SocialPlatformLogo';
import {
  BrandWorkspace,
  PlannerPost,
  PostFormat,
  SOCIAL_PLATFORMS,
  SocialPlatform,
} from '@/lib/analytics-data';
import { jetbrainsMono } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export interface PostComposerDrawerProps {
  open: boolean;
  brand: BrandWorkspace;
  editingPost: PlannerPost | null;
  presetDate?: string;
  onClose: () => void;
  onSave: (post: PlannerPost, isEdit: boolean) => void;
}

const DEFAULT_DATE = '2026-11-25';
const FORMAT_OPTIONS: PostFormat[] = ['Post', 'Carousel', 'Reel', 'Link'];

const BRAND_HASHTAGS: Record<string, string> = {
  'studio-nord':
    '#ScandinavianDesign #InteriorArchitecture #MinimalLiving #Craftsmanship',
  'veloce-roasters':
    '#SpecialtyCoffee #PourOver #SingleOrigin #CoffeeRoasters',
  'lumen-botanicals':
    '#CleanSkincare #BarrierRepair #BotanicalSkincare #SkinHealth',
};

export default function PostComposerDrawer({
  open,
  brand,
  editingPost,
  presetDate,
  onClose,
  onSave,
}: PostComposerDrawerProps) {
  if (!open) return null;

  return (
    <PostComposerDrawerContent
      key={`${brand.id}-${editingPost?.id ?? 'new'}-${presetDate ?? ''}`}
      brand={brand}
      editingPost={editingPost}
      presetDate={presetDate}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function PostComposerDrawerContent({
  brand,
  editingPost,
  presetDate,
  onClose,
  onSave,
}: Omit<PostComposerDrawerProps, 'open'>) {
  const initialPlatforms: SocialPlatform[] = editingPost?.platforms.length
    ? editingPost.platforms
    : ['instagram', 'linkedin'];

  const hasInitialCustomCaptions = Boolean(
    editingPost?.channelCaptions &&
      Object.keys(editingPost.channelCaptions).length > 0
  );

  const [selectedPlatforms, setSelectedPlatforms] =
    useState<SocialPlatform[]>(initialPlatforms);
  const [format, setFormat] = useState<PostFormat>(
    editingPost?.format ?? 'Post'
  );
  const [sharedCaption, setSharedCaption] = useState(
    editingPost?.caption ?? ''
  );
  const [customizePerChannel, setCustomizePerChannel] = useState(
    hasInitialCustomCaptions
  );
  const [channelCaptions, setChannelCaptions] = useState<
    Partial<Record<SocialPlatform, string>>
  >(() => {
    const base: Partial<Record<SocialPlatform, string>> = {};
    for (const p of initialPlatforms) {
      base[p] =
        editingPost?.channelCaptions?.[p] ?? editingPost?.caption ?? '';
    }
    return base;
  });
  const [activeChannelTab, setActiveChannelTab] = useState<SocialPlatform>(
    initialPlatforms[0] ?? 'instagram'
  );
  const [scheduledDate, setScheduledDate] = useState(
    editingPost?.scheduledDate ?? presetDate ?? DEFAULT_DATE
  );
  const [scheduledTime, setScheduledTime] = useState(
    editingPost?.scheduledTime ?? '09:30'
  );
  const [showFirstComment, setShowFirstComment] = useState(
    Boolean(editingPost?.firstComment)
  );
  const [firstComment, setFirstComment] = useState(
    editingPost?.firstComment ?? ''
  );
  const [mediaName, setMediaName] = useState<string | undefined>(
    editingPost?.mediaName
  );
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(
    editingPost?.mediaUrl
  );
  const [showPreview, setShowPreview] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>(
    initialPlatforms[0] ?? 'instagram'
  );
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const currentChannelTab = selectedPlatforms.includes(activeChannelTab)
    ? activeChannelTab
    : selectedPlatforms[0] ?? 'instagram';

  const activePreviewPlatform = selectedPlatforms.includes(previewPlatform)
    ? previewPlatform
    : selectedPlatforms[0] ?? 'instagram';

  const strictestMeta = useMemo(() => {
    if (selectedPlatforms.length === 0) return SOCIAL_PLATFORMS[0];
    return selectedPlatforms
      .map((id) => SOCIAL_PLATFORMS.find((p) => p.id === id)!)
      .reduce((min, curr) => (curr.maxChars < min.maxChars ? curr : min));
  }, [selectedPlatforms]);

  const activeChannelMeta = useMemo(
    () =>
      SOCIAL_PLATFORMS.find((p) => p.id === currentChannelTab) ??
      SOCIAL_PLATFORMS[0],
    [currentChannelTab]
  );

  const displayedCaption = customizePerChannel
    ? channelCaptions[currentChannelTab] ?? ''
    : sharedCaption;

  const displayedLimitMeta = customizePerChannel
    ? activeChannelMeta
    : strictestMeta;

  const isDisplayedOverLimit =
    displayedCaption.length > displayedLimitMeta.maxChars;

  const togglePlatform = (platformId: SocialPlatform) => {
    setFormError(null);
    setSelectedPlatforms((prev) => {
      const exists = prev.includes(platformId);
      const next = exists
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId];

      if (!exists) {
        setChannelCaptions((curr) => ({
          ...curr,
          [platformId]: curr[platformId] ?? sharedCaption,
        }));
      }
      return next;
    });
  };

  const handleToggleCustomizePerChannel = () => {
    setFormError(null);
    setCustomizePerChannel((prev) => {
      const next = !prev;
      if (next) {
        // Pre-fill each selected channel with the shared caption if empty
        setChannelCaptions((curr) => {
          const updated = { ...curr };
          for (const pid of selectedPlatforms) {
            if (!updated[pid] || !updated[pid]?.trim()) {
              updated[pid] = sharedCaption;
            }
          }
          return updated;
        });
      } else {
        // Sync back the active channel's caption to sharedCaption if sharedCaption is empty
        const activeText = channelCaptions[currentChannelTab] ?? '';
        if (!sharedCaption.trim() && activeText.trim()) {
          setSharedCaption(activeText);
        }
      }
      return next;
    });
  };

  const handleCaptionChange = (value: string) => {
    setFormError(null);
    if (customizePerChannel) {
      setChannelCaptions((prev) => ({
        ...prev,
        [currentChannelTab]: value,
      }));
    } else {
      setSharedCaption(value);
    }
  };

  const handleApplyToAllChannels = () => {
    const sourceText = channelCaptions[currentChannelTab] ?? '';
    const updated: Partial<Record<SocialPlatform, string>> = {};
    for (const pid of selectedPlatforms) {
      updated[pid] = sourceText;
    }
    setChannelCaptions((prev) => ({ ...prev, ...updated }));
    setSharedCaption(sourceText);
    setFormError(null);
  };

  const handleInsertHashtags = () => {
    const tags = BRAND_HASHTAGS[brand.id] ?? '#SocialMedia #BrandUpdate';
    const currentText = displayedCaption;
    const nextText = currentText.trim()
      ? `${currentText.trim()}\n\n${tags}`
      : tags;
    handleCaptionChange(nextText);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaName(file.name);
    if (file.type.startsWith('image/')) {
      setMediaUrl(URL.createObjectURL(file));
    } else {
      setMediaUrl(undefined);
    }
  };

  const handleSubmit = (targetStatus: 'Scheduled' | 'Draft') => {
    if (selectedPlatforms.length === 0) {
      setFormError('Select at least one channel to publish.');
      return;
    }

    if (customizePerChannel) {
      for (const pid of selectedPlatforms) {
        const meta = SOCIAL_PLATFORMS.find((p) => p.id === pid)!;
        const text = (channelCaptions[pid] ?? '').trim();
        if (!text) {
          setActiveChannelTab(pid);
          setFormError(`Write copy for ${meta.label} before saving.`);
          return;
        }
        if (targetStatus === 'Scheduled' && text.length > meta.maxChars) {
          setActiveChannelTab(pid);
          setFormError(
            `${meta.label} copy exceeds its ${meta.maxChars.toLocaleString()}-character limit.`
          );
          return;
        }
      }
    } else {
      if (!sharedCaption.trim()) {
        setFormError('Write a caption before saving.');
        return;
      }
      if (targetStatus === 'Scheduled') {
        const over = selectedPlatforms
          .map((id) => SOCIAL_PLATFORMS.find((p) => p.id === id)!)
          .filter((p) => sharedCaption.length > p.maxChars);
        if (over.length > 0) {
          setFormError(
            `Caption exceeds the character limit for ${over
              .map((p) => p.label)
              .join(', ')}. Toggle "Customize per channel" to tailor shorter copy.`
          );
          return;
        }
      }
    }

    if (!scheduledDate || !scheduledTime) {
      setFormError('Choose both a date and time.');
      return;
    }

    const customizedMap: Partial<Record<SocialPlatform, string>> | undefined =
      customizePerChannel
        ? selectedPlatforms.reduce<Partial<Record<SocialPlatform, string>>>(
            (acc, pid) => {
              acc[pid] = (channelCaptions[pid] ?? '').trim();
              return acc;
            },
            {}
          )
        : undefined;

    const primaryCaption = customizePerChannel
      ? (channelCaptions[selectedPlatforms[0]] ?? '').trim()
      : sharedCaption.trim();

    const savedPost: PlannerPost = {
      id: editingPost?.id ?? `post-${Date.now()}`,
      caption: primaryCaption,
      channelCaptions: customizedMap,
      platforms: selectedPlatforms,
      format,
      scheduledDate,
      scheduledTime,
      status: targetStatus,
      firstComment:
        showFirstComment && firstComment.trim()
          ? firstComment.trim()
          : undefined,
      mediaName,
      mediaUrl,
    };

    onSave(savedPost, Boolean(editingPost));
  };

  const previewMeta = SOCIAL_PLATFORMS.find(
    (p) => p.id === activePreviewPlatform
  );
  const previewText = customizePerChannel
    ? (channelCaptions[activePreviewPlatform] ?? '').trim()
    : sharedCaption.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="composer-drawer-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div>
            <h3
              id="composer-drawer-title"
              className="text-base font-semibold text-slate-900"
            >
              {editingPost ? 'Edit Scheduled Post' : 'Schedule New Post'}
            </h3>
            <p className="text-xs text-slate-500">
              {brand.name} · {brand.handle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors whitespace-nowrap',
                showPreview
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              )}
            >
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close post composer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* 1. Target Channels */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-slate-700">
              Publish to channels
            </label>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
              role="group"
              aria-label="Select social media channels"
            >
              {SOCIAL_PLATFORMS.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => togglePlatform(platform.id)}
                    className={cn(
                      'inline-flex h-10 items-center justify-between gap-2 rounded-lg border px-3 text-xs font-medium transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 text-slate-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <SocialPlatformLogo
                        platform={platform.id}
                        className="h-4 w-4"
                      />
                      <span className="truncate">{platform.label}</span>
                    </span>
                    {isSelected && (
                      <Check
                        className="h-3.5 w-3.5 shrink-0 text-indigo-600"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Format & Media */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className="flex items-center gap-1 rounded-lg bg-slate-100 p-1"
              role="group"
              aria-label="Post format"
            >
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFormat(opt)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap',
                    format === opt
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="sr-only"
                id="drawer-media-input"
              />
              <label
                htmlFor="drawer-media-input"
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
              >
                <ImageIcon
                  className="h-3.5 w-3.5 text-slate-400"
                  aria-hidden="true"
                />
                <span>{mediaName ? 'Replace Media' : 'Attach Media'}</span>
              </label>
            </div>
          </div>

          {mediaName && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {mediaUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl}
                    alt={mediaName}
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded object-cover shrink-0 border border-slate-200"
                  />
                ) : (
                  <ImageIcon
                    className="h-4 w-4 text-slate-400 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span className="truncate text-xs font-medium text-slate-700">
                  {mediaName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMediaName(undefined);
                  setMediaUrl(undefined);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                aria-label="Remove attached media"
                className="rounded p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* 3. Post Copy + Customize Per Channel Toggle */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="drawer-post-caption"
                  className="text-xs font-semibold text-slate-700"
                >
                  Post copy
                </label>

                <button
                  type="button"
                  role="switch"
                  aria-checked={customizePerChannel}
                  onClick={handleToggleCustomizePerChannel}
                  className="inline-flex items-center gap-2 rounded-md py-0.5 text-xs font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                  <span
                    className={cn(
                      'relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-150',
                      customizePerChannel ? 'bg-indigo-600' : 'bg-slate-200'
                    )}
                    aria-hidden="true"
                  >
                    <span
                      className={cn(
                        'inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-150',
                        customizePerChannel
                          ? 'translate-x-3.5'
                          : 'translate-x-0.5'
                      )}
                    />
                  </span>
                  <span>Customize per channel</span>
                </button>
              </div>

              <span
                className={cn(
                  jetbrainsMono.className,
                  'text-xs tabular-nums font-medium',
                  isDisplayedOverLimit ? 'text-rose-600' : 'text-slate-500'
                )}
              >
                {displayedCaption.length} /{' '}
                {displayedLimitMeta.maxChars.toLocaleString()}{' '}
                <span className="font-sans text-slate-400 font-normal">
                  ({displayedLimitMeta.label} limit)
                </span>
              </span>
            </div>

            {/* Channel-Specific Caption Tabs */}
            {customizePerChannel && selectedPlatforms.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-2.5"
                role="tablist"
                aria-label="Edit caption per channel"
              >
                {selectedPlatforms.map((pid) => {
                  const meta = SOCIAL_PLATFORMS.find((p) => p.id === pid)!;
                  const isActive = currentChannelTab === pid;
                  const textLen = (channelCaptions[pid] ?? '').length;
                  const isOver = textLen > meta.maxChars;
                  return (
                    <button
                      key={pid}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveChannelTab(pid)}
                      className={cn(
                        'inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
                        isActive
                          ? 'border-indigo-600 bg-indigo-50/50 text-slate-900 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <SocialPlatformLogo platform={pid} className="h-3.5 w-3.5" />
                      <span>{meta.label}</span>
                      {isOver && (
                        <span
                          className={cn(
                            jetbrainsMono.className,
                            'text-[10px] font-semibold text-rose-600 tabular-nums'
                          )}
                        >
                          !
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <textarea
              id="drawer-post-caption"
              rows={5}
              value={displayedCaption}
              onChange={(e) => handleCaptionChange(e.target.value)}
              placeholder={
                customizePerChannel
                  ? `Write a tailored caption for ${activeChannelMeta.label}...`
                  : 'Write your announcement, story, or thread...'
              }
              className="w-full rounded-lg border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInsertHashtags}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap"
                >
                  <Hash
                    className="h-3.5 w-3.5 text-slate-400"
                    aria-hidden="true"
                  />
                  <span>Insert Hashtags</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowFirstComment((prev) => !prev)}
                  className={cn(
                    'inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium whitespace-nowrap',
                    showFirstComment
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <MessageSquarePlus
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  <span>First Comment</span>
                </button>
              </div>

              {customizePerChannel && selectedPlatforms.length > 1 && (
                <button
                  type="button"
                  onClick={handleApplyToAllChannels}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                >
                  Apply to all channels
                </button>
              )}
            </div>

            {showFirstComment && (
              <div className="pt-2">
                <label
                  htmlFor="drawer-first-comment"
                  className="block pb-1 text-xs font-medium text-slate-600"
                >
                  Auto-posted first comment (Instagram / LinkedIn)
                </label>
                <input
                  id="drawer-first-comment"
                  type="text"
                  value={firstComment}
                  onChange={(e) => setFirstComment(e.target.value)}
                  placeholder="Add links or extra hashtags..."
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            )}
          </div>

          {/* 4. Schedule Date & Time */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="drawer-schedule-date"
                  className="block pb-1.5 text-xs font-semibold text-slate-700"
                >
                  Publish date
                </label>
                <input
                  id="drawer-schedule-date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className={cn(
                    jetbrainsMono.className,
                    'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20'
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="drawer-schedule-time"
                  className="block pb-1.5 text-xs font-semibold text-slate-700"
                >
                  Publish time
                </label>
                <input
                  id="drawer-schedule-time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className={cn(
                    jetbrainsMono.className,
                    'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20'
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500">Optimal time slots</span>
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                {['09:30', '12:15', '18:00'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setScheduledTime(slot)}
                    className={cn(
                      jetbrainsMono.className,
                      'rounded-md px-2.5 py-1 text-xs transition-colors tabular-nums',
                      scheduledTime === slot
                        ? 'bg-white text-slate-900 font-semibold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Channel Preview */}
          {showPreview && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  Channel Preview
                </span>
                <div className="flex items-center gap-1">
                  {selectedPlatforms.map((id) => {
                    const active = activePreviewPlatform === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPreviewPlatform(id)}
                        aria-label={`Preview ${id}`}
                        className={cn(
                          'inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors',
                          active
                            ? 'border-indigo-300 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        )}
                      >
                        <SocialPlatformLogo
                          platform={id}
                          className="h-3.5 w-3.5"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold',
                        brand.accentBg,
                        brand.accentText
                      )}
                    >
                      {brand.initials}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">
                        {brand.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {brand.handle} · {previewMeta?.label ?? 'Instagram'} ·{' '}
                        {format}
                      </p>
                    </div>
                  </div>
                  <SocialPlatformLogo
                    platform={activePreviewPlatform}
                    className="h-4 w-4"
                  />
                </div>

                {mediaUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl}
                    alt="Post media preview"
                    referrerPolicy="no-referrer"
                    className="max-h-44 w-full rounded-md object-cover border border-slate-200"
                  />
                )}

                <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-700">
                  {previewText ||
                    'Your post copy preview will appear here as you type.'}
                </p>
              </div>
            </div>
          )}

          {/* Validation Alert */}
          {formError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700"
            >
              <AlertCircle
                className="h-4 w-4 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{formError}</span>
            </div>
          )}
        </div>

        {/* Sticky Drawer Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button
            type="button"
            onClick={() => handleSubmit('Draft')}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            Save Draft
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-lg px-3.5 text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('Scheduled')}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{editingPost ? 'Update Post' : 'Schedule Post'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
