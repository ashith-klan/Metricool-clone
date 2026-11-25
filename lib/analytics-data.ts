export type NavSectionId =
  | 'planner'
  | 'analytics'
  | 'inbox'
  | 'flows'
  | 'smartlinks'
  | 'ads';

export type DateRangeId = '7d' | '30d' | '90d' | 'ytd';

export interface DateRangeOption {
  id: DateRangeId;
  label: string;
  comparisonLabel: string;
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { id: '7d', label: 'Last 7 Days', comparisonLabel: 'vs. previous 7 days' },
  { id: '30d', label: 'Last 30 Days', comparisonLabel: 'vs. previous 30 days' },
  { id: '90d', label: 'Last 90 Days', comparisonLabel: 'vs. previous 90 days' },
  { id: 'ytd', label: 'Year to Date', comparisonLabel: 'vs. prior year period' },
];

export interface KpiMetric {
  id: 'followerGrowth' | 'totalImpressions' | 'engagementRate' | 'websiteClicks';
  label: string;
  value: string;
  changePercent: string;
  isPositive: boolean;
  sublabel: string;
}

export interface ReachSeries {
  labels: string[];
  organic: number[];
  paid: number[];
}

export interface CompetitorRow {
  id: string;
  name: string;
  handle: string;
  primaryChannel: string;
  followers: number;
  postsThisWeek: number;
  engagementRate: number;
  isOwnBrand?: boolean;
}

export type SocialPlatform =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'threads';

export type PostFormat = 'Post' | 'Carousel' | 'Reel' | 'Link';

export interface SocialPlatformMeta {
  id: SocialPlatform;
  label: string;
  maxChars: number;
  bestTimes: string[];
  accentText: string;
  activeBg: string;
  activeBorder: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformMeta[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    maxChars: 2200,
    bestTimes: ['09:30', '12:15', '18:30'],
    accentText: 'text-pink-700',
    activeBg: 'bg-pink-50/80',
    activeBorder: 'border-pink-300',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    maxChars: 63206,
    bestTimes: ['10:00', '13:00', '16:30'],
    accentText: 'text-blue-700',
    activeBg: 'bg-blue-50/80',
    activeBorder: 'border-blue-300',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    maxChars: 3000,
    bestTimes: ['08:30', '11:00', '14:00'],
    accentText: 'text-sky-700',
    activeBg: 'bg-sky-50/80',
    activeBorder: 'border-sky-300',
  },
  {
    id: 'twitter',
    label: 'Twitter',
    maxChars: 280,
    bestTimes: ['09:00', '12:30', '17:00'],
    accentText: 'text-slate-900',
    activeBg: 'bg-slate-100',
    activeBorder: 'border-slate-400',
  },
  {
    id: 'threads',
    label: 'Threads',
    maxChars: 500,
    bestTimes: ['10:30', '15:00', '19:30'],
    accentText: 'text-indigo-700',
    activeBg: 'bg-indigo-50/80',
    activeBorder: 'border-indigo-300',
  },
];

export interface PlannerPost {
  id: string;
  caption: string;
  channelCaptions?: Partial<Record<SocialPlatform, string>>;
  platforms: SocialPlatform[];
  format: PostFormat;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  status: 'Scheduled' | 'Draft' | 'Published';
  firstComment?: string;
  mediaName?: string;
  mediaUrl?: string;
}

export interface InboxMessage {
  id: string;
  author: string;
  handle: string;
  channel: string;
  excerpt: string;
  receivedAt: string;
  unread: boolean;
}

export interface AutomationFlow {
  id: string;
  name: string;
  trigger: string;
  runsThisMonth: number;
  conversionRate: string;
  active: boolean;
}

export interface SmartlinkItem {
  id: string;
  title: string;
  slug: string;
  clicks: number;
  ctr: string;
}

export interface AdCampaign {
  id: string;
  campaign: string;
  channel: string;
  spend: string;
  reach: string;
  cpc: string;
  roas: string;
  status: 'Active' | 'Paused';
}

export interface BrandWorkspace {
  id: string;
  name: string;
  handle: string;
  initials: string;
  industry: string;
  accentBg: string;
  accentText: string;
  metricsByRange: Record<
    DateRangeId,
    {
      kpis: KpiMetric[];
      reachSeries: ReachSeries;
    }
  >;
  competitors: CompetitorRow[];
  planner: PlannerPost[];
  inbox: InboxMessage[];
  flows: AutomationFlow[];
  smartlinks: SmartlinkItem[];
  ads: AdCampaign[];
}

