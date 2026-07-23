'use client';

import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useQuery } from '@tanstack/react-query';
import type {
  Column,
  ColumnDef,
  OnChangeFn,
  VisibilityState,
} from '@tanstack/react-table';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';

import {
  applyLeaderboardFilters,
  buildFilterFacets,
  LeaderboardToolbar,
  type LeaderboardFilters,
} from '@/components/leaderboard/leaderboard-toolbar';
import { buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  FRONTIER_BENCH_LEADERBOARD,
  FRONTIER_BENCH_PACKAGE,
  fetchLeaderboard,
  formatLeaderboardCell,
  getAccessorValue,
  harborDatasetUrl,
  harborLeaderboardRowUrl,
  leaderboardQueryKey,
  parseLeaderboardLink,
  type LeaderboardColumn,
  type LeaderboardColumnType,
  type LeaderboardRow,
} from '@/lib/leaderboard';
import {
  fromUrlFilters,
  hiddenColumnsParser,
  leaderboardFiltersParser,
  toUrlFilters,
} from '@/lib/leaderboard-url-state';
import { cn } from '@/lib/utils';

const SORTABLE_COLUMN_IDS = new Set([
  'accuracy',
  'release_date',
  'total_tokens',
  'total_cost_usd',
]);

function alignClass(align?: LeaderboardColumn['align']) {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    case 'left':
    case undefined:
      return 'text-left';
    default: {
      const _exhaustive: never = align;
      return _exhaustive;
    }
  }
}

function renderMarkdownInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    const match = /^\*\*([^*]+)\*\*$/.exec(part);
    if (match) {
      return <strong key={index}>{match[1]}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

function LeaderboardCell({
  value,
  type,
}: {
  value: unknown;
  type: LeaderboardColumnType;
}) {
  if (value == null || value === '') return '—';

  switch (type) {
    case 'link': {
      const link = parseLeaderboardLink(value);
      if (!link) return formatLeaderboardCell(value, type);
      return (
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
          onClick={(event) => event.stopPropagation()}
        >
          {link.label}
        </a>
      );
    }
    case 'markdown':
      return <>{renderMarkdownInline(String(value))}</>;
    case 'boolean':
    case 'number':
    case 'date':
    case 'text':
      return formatLeaderboardCell(value, type);
    default: {
      const _exhaustive: never = type;
      return String(_exhaustive);
    }
  }
}

function SortableHeader({
  column,
  label,
  align,
}: {
  column: Column<LeaderboardRow, unknown>;
  label: string;
  align?: LeaderboardColumn['align'];
}) {
  const sorted = column.getIsSorted();
  const icon =
    sorted === 'asc'
      ? ArrowUp01Icon
      : sorted === 'desc'
        ? ArrowDown01Icon
        : ArrowUpDownIcon;

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 font-medium hover:text-foreground',
        align === 'right' && 'ml-auto',
        align === 'center' && 'mx-auto',
      )}
      onClick={() => column.toggleSorting(sorted === 'asc')}
    >
      <span>{label}</span>
      <HugeiconsIcon
        icon={icon}
        strokeWidth={2}
        className="size-3.5 text-muted-foreground"
      />
    </button>
  );
}

function buildColumns(
  columns: LeaderboardColumn[],
): ColumnDef<LeaderboardRow>[] {
  const rankColumn: ColumnDef<LeaderboardRow> = {
    id: 'rank',
    header: '#',
    accessorFn: (row) => row.rank,
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {row.original.rank ?? '—'}
      </span>
    ),
    enableSorting: false,
    meta: {
      headerClassName: 'w-12 text-right',
      cellClassName: 'text-right',
    },
  };

  const dataColumns = columns.map((column): ColumnDef<LeaderboardRow> => {
    const displayType = column.display_type ?? column.type;
    const align = alignClass(column.align);
    const sortable = SORTABLE_COLUMN_IDS.has(column.id);
    return {
      id: column.id,
      accessorFn: (row) => getAccessorValue(row, column.accessor),
      header: sortable
        ? ({ column: tableColumn }) => (
            <SortableHeader
              column={tableColumn}
              label={column.header}
              align={column.align}
            />
          )
        : column.header,
      cell: ({ row }) => {
        const value = column.display_accessor
          ? getAccessorValue(row.original, column.display_accessor)
          : getAccessorValue(row.original, column.accessor);
        return <LeaderboardCell value={value} type={displayType} />;
      },
      enableSorting: sortable,
      meta: {
        headerClassName: align,
        cellClassName: cn(align, column.type === 'number' && 'tabular-nums'),
      },
    };
  });

  return [rankColumn, ...dataColumns];
}

