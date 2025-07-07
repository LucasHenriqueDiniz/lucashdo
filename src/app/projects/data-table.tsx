/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, Search, Filter } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project } from '@/constants';

interface DataTableProps<TData extends Project, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  translations: {
    search: string;
    columns: string;
    noResults: string;
    previous: string;
    next: string;
    showing: string;
    of: string;
    results: string;
  };
}

export const DataTable = memo(
  <TData extends Project, TValue>({
    columns,
    data,
    searchPlaceholder,
    translations,
  }: DataTableProps<TData, TValue>) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
      data,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
      enableRowSelection: false,
      enableMultiRowSelection: false,
      enableColumnResizing: false,
    });

    const handleSearchChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        table.getColumn('title')?.setFilterValue(event.target.value);
      },
      [table]
    );

    const handlePreviousPage = useCallback(() => {
      table.previousPage();
    }, [table]);

    const handleNextPage = useCallback(() => {
      table.nextPage();
    }, [table]);

    const handleColumnVisibilityChange = useCallback((column: any, value: boolean) => {
      column.toggleVisibility(!!value);
    }, []);

    const filteredRowCount = useMemo(() => table.getFilteredRowModel().rows.length, [table]);
    const totalRowCount = useMemo(() => data.length, [data]);
    const canPreviousPage = useMemo(() => table.getCanPreviousPage(), [table]);
    const canNextPage = useMemo(() => table.getCanNextPage(), [table]);
    const searchValue = useMemo(
      () => (table.getColumn('title')?.getFilterValue() as string) ?? '',
      [table]
    );

    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={searchPlaceholder || translations.search}
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-10 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
              >
                <Filter className="mr-2 h-4 w-4" />
                {translations.columns} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value => handleColumnVisibilityChange(column, value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border border-gray-200/50 dark:border-gray-700/50">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="bg-gray-50/50 dark:bg-gray-700/30">
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors border-b border-gray-100/50 dark:border-gray-700/30"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500 dark:text-gray-400"
                  >
                    {translations.noResults}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {translations.showing} {filteredRowCount} {translations.of} {totalRowCount}{' '}
            {translations.results}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!canPreviousPage}
              className="bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
            >
              {translations.previous}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!canNextPage}
              className="bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
            >
              {translations.next}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

DataTable.displayName = 'DataTable';