export const BRAND_WORKSPACES: BrandWorkspace[] = [
  {
    id: 'studio-nord',
    name: 'Studio Nord',
    handle: '@studionord',
    initials: 'SN',
    industry: 'Architecture & Home',
    accentBg: 'bg-indigo-600',
    accentText: 'text-white',
    metricsByRange: {
      '7d': {
        kpis: [
          {
            id: 'followerGrowth',
            label: 'Follower Growth',
            value: '+742',
            changePercent: '+6.8%',
            isPositive: true,
            sublabel: 'Net new across 4 channels',
          },
          {
            id: 'totalImpressions',
            label: 'Total Impressions',
            value: '124.8K',
            changePercent: '+11.4%',
            isPositive: true,
            sublabel: 'Organic + paid combined',
          },
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: '5.14%',
            changePercent: '+0.4%',
            isPositive: true,
            sublabel: 'Likes, saves, comments & shares',
          },
          {
            id: 'websiteClicks',
            label: 'Website Clicks',
            value: '4,920',
            changePercent: '+5.2%',
            isPositive: true,
            sublabel: 'Bio links & story tags',
          },
        ],
        reachSeries: {
          labels: ['Nov 10', 'Nov 11', 'Nov 12', 'Nov 13', 'Nov 14', 'Nov 15', 'Nov 16'],
          organic: [11200, 12950, 11840, 14620, 16180, 15400, 17900],
          paid: [5400, 6100, 5850, 7200, 8150, 7600, 8950],
        },
      },
      '30d': {
        kpis: [
          {
            id: 'followerGrowth',
            label: 'Follower Growth',
            value: '+2,840',
            changePercent: '+14.2%',
            isPositive: true,
            sublabel: 'Net new across 4 channels',
          },
          {
            id: 'totalImpressions',
            label: 'Total Impressions',
            value: '482.6K',
            changePercent: '+18.7%',
            isPositive: true,
            sublabel: 'Organic + paid combined',
          },
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: '4.82%',
            changePercent: '+5.0%',
            isPositive: true,
            sublabel: 'Likes, saves, comments & shares',
          },
          {
            id: 'websiteClicks',
            label: 'Website Clicks',
            value: '19,410',
            changePercent: '+9.4%',
            isPositive: true,
            sublabel: 'Bio links & story tags',
          },
        ],
        reachSeries: {
          labels: [
            'Oct 18',
            'Oct 20',
            'Oct 22',
            'Oct 24',
            'Oct 26',
            'Oct 28',
            'Oct 30',
            'Nov 01',
            'Nov 03',
            'Nov 05',
            'Nov 07',
            'Nov 09',
            'Nov 11',
            'Nov 13',
            'Nov 16',
          ],
          organic: [
            18400, 19800, 21200, 20100, 23400, 25900, 24600, 27800, 29400, 28100,
            31200, 33600, 32900, 35800, 38400,
          ],
          paid: [
            9200, 9800, 10400, 11900, 12600, 13200, 12100, 14800, 15600, 14900,
            16200, 17400, 16800, 18900, 20400,
          ],
        },
      },
      '90d': {
        kpis: [
          {
            id: 'followerGrowth',
            label: 'Follower Growth',
            value: '+7,910',
            changePercent: '+21.5%',
            isPositive: true,
            sublabel: 'Net new across 4 channels',
          },
          {
            id: 'totalImpressions',
            label: 'Total Impressions',
            value: '1.38M',
            changePercent: '+24.1%',
            isPositive: true,
            sublabel: 'Organic + paid combined',
          },
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: '4.65%',
            changePercent: '+3.1%',
            isPositive: true,
            sublabel: 'Likes, saves, comments & shares',
          },
          {
            id: 'websiteClicks',
            label: 'Website Clicks',
            value: '54,180',
            changePercent: '-1.8%',
            isPositive: false,
            sublabel: 'Bio links & story tags',
          },
        ],
        reachSeries: {
          labels: [
            'Aug 24',
            'Aug 31',
            'Sep 07',
            'Sep 14',
            'Sep 21',
            'Sep 28',
            'Oct 05',
            'Oct 12',
            'Oct 19',
            'Oct 26',
            'Nov 02',
            'Nov 09',
            'Nov 16',
          ],
          organic: [
            52400, 56100, 59800, 57200, 64300, 68900, 71200, 74500, 79100, 82400,
            88200, 93600, 98400,
          ],
          paid: [
            24100, 26800, 28900, 27400, 31200, 34500, 36800, 38100, 41200, 43900,
            46700, 49200, 52100,
          ],
        },
      },
      ytd: {
        kpis: [
          {
            id: 'followerGrowth',
            label: 'Follower Growth',
            value: '+26,450',
            changePercent: '+38.4%',
            isPositive: true,
            sublabel: 'Net new across 4 channels',
          },
          {
            id: 'totalImpressions',
            label: 'Total Impressions',
            value: '4.62M',
            changePercent: '+31.2%',
            isPositive: true,
            sublabel: 'Organic + paid combined',
          },
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: '4.58%',
            changePercent: '+7.6%',
            isPositive: true,
            sublabel: 'Likes, saves, comments & shares',
          },
          {
            id: 'websiteClicks',
            label: 'Website Clicks',
            value: '188.4K',
            changePercent: '+16.9%',
            isPositive: true,
            sublabel: 'Bio links & story tags',
          },
        ],
        reachSeries: {
          labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
          ],
          organic: [
            142000, 158000, 176000, 189000, 212000, 228000, 219000, 246000,
            274000, 308000, 336000,
          ],
          paid: [
            68000, 74000, 82000, 91000, 98000, 112000, 108000, 124000,
            139000, 156000, 172000,
          ],
        },
      },
    },
    competitors: [
      {
        id: 'comp-1',
        name: 'Studio Nord (You)',
        handle: '@studionord',
        primaryChannel: 'Instagram',
        followers: 148200,
        postsThisWeek: 9,
        engagementRate: 4.82,
        isOwnBrand: true,
      },
      {
        id: 'comp-2',
        name: 'Kanso Living',
        handle: '@kansoliving',
        primaryChannel: 'Instagram',
        followers: 214500,
        postsThisWeek: 11,
        engagementRate: 4.18,
      },
      {
        id: 'comp-3',
        name: 'Forme & Timber',
        handle: '@formetimber',
        primaryChannel: 'Pinterest',
        followers: 132900,
        postsThisWeek: 7,
        engagementRate: 3.94,
      },
      {
        id: 'comp-4',
        name: 'Atelier Moss',
        handle: '@ateliermoss',
        primaryChannel: 'Instagram',
        followers: 96400,
        postsThisWeek: 6,
        engagementRate: 5.21,
      },
      {
        id: 'comp-5',
        name: 'Havn Objects',
        handle: '@havnobjects',
        primaryChannel: 'TikTok',
        followers: 184100,
        postsThisWeek: 14,
        engagementRate: 3.45,
      },
      {
        id: 'comp-6',
        name: 'Boreal Craft',
        handle: '@borealcraft',
        primaryChannel: 'Instagram',
        followers: 74800,
        postsThisWeek: 5,
        engagementRate: 4.06,
      },
    ],
    planner: [
      {
        id: 'p1',
        caption:
          'Winter Oak Dining Table — closer look at our wedged mortise-and-tenon joinery before the first coat of matte oil. #ScandinavianDesign #Woodcraft',
        platforms: ['instagram', 'facebook'],
        format: 'Reel',
        scheduledDate: '2026-11-25',
        scheduledTime: '09:30',
        status: 'Scheduled',
        firstComment: 'Full dimensions and timber samples linked in bio.',
        mediaName: 'winter-oak-joinery.mp4',
      },
      {
        id: 'p2',
        caption:
          '5 lighting ratios we use when designing compact urban apartments: how warm 2700K indirect washes open up low-ceiling spaces.',
        platforms: ['linkedin', 'threads'],
        format: 'Carousel',
        scheduledDate: '2026-11-26',
        scheduledTime: '11:00',
        status: 'Scheduled',
        mediaName: 'lighting-ratios-deck.pdf',
      },
      {
        id: 'p3',
        caption:
          'Open studio hours in Copenhagen this Friday — stop by to test the new modular oak shelving system in person.',
        platforms: ['twitter', 'threads'],
        format: 'Post',
        scheduledDate: '2026-11-27',
        scheduledTime: '17:00',
        status: 'Draft',
      },
      {
        id: 'p4',
        caption:
          'Autumn Linen Collection Lookbook is live. Neutral heavyweight weaves milled in Belgium for lasting texture.',
        platforms: ['instagram', 'facebook', 'linkedin'],
        format: 'Carousel',
        scheduledDate: '2026-11-23',
        scheduledTime: '10:00',
        status: 'Published',
        mediaName: 'autumn-linen-lookbook.jpg',
      },
    ],
    inbox: [
      {
        id: 'm1',
        author: 'Clara Lindqvist',
        handle: '@claralind',
        channel: 'Instagram DM',
        excerpt: 'Hi! Do you ship the modular oak shelving unit to Helsinki?',
        receivedAt: '14m ago',
        unread: true,
      },
      {
        id: 'm2',
        author: 'Marcus Weber',
        handle: '@mweber_arch',
        channel: 'LinkedIn',
        excerpt: 'Interested in trade pricing for a boutique hotel project in Zurich.',
        receivedAt: '1h ago',
        unread: true,
      },
      {
        id: 'm3',
        author: 'Sora Takahashi',
        handle: '@soratakahashi',
        channel: 'Instagram Comment',
        excerpt: 'What wood oil finish is used on the side table in slide 3?',
        receivedAt: '3h ago',
        unread: false,
      },
    ],
    flows: [
      {
        id: 'f1',
        name: 'Reel Comment → Catalog Link DM',
        trigger: 'Keyword "CATALOG" in Instagram comments',
        runsThisMonth: 1284,
        conversionRate: '34.2%',
        active: true,
      },
      {
        id: 'f2',
        name: 'New Follower Welcome Note',
        trigger: 'New Instagram follower',
        runsThisMonth: 2840,
        conversionRate: '18.6%',
        active: true,
      },
      {
        id: 'f3',
        name: 'Trade Inquiry Routing',
        trigger: 'DM containing "wholesale" or "trade"',
        runsThisMonth: 94,
        conversionRate: '61.7%',
        active: false,
      },
    ],
    smartlinks: [
      {
        id: 's1',
        title: 'Autumn Architecture Lookbook',
        slug: 'metric.link/studionord-autumn',
        clicks: 8420,
        ctr: '6.4%',
      },
      {
        id: 's2',
        title: 'Showroom Appointment Booking',
        slug: 'metric.link/studionord-visit',
        clicks: 4190,
        ctr: '4.9%',
      },
      {
        id: 's3',
        title: 'Care & Wood Maintenance Guide',
        slug: 'metric.link/studionord-care',
        clicks: 2860,
        ctr: '3.7%',
      },
    ],
    ads: [
      {
        id: 'a1',
        campaign: 'Winter Dining Retargeting',
        channel: 'Meta Ads',
        spend: '$2,450',
        reach: '142.8K',
        cpc: '$0.42',
        roas: '4.6x',
        status: 'Active',
      },
      {
        id: 'a2',
        campaign: 'Modular Shelving Discovery',
        channel: 'TikTok Ads',
        spend: '$1,680',
        reach: '218.4K',
        cpc: '$0.29',
        roas: '3.2x',
        status: 'Active',
      },
      {
        id: 'a3',
        campaign: 'Trade Catalog Lead Gen',
        channel: 'LinkedIn Ads',
        spend: '$940',
        reach: '38.1K',
        cpc: '$1.85',
        roas: '5.1x',
        status: 'Paused',
      },
    ],
  },
  {
    id: 'veloce-roasters',
    name: 'Veloce Roasters',
    handle: '@veloceroasters',
    initials: 'VR',
    industry: 'Specialty Coffee',
    accentBg: 'bg-slate-900',
    accentText: 'text-white',
    metricsByRange: {
      '7d': {
        kpis: [
          {
            id: 'followerGrowth',
            label: 'Follower Growth',
            value: '+418',
            changePercent: '+4.9%',
            isPositive: true,
            sublabel: 'Net new across 3 channels',
          },
          {
            id: 'totalImpressions',
            label: 'Total Impressions',
            value: '89.4K',
            changePercent: '+7.6%',
            isPositive: true,
            sublabel: 'Organic + paid combined',
          },
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: '6.12%',
            changePercent: '+1.2%',
            isPositive: true,
            sublabel: 'Likes, saves, comments & shares',
          },
          {
            id: 'websiteClicks',
            label: 'Website Clicks',
            value: '3,190',
            changePercent: '-2.4%',
            isPositive: false,
            sublabel: 'Bio links & story tags',
          },
        ],
        reachSeries: {
          labels: ['Nov 10', 'Nov 11', 'Nov 12', 'Nov 13', 'Nov 14', 'Nov 15', 'Nov 16'],
          organic: [8400, 9100, 8900, 10200, 11400, 12100, 12800],
          paid: [3100, 3400, 3250, 3900, 4400, 4150, 4800],
        },
      },
      '30d': {
        kpis: [
          {
            id: 'followerGrowth',
            label: 'Follower Growth',
            value: '+1,690',
            changePercent: '+9.4%',
            isPositive: true,
            sublabel: 'Net new across 3 channels',
          },
          {
            id: 'totalImpressions',
            label: 'Total Impressions',
            value: '341.2K',
            changePercent: '+12.8%',
            isPositive: true,
            sublabel: 'Organic + paid combined',
          },
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: '5.84%',
            changePercent: '+6.3%',
            isPositive: true,
            sublabel: 'Likes, saves, comments & shares',
          },
          {
            id: 'websiteClicks',
            label: 'Website Clicks',
            value: '13,240',
            changePercent: '+4.1%',
            isPositive: true,
            sublabel: 'Bio links & story tags',
          },
        ],
        reachSeries: {
          labels: [
            'Oct 18',
            'Oct 20',
            'Oct 22',
            'Oct 24',
            'Oct 26',
            'Oct 28',
            'Oct 30',
            'Nov 01',
            'Nov 03',
            'Nov 05',
            'Nov 07',
            'Nov 09',
            'Nov 11',
            'Nov 13',
            'Nov 16',
          ],
          organic: [
            13400, 14100, 15200, 14800, 16900, 18200, 17600, 19400, 20800, 19900,
            21500, 22900, 23400, 24800, 26100,
          ],
          paid: [
            5800, 6100, 6400, 7100, 7500, 7900, 7300, 8400, 8900, 8600, 9200,
            9800, 9500, 10400, 11100,
          ],
        },
      },
      '90d': {
        kpis: [
          {
            id: 'followerGrowth',
            label: 'Follower Growth',
            value: '+4,820',
            changePercent: '+16.1%',
            isPositive: true,
            sublabel: 'Net new across 3 channels',
          },
          {
            id: 'totalImpressions',
            label: 'Total Impressions',
            value: '972.5K',
            changePercent: '+19.3%',
            isPositive: true,
            sublabel: 'Organic + paid combined',
          },
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: '5.62%',
            changePercent: '+4.5%',
            isPositive: true,
            sublabel: 'Likes, saves, comments & shares',
          },
          {
            id: 'websiteClicks',
            label: 'Website Clicks',
            value: '38,650',
            changePercent: '+8.2%',
            isPositive: true,
            sublabel: 'Bio links & story tags',
          },
        ],
        reachSeries: {
          labels: [
            'Aug 24',
            'Aug 31',
            'Sep 07',
            'Sep 14',
            'Sep 21',
            'Sep 28',
            'Oct 05',
            'Oct 12',
            'Oct 19',
            'Oct 26',
            'Nov 02',
            'Nov 09',
            'Nov 16',
          ],
          organic: [
            38200, 40500, 42100, 41200, 44900, 47800, 49600, 52300, 55100, 58200,
            61400, 64800, 67900,
          ],
          paid: [
            15200, 16800, 17900, 17100, 19400, 21200, 22400, 23800, 25100, 26700,
            28400, 29900, 31600,
          ],
        },
      },
      ytd: {
        kpis: [
          {
            id: 'followerGrowth',
            label: 'Follower Growth',
            value: '+15,340',
            changePercent: '+27.8%',
            isPositive: true,
            sublabel: 'Net new across 3 channels',
          },
          {
            id: 'totalImpressions',
            label: 'Total Impressions',
            value: '3.14M',
            changePercent: '+22.4%',
            isPositive: true,
            sublabel: 'Organic + paid combined',
          },
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: '5.49%',
            changePercent: '+5.1%',
            isPositive: true,
            sublabel: 'Likes, saves, comments & shares',
          },
          {
            id: 'websiteClicks',
            label: 'Website Clicks',
            value: '124.9K',
            changePercent: '+14.2%',
            isPositive: true,
            sublabel: 'Bio links & story tags',
          },
        ],
        reachSeries: {
          labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
          ],
          organic: [
            98000, 108000, 119000, 128000, 141000, 152000, 148000, 165000,
            184000, 204000, 221000,
          ],
          paid: [
            41000, 45000, 49000, 54000, 59000, 64000, 62000, 71000, 79000,
            88000, 96000,
          ],
        },
      },
    },
    competitors: [
      {
        id: 'vc-1',
        name: 'Veloce Roasters (You)',
        handle: '@veloceroasters',
        primaryChannel: 'Instagram',
        followers: 86400,
        postsThisWeek: 8,
        engagementRate: 5.84,
        isOwnBrand: true,
      },
      {
        id: 'vc-2',
        name: 'Daybreak Coffee Co.',
        handle: '@daybreakcoffee',
        primaryChannel: 'TikTok',
        followers: 142800,
        postsThisWeek: 12,
        engagementRate: 4.92,
      },
      {
        id: 'vc-3',
        name: 'Onda Espresso',
        handle: '@ondaespresso',
        primaryChannel: 'Instagram',
        followers: 64200,
        postsThisWeek: 6,
        engagementRate: 5.15,
      },
      {
        id: 'vc-4',
        name: 'Single Origin Lab',
        handle: '@singleoriginlab',
        primaryChannel: 'YouTube',
        followers: 118500,
        postsThisWeek: 4,
        engagementRate: 6.41,
      },
      {
        id: 'vc-5',
        name: 'Crema Guild',
        handle: '@cremaguild',
        primaryChannel: 'Instagram',
        followers: 51900,
        postsThisWeek: 9,
        engagementRate: 3.78,
      },
    ],
    planner: [
      {
        id: 'vp1',
        caption:
          'Dialing in our Ethiopian washed micro-lot at 93°C — bergamot aromatics and bright honey finish on V60.',
        platforms: ['instagram', 'threads'],
        format: 'Reel',
        scheduledDate: '2026-11-25',
        scheduledTime: '08:30',
        status: 'Scheduled',
        mediaName: 'ethiopian-pourover.mp4',
      },
      {
        id: 'vp2',
        caption:
          'Holiday Espresso Subscription tasting notes: dark cacao, toasted hazelnut, and dried cherry. Orders close Thursday.',
        platforms: ['facebook', 'linkedin', 'twitter'],
        format: 'Link',
        scheduledDate: '2026-11-26',
        scheduledTime: '10:30',
        status: 'Scheduled',
      },
      {
        id: 'vp3',
        caption:
          'Friday cupping session recap with our partner roasters — thanks to everyone who joined the table.',
        platforms: ['instagram', 'facebook'],
        format: 'Post',
        scheduledDate: '2026-11-22',
        scheduledTime: '15:00',
        status: 'Published',
      },
    ],
    inbox: [
      {
        id: 'vm1',
        author: 'Liam O’Connor',
        handle: '@liam_brews',
        channel: 'Instagram DM',
        excerpt: 'When does the winter micro-lot restock drop online?',
        receivedAt: '22m ago',
        unread: true,
      },
      {
        id: 'vm2',
        author: 'Elena Rossi',
        handle: '@elena.r',
        channel: 'TikTok Comment',
        excerpt: 'What grind setting did you use on the Comandante for V60?',
        receivedAt: '2h ago',
        unread: false,
      },
    ],
    flows: [
      {
        id: 'vf1',
        name: 'Recipe Card Auto-DM',
        trigger: 'Comment "BREW" on any pour-over reel',
        runsThisMonth: 912,
        conversionRate: '41.5%',
        active: true,
      },
      {
        id: 'vf2',
        name: 'Subscriber Renewal Check-in',
        trigger: 'Story reply on roast drops',
        runsThisMonth: 340,
        conversionRate: '28.9%',
        active: true,
      },
    ],
    smartlinks: [
      {
        id: 'vs1',
        title: 'Winter Micro-Lot Drop',
        slug: 'metric.link/veloce-microlot',
        clicks: 5610,
        ctr: '7.1%',
      },
      {
        id: 'vs2',
        title: 'Monthly Bean Subscription',
        slug: 'metric.link/veloce-sub',
        clicks: 3890,
        ctr: '5.2%',
      },
    ],
    ads: [
      {
        id: 'va1',
        campaign: 'Starter Roast Bundle',
        channel: 'Meta Ads',
        spend: '$1,420',
        reach: '94.2K',
        cpc: '$0.36',
        roas: '3.9x',
        status: 'Active',
      },
      {
        id: 'va2',
        campaign: 'Holiday Gift Box Pre-Order',
        channel: 'TikTok Ads',
        spend: '$890',
        reach: '116.5K',
        cpc: '$0.24',
        roas: '4.4x',
        status: 'Active',
      },
    ],
  },
  {
    id: 'lumen-botanicals',
    name: 'Lumen Botanicals',
    handle: '@lumenbotanicals',
    initials: 'LB',
    industry: 'Clean Skincare',
    accentBg: 'bg-teal-600',
    accentText: 'text-white',
    metricsByRange: {
      '7d': {
        kpis: [
          {
            id: 'followerGrowth',
            label: 'Follower Growth',
            value: '+1,120',
            changePercent: '+8.9%',
            isPositive: true,
            sublabel: 'Net new across 4 channels',
          },
          {
            id: 'totalImpressions',
            label: 'Total Impressions',
            value: '198.4K',
            changePercent: '+15.2%',
            isPositive: true,
            sublabel: 'Organic + paid combined',
          },
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: '3.96%',
            changePercent: '-0.3%',
            isPositive: false,
            sublabel: 'Likes, saves, comments & shares',
          },
          {
            id: 'websiteClicks',
            label: 'Website Clicks',
            value: '7,840',
            changePercent: '+12.6%',
            isPositive: true,
            sublabel: 'Bio links & story tags',
          },
        ],
        reachSeries: {
          labels: ['Nov 10', 'Nov 11', 'Nov 12', 'Nov 13', 'Nov 14', 'Nov 15', 'Nov 16'],
          organic: [16400, 17900, 18200, 20100, 21400, 20900, 23200],
          paid: [9800, 10400, 11200, 12600, 13400, 12900, 14500],
        },
      },
      '30d': {
        kpis: [
          {
            id: 'followerGrowth',
            label: 'Follower Growth',
            value: '+4,310',
            changePercent: '+16.8%',
            isPositive: true,
            sublabel: 'Net new across 4 channels',
          },
          {
            id: 'totalImpressions',
            label: 'Total Impressions',
            value: '764.9K',
            changePercent: '+22.4%',
            isPositive: true,
            sublabel: 'Organic + paid combined',
          },
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: '4.12%',
            changePercent: '+2.4%',
            isPositive: true,
            sublabel: 'Likes, saves, comments & shares',
          },
          {
            id: 'websiteClicks',
            label: 'Website Clicks',
            value: '29,650',
            changePercent: '+14.8%',
            isPositive: true,
            sublabel: 'Bio links & story tags',
          },
        ],
        reachSeries: {
          labels: [
            'Oct 18',
            'Oct 20',
            'Oct 22',
            'Oct 24',
            'Oct 26',
            'Oct 28',
            'Oct 30',
            'Nov 01',
            'Nov 03',
            'Nov 05',
            'Nov 07',
            'Nov 09',
            'Nov 11',
            'Nov 13',
            'Nov 16',
          ],
          organic: [
            27400, 29100, 30800, 29600, 33200, 35400, 34100, 37800, 39500, 38400,
            41900, 44200, 45100, 48200, 51400,
          ],
          paid: [
            16200, 17400, 18100, 19500, 21200, 22400, 21100, 23800, 24900, 24100,
            26200, 27900, 28400, 30600, 32400,
          ],
        },
      },
      '90d': {
        kpis: [
          {
            id: 'followerGrowth',
            label: 'Follower Growth',
            value: '+12,480',
            changePercent: '+25.3%',
            isPositive: true,
            sublabel: 'Net new across 4 channels',
          },
          {
            id: 'totalImpressions',
            label: 'Total Impressions',
            value: '2.19M',
            changePercent: '+28.9%',
            isPositive: true,
            sublabel: 'Organic + paid combined',
          },
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: '4.08%',
            changePercent: '+1.9%',
            isPositive: true,
            sublabel: 'Likes, saves, comments & shares',
          },
          {
            id: 'websiteClicks',
            label: 'Website Clicks',
            value: '84,320',
            changePercent: '+19.4%',
            isPositive: true,
            sublabel: 'Bio links & story tags',
          },
        ],
        reachSeries: {
          labels: [
            'Aug 24',
            'Aug 31',
            'Sep 07',
            'Sep 14',
            'Sep 21',
            'Sep 28',
            'Oct 05',
            'Oct 12',
            'Oct 19',
            'Oct 26',
            'Nov 02',
            'Nov 09',
            'Nov 16',
          ],
          organic: [
            78400, 82100, 86400, 84200, 91500, 96800, 102400, 108200, 114900,
            119600, 126400, 132800, 139200,
          ],
          paid: [
            42100, 45600, 48900, 47200, 52400, 56100, 59800, 63400, 67200,
            71500, 75800, 79400, 83900,
          ],
        },
      },
      ytd: {
        kpis: [
          {
            id: 'followerGrowth',
            label: 'Follower Growth',
            value: '+41,900',
            changePercent: '+44.1%',
            isPositive: true,
            sublabel: 'Net new across 4 channels',
          },
          {
            id: 'totalImpressions',
            label: 'Total Impressions',
            value: '7.48M',
            changePercent: '+39.5%',
            isPositive: true,
            sublabel: 'Organic + paid combined',
          },
          {
            id: 'engagementRate',
            label: 'Engagement Rate',
            value: '4.19%',
            changePercent: '+6.2%',
            isPositive: true,
            sublabel: 'Likes, saves, comments & shares',
          },
          {
            id: 'websiteClicks',
            label: 'Website Clicks',
            value: '294.1K',
            changePercent: '+27.3%',
            isPositive: true,
            sublabel: 'Bio links & story tags',
          },
        ],
        reachSeries: {
          labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
          ],
          organic: [
            214000, 238000, 261000, 284000, 312000, 336000, 329000, 368000,
            402000, 446000, 489000,
          ],
          paid: [
            118000, 132000, 146000, 161000, 178000, 194000, 189000, 214000,
            238000, 264000, 289000,
          ],
        },
      },
    },
    competitors: [
      {
        id: 'lb-1',
        name: 'Lumen Botanicals (You)',
        handle: '@lumenbotanicals',
        primaryChannel: 'Instagram',
        followers: 234900,
        postsThisWeek: 12,
        engagementRate: 4.12,
        isOwnBrand: true,
      },
      {
        id: 'lb-2',
        name: 'Soli Skin',
        handle: '@soliskin',
        primaryChannel: 'TikTok',
        followers: 312400,
        postsThisWeek: 16,
        engagementRate: 4.86,
      },
      {
        id: 'lb-3',
        name: 'Verdant Apothecary',
        handle: '@verdantapothecary',
        primaryChannel: 'Instagram',
        followers: 178600,
        postsThisWeek: 8,
        engagementRate: 3.74,
      },
      {
        id: 'lb-4',
        name: 'Aurelia Derm',
        handle: '@aureliaderm',
        primaryChannel: 'Instagram',
        followers: 265100,
        postsThisWeek: 10,
        engagementRate: 3.92,
      },
      {
        id: 'lb-5',
        name: 'Dew & Mineral',
        handle: '@dewmineral',
        primaryChannel: 'TikTok',
        followers: 149200,
        postsThisWeek: 11,
        engagementRate: 5.08,
      },
    ],
    planner: [
      {
        id: 'lp1',
        caption:
          'Barrier Repair Serum clinical breakdown: +34% hydration retention after 14 days in cold-weather testing.',
        platforms: ['instagram', 'facebook', 'linkedin'],
        format: 'Carousel',
        scheduledDate: '2026-11-25',
        scheduledTime: '12:00',
        status: 'Scheduled',
        mediaName: 'barrier-serum-study.jpg',
      },
      {
        id: 'lp2',
        caption:
          'Morning vs evening hydration routine in under 90 seconds — why layering humectants on damp skin matters.',
        platforms: ['twitter', 'threads'],
        format: 'Post',
        scheduledDate: '2026-11-27',
        scheduledTime: '18:30',
        status: 'Scheduled',
      },
    ],
    inbox: [
      {
        id: 'lm1',
        author: 'Maya Lin',
        handle: '@mayalin_beauty',
        channel: 'Instagram DM',
        excerpt: 'Is the niacinamide mist safe to layer with prescription retinoids?',
        receivedAt: '9m ago',
        unread: true,
      },
      {
        id: 'lm2',
        author: 'Hannah Brooks',
        handle: '@hannahb',
        channel: 'TikTok Comment',
        excerpt: 'Just ordered the travel discovery kit, excited to try!',
        receivedAt: '1h ago',
        unread: false,
      },
    ],
    flows: [
      {
        id: 'lf1',
        name: 'Skin Quiz Recommender DM',
        trigger: 'Keyword "ROUTINE" in Instagram DM',
        runsThisMonth: 2410,
        conversionRate: '44.8%',
        active: true,
      },
    ],
    smartlinks: [
      {
        id: 'ls1',
        title: 'Winter Barrier Kit',
        slug: 'metric.link/lumen-barrier',
        clicks: 14200,
        ctr: '8.3%',
      },
      {
        id: 'ls2',
        title: 'Ingredient Glossary',
        slug: 'metric.link/lumen-glossary',
        clicks: 6340,
        ctr: '4.6%',
      },
    ],
    ads: [
      {
        id: 'la1',
        campaign: 'Barrier Serum UGC Spark',
        channel: 'TikTok Ads',
        spend: '$4,120',
        reach: '412.0K',
        cpc: '$0.21',
        roas: '5.3x',
        status: 'Active',
      },
      {
        id: 'la2',
        campaign: 'Holiday Skincare Sets',
        channel: 'Meta Ads',
        spend: '$3,280',
        reach: '264.8K',
        cpc: '$0.38',
        roas: '4.1x',
        status: 'Active',
      },
    ],
  },
];