export function LeaderboardTable() {
  const { data, error, isPending } = useQuery({
    queryKey: leaderboardQueryKey(
      FRONTIER_BENCH_PACKAGE,
      FRONTIER_BENCH_LEADERBOARD,
    ),
    queryFn: () =>
      fetchLeaderboard(FRONTIER_BENCH_PACKAGE, FRONTIER_BENCH_LEADERBOARD),
  });

  const facets = useMemo(() => {
    if (!data) {
      return {
        numberBounds: {},
        dateBounds: {},
        setOptions: {},
      };
    }
    return buildFilterFacets(data.leaderboard.columns, data.rows);
  }, [data]);

  const [urlFilters, setUrlFilters] = useQueryState(
    'filters',
    leaderboardFiltersParser,
  );
  const [hiddenColumns, setHiddenColumns] = useQueryState(
    'hide',
    hiddenColumnsParser,
  );

  const filters = useMemo(
    () => fromUrlFilters(urlFilters, facets.numberBounds),
    [facets.numberBounds, urlFilters],
  );

  const columnVisibility = useMemo(() => {
    const visibility: VisibilityState = {};
    for (const id of hiddenColumns) {
      visibility[id] = false;
    }
    return visibility;
  }, [hiddenColumns]);

  function handleFiltersChange(next: LeaderboardFilters) {
    void setUrlFilters(toUrlFilters(next, facets.numberBounds));
  }

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (
    updater,
  ) => {
    const next =
      typeof updater === 'function' ? updater(columnVisibility) : updater;
    const hidden = Object.entries(next)
      .filter(([, visible]) => visible === false)
      .map(([id]) => id);
    void setHiddenColumns(hidden.length > 0 ? hidden : null);
  };

  const filteredRows = useMemo(() => {
    if (!data) return [];
    return applyLeaderboardFilters(
      data.rows,
      data.leaderboard.columns,
      filters,
      facets.numberBounds,
    );
  }, [data, facets.numberBounds, filters]);

  const tableColumns = useMemo(
    () => (data ? buildColumns(data.leaderboard.columns) : []),
    [data],
  );

  const columnOptions = useMemo(() => {
    if (!data) return [];
    return [
      { id: 'rank', label: '#', canHide: true },
      ...data.leaderboard.columns.map((column) => ({
        id: column.id,
        label: column.header,
        canHide: true,
      })),
    ];
  }, [data]);

  if (isPending) {
    return (
      <div className="rounded-xl border px-4 py-10 text-center text-sm text-muted-foreground">
        Loading leaderboard…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-10 text-center text-sm text-destructive">
        {error?.message ?? 'Failed to load leaderboard'}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-6 text-left">
      <DataTable
        columns={tableColumns}
        data={filteredRows}
        emptyMessage="No leaderboard rows match the current filters."
        enableRowSelection
        getRowId={(row) => row.id}
        getRowHref={(row) =>
          harborLeaderboardRowUrl(
            FRONTIER_BENCH_PACKAGE,
            FRONTIER_BENCH_LEADERBOARD,
            row.id,
          )
        }
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        toolbar={
          <LeaderboardToolbar
            columns={data.leaderboard.columns}
            columnOptions={columnOptions}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            numberBounds={facets.numberBounds}
            dateBounds={facets.dateBounds}
            setOptions={facets.setOptions}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        }
        footer={
          <footer className="flex h-12 items-center justify-center border-t bg-sidebar px-6 text-center text-sm text-muted-foreground">
            Resolution rate of Frontier-Bench tasks, ranked by agent and model
            performance.
          </footer>
        }
      />
      <a
        href={harborDatasetUrl(FRONTIER_BENCH_PACKAGE)}
        target="_blank"
        rel="noreferrer"
        className={buttonVariants({ variant: 'outline', size: 'lg' })}
      >
        View the tasks
        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
      </a>
    </div>
  );
}
