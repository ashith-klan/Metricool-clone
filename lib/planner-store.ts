import { useMemo, useSyncExternalStore } from 'react';
import { BrandWorkspace, PlannerPost } from './analytics-data';

const STORAGE_KEY = 'metricboard_scheduler_posts_v1';
const STORAGE_EVENT = 'metricboard-planner-update';

function subscribePlannerStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function getPlannerSnapshot(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getPlannerServerSnapshot(): string | null {
  return null;
}

export function saveBrandPostsToStorage(
  brandId: string,
  posts: PlannerPost[]
): void {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: Record<string, PlannerPost[]> = raw ? JSON.parse(raw) : {};
    parsed[brandId] = posts;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    // Ignore storage quota errors
  }
}

export function useBrandPlannerPosts(brand: BrandWorkspace): PlannerPost[] {
  const rawStorage = useSyncExternalStore(
    subscribePlannerStorage,
    getPlannerSnapshot,
    getPlannerServerSnapshot
  );

  return useMemo<PlannerPost[]>(() => {
    if (rawStorage) {
      try {
        const parsed = JSON.parse(rawStorage) as Record<string, PlannerPost[]>;
        if (Array.isArray(parsed[brand.id])) {
          return parsed[brand.id];
        }
      } catch {
        // Fallback to seed posts
      }
    }
    return brand.planner;
  }, [rawStorage, brand.id, brand.planner]);
}

export function formatPlannerDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