export type AnalyticsChannelFilter = 'all' | SocialPlatform;

interface ChannelProfile {
  label: string;
  followerShare: number;
  impressionShare: number;
  engagementMultiplier: number;
  clickShare: number;
  organicShare: number;
  paidShare: number;
  deltaOffset: number;
  phaseOffset: number;
  postsFactor: number;
  sublabels: Record<KpiMetric['id'], string>;
}

const CHANNEL_PROFILES: Record<SocialPlatform, ChannelProfile> = {
  instagram: {
    label: 'Instagram',
    followerShare: 0.38,
    impressionShare: 0.41,
    engagementMultiplier: 1.18,
    clickShare: 0.35,
    organicShare: 0.42,
    paidShare: 0.4,
    deltaOffset: 2.4,
    phaseOffset: 0.6,
    postsFactor: 0.42,
    sublabels: {
      followerGrowth: 'Instagram followers',
      totalImpressions: 'Reels, Stories & Feed reach',
      engagementRate: 'Likes, saves & comments',
      websiteClicks: 'Bio & story link taps',
    },
  },
  facebook: {
    label: 'Facebook',
    followerShare: 0.18,
    impressionShare: 0.2,
    engagementMultiplier: 0.72,
    clickShare: 0.21,
    organicShare: 0.18,
    paidShare: 0.26,
    deltaOffset: -1.3,
    phaseOffset: 1.4,
    postsFactor: 0.28,
    sublabels: {
      followerGrowth: 'Page followers',
      totalImpressions: 'Feed & boosted impressions',
      engagementRate: 'Reactions, shares & comments',
      websiteClicks: 'Link post referrals',
    },
  },
  linkedin: {
    label: 'LinkedIn',
    followerShare: 0.16,
    impressionShare: 0.15,
    engagementMultiplier: 1.05,
    clickShare: 0.26,
    organicShare: 0.14,
    paidShare: 0.18,
    deltaOffset: 1.8,
    phaseOffset: 2.2,
    postsFactor: 0.24,
    sublabels: {
      followerGrowth: 'Company page followers',
      totalImpressions: 'Organic & sponsored feed',
      engagementRate: 'Reactions, reposts & clicks',
      websiteClicks: 'Article & CTA link clicks',
    },
  },
  twitter: {
    label: 'Twitter',
    followerShare: 0.15,
    impressionShare: 0.14,
    engagementMultiplier: 0.84,
    clickShare: 0.12,
    organicShare: 0.14,
    paidShare: 0.12,
    deltaOffset: -0.9,
    phaseOffset: 3.1,
    postsFactor: 0.35,
    sublabels: {
      followerGrowth: 'Account followers',
      totalImpressions: 'Timeline & promoted views',
      engagementRate: 'Likes, replies & reposts',
      websiteClicks: 'Card & profile link clicks',
    },
  },
  threads: {
    label: 'Threads',
    followerShare: 0.13,
    impressionShare: 0.1,
    engagementMultiplier: 1.32,
    clickShare: 0.06,
    organicShare: 0.12,
    paidShare: 0.04,
    deltaOffset: 4.1,
    phaseOffset: 4.0,
    postsFactor: 0.3,
    sublabels: {
      followerGrowth: 'Threads followers',
      totalImpressions: 'Organic feed & reposts',
      engagementRate: 'Replies, quotes & likes',
      websiteClicks: 'Profile link visits',
    },
  },
};

