import {
  BrandWorkspace,
  CompetitorRow,
  DateRangeOption,
  KpiMetric,
  ReachSeries,
} from './analytics-data';

function escapeCsvCell(value: string | number | boolean | undefined): string {
  const str = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvRow(cells: Array<string | number | boolean | undefined>): string {
  return cells.map(escapeCsvCell).join(',');
}

export interface ExportAnalyticsReportParams {
  brand: BrandWorkspace;
  dateRange: DateRangeOption;
  channelId: string;
  channelLabel: string;
  kpis: KpiMetric[];
  reachSeries: ReachSeries;
  competitors: CompetitorRow[];
  competitorFilterQuery?: string;
}

export function buildAnalyticsReportCsv({
  brand,
  dateRange,
  channelLabel,
  kpis,
  reachSeries,
  competitors,
  competitorFilterQuery,
}: ExportAnalyticsReportParams): string {
  const generatedAt = new Date().toISOString();

  const rows: string[] = [
    toCsvRow(['MetricBoard Social Media Analytics Report']),
    toCsvRow(['Brand', brand.name, 'Handle', brand.handle, 'Industry', brand.industry]),
    toCsvRow(['Channel', channelLabel, 'Date Range', dateRange.label, 'Comparison', dateRange.comparisonLabel]),
    toCsvRow(['Generated At', generatedAt]),
    '',
    toCsvRow(['KPI Overview']),
    toCsvRow(['Metric', 'Current Value', 'Change', 'Trend', 'Details']),
    ...kpis.map((kpi) =>
      toCsvRow([
        kpi.label,
        kpi.value,
        kpi.changePercent,
        kpi.isPositive ? 'Up' : 'Down',
        kpi.sublabel,
      ])
    ),
    '',
    toCsvRow(['Competitor Benchmarking Table']),
    ...(competitorFilterQuery?.trim()
      ? [toCsvRow(['Active Table Filter', competitorFilterQuery.trim()])]
      : []),
    toCsvRow([
      'Competitor Name',
      'Handle',
      'Primary Channel',
      'Followers',
      'Posts this week',
      'Engagement Rate',
    ]),
    ...competitors.map((comp) =>
      toCsvRow([
        comp.name,
        comp.handle,
        comp.primaryChannel,
        comp.followers,
        comp.postsThisWeek,
        `${comp.engagementRate.toFixed(2)}%`,
      ])
    ),
    '',
    toCsvRow(['Organic vs Paid Reach Performance']),
    toCsvRow(['Period', 'Organic Reach', 'Paid Reach', 'Total Reach']),
    ...reachSeries.labels.map((label, index) => {
      const organic = reachSeries.organic[index] ?? 0;
      const paid = reachSeries.paid[index] ?? 0;
      return toCsvRow([label, organic, paid, organic + paid]);
    }),
  ];

  return `\uFEFF${rows.join('\r\n')}`;
}

export function downloadAnalyticsReportCsv(
  params: ExportAnalyticsReportParams
): string {
  const csvContent = buildAnalyticsReportCsv(params);
  const dateStamp = new Date().toISOString().slice(0, 10);
  const filename = `${params.brand.id}-${params.channelId}-${params.dateRange.id}-analytics-report-${dateStamp}.csv`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

  return filename;
}
