import { useMemo, useState, type ReactNode } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: ReactNode;
  render?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  className?: string;
  /** hide cell below the lg breakpoint */
  hideSmall?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => ReactNode;
  selectable?: boolean;
  bulkBar?: (selectedIds: string[], clear: () => void) => ReactNode;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  toolbar?: ReactNode;
  initialSort?: { key: string; dir: "asc" | "desc" };
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  onRowClick,
  rowActions,
  selectable,
  bulkBar,
  pageSize = 8,
  emptyTitle = "Nenhum registro",
  emptyDescription,
  emptyIcon,
  toolbar,
  initialSort,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(initialSort ?? null);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  const sorted = useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return data;
    const sv = col.sortValue;
    return [...data].sort((a, b) => {
      const va = sv(a), vb = sv(b);
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);

  function toggleSort(key: string) {
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.includes(getRowId(r)));
  function toggleAllOnPage() {
    const ids = pageRows.map(getRowId);
    setSelected((s) => (allOnPageSelected ? s.filter((x) => !ids.includes(x)) : [...new Set([...s, ...ids])]));
  }
  function toggleRow(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  const alignCls = { left: "text-left", right: "text-right", center: "text-center" };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
      {toolbar && <div className="border-b border-line px-4 py-3">{toolbar}</div>}

      {selectable && selected.length > 0 && bulkBar && (
        <div className="flex flex-wrap items-center gap-3 border-b border-bordo-200 bg-bordo-50/60 px-4 py-2.5">
          <span className="text-[0.82rem] font-semibold text-bordo-800">{selected.length} selecionado{selected.length > 1 ? "s" : ""}</span>
          <div className="flex items-center gap-2">{bulkBar(selected, () => setSelected([]))}</div>
        </div>
      )}

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-navy-50 text-navy-400 mb-3">{emptyIcon ?? <Inbox className="size-6" />}</span>
          <p className="text-[1rem] font-serif text-navy-900">{emptyTitle}</p>
          {emptyDescription && <p className="mt-1 text-[0.85rem] text-muted">{emptyDescription}</p>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-surface-2/60 text-[0.72rem] uppercase tracking-wide text-faint">
                {selectable && (
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" aria-label="Selecionar todos" checked={allOnPageSelected} onChange={toggleAllOnPage} className="size-4 rounded border-line-strong text-navy-700 focus:ring-bordo-500" />
                  </th>
                )}
                {columns.map((col) => {
                  const active = sort?.key === col.key;
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                      className={cn("px-4 py-3 font-semibold whitespace-nowrap", alignCls[col.align ?? "left"], col.hideSmall && "hidden lg:table-cell")}
                    >
                      {col.sortValue ? (
                        <button onClick={() => toggleSort(col.key)} className={cn("inline-flex items-center gap-1 hover:text-navy-700 transition-colors", active && "text-navy-800")}>
                          {col.header}
                          {active ? (sort!.dir === "asc" ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />) : <ChevronsUpDown className="size-3.5 opacity-50" />}
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  );
                })}
                {rowActions && <th className="px-4 py-3 text-right font-semibold">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pageRows.map((row) => {
                const id = getRowId(row);
                const isSel = selected.includes(id);
                return (
                  <tr
                    key={id}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn("transition-colors", onRowClick && "cursor-pointer hover:bg-navy-50/40", isSel && "bg-bordo-50/30")}
                  >
                    {selectable && (
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" aria-label="Selecionar linha" checked={isSel} onChange={() => toggleRow(id)} className="size-4 rounded border-line-strong text-navy-700 focus:ring-bordo-500" />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-4 py-3.5 text-[0.86rem] text-ink", alignCls[col.align ?? "left"], col.hideSmall && "hidden lg:table-cell", col.className)}>
                        {col.render ? col.render(row) : (row as Record<string, ReactNode>)[col.key]}
                      </td>
                    ))}
                    {rowActions && (
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">{rowActions(row)}</div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {data.length > pageSize && (
        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-[0.82rem] text-muted">
          <span>
            {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, sorted.length)} de {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={safePage === 0} className="grid size-8 place-items-center rounded-lg border border-line disabled:opacity-40 hover:bg-navy-50 disabled:hover:bg-transparent" aria-label="Anterior"><ChevronLeft className="size-4" /></button>
            <span className="px-2 tabular-nums">{safePage + 1} / {pageCount}</span>
            <button onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={safePage >= pageCount - 1} className="grid size-8 place-items-center rounded-lg border border-line disabled:opacity-40 hover:bg-navy-50 disabled:hover:bg-transparent" aria-label="Próxima"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