function parseMetricNumeric(raw: string): number {
  const cleaned = raw.replace(/[,+%]/g, '').trim();
  if (cleaned.endsWith('M')) {
    return parseFloat(cleaned.slice(0, -1)) * 1_000_000;
  }
  if (cleaned.endsWith('K')) {
    return parseFloat(cleaned.slice(0, -1)) * 1_000;
  }
  return parseFloat(cleaned) || 0;
}

function formatScaledCount(val: number, withPlus = false): string {
  const rounded = Math.round(val);
  const prefix = withPlus && rounded >= 0 ? '+' : '';
  if (Math.abs(rounded) >= 1_000_000) {
    return `${prefix}${(rounded / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(rounded) >= 100_000) {
    return `${prefix}${(rounded / 1_000).toFixed(1)}K`;
  }
  return `${prefix}${rounded.toLocaleString()}`;
}

export function getChannelAnalyticsMetrics(
  brand: BrandWorkspace,
  dateRange: DateRangeId,
  channel: AnalyticsChannelFilter
): {
  kpis: KpiMetric[];
  reachSeries: ReachSeries;
  competitors: CompetitorRow[];
} {
  const base = brand.metricsByRange[dateRange];
  if (channel === 'all') {
    return {
      kpis: base.kpis,
      reachSeries: base.reachSeries,
      competitors: brand.competitors,
    };
  }

  const profile = CHANNEL_PROFILES[channel];

  const kpis: KpiMetric[] = base.kpis.map((kpi) => {
    const baseNum = parseMetricNumeric(kpi.value);
    const baseDelta = parseMetricNumeric(kpi.changePercent);
    const signedBaseDelta = kpi.isPositive ? baseDelta : -baseDelta;
    const nextDelta = signedBaseDelta + profile.deltaOffset;
    const isPositive = nextDelta >= 0;
    const formattedDelta = `${isPositive ? '+' : ''}${nextDelta.toFixed(1)}%`;

    let nextValue = kpi.value;
    if (kpi.id === 'followerGrowth') {
      nextValue = formatScaledCount(baseNum * profile.followerShare, true);
    } else if (kpi.id === 'totalImpressions') {
      nextValue = formatScaledCount(baseNum * profile.impressionShare, false);
    } else if (kpi.id === 'engagementRate') {
      nextValue = `${(baseNum * profile.engagementMultiplier).toFixed(2)}%`;
    } else if (kpi.id === 'websiteClicks') {
      nextValue = formatScaledCount(baseNum * profile.clickShare, false);
    }

    return {
      ...kpi,
      value: nextValue,
      changePercent: formattedDelta,
      isPositive,
      sublabel: profile.sublabels[kpi.id],
    };
  });

  const reachSeries: ReachSeries = {
    labels: base.reachSeries.labels,
    organic: base.reachSeries.organic.map((val, idx) => {
      const wave = 1 + 0.08 * Math.sin(idx * 0.85 + profile.phaseOffset);
      return Math.max(0, Math.round(val * profile.organicShare * wave));
    }),
    paid: base.reachSeries.paid.map((val, idx) => {
      const wave = 1 + 0.07 * Math.cos(idx * 0.75 + profile.phaseOffset);
      return Math.max(0, Math.round(val * profile.paidShare * wave));
    }),
  };

  const competitors: CompetitorRow[] = brand.competitors.map((comp, idx) => {
    const peerVariance = 0.92 + ((idx % 3) * 0.08);
    return {
      ...comp,
      primaryChannel: profile.label,
      followers: Math.max(
        1200,
        Math.round(comp.followers * profile.followerShare * peerVariance)
      ),
      postsThisWeek: Math.max(
        1,
        Math.round(comp.postsThisWeek * profile.postsFactor + (idx % 2))
      ),
      engagementRate: Number(
        (comp.engagementRate * profile.engagementMultiplier * (0.95 + (idx % 3) * 0.04)).toFixed(2)
      ),
    };
  });

  return { kpis, reachSeries, competitors };
}

