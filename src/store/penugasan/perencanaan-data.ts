// src/store/penugasan/perencanaan-data.ts

import { create } from "zustand";

// 👇 Reusable helper: Extract only string-valued keys (for filter/sort)
type StringKeyOf<T> = {
  [K in keyof T]: T[K] extends string | number | boolean ? K : never;
}[keyof T] &
  string;

// 🔍 Filter state: allow filtering on any key of T
export interface TableFilterState {
  [key: string]: string | number | boolean | undefined;
}

interface TableStore<T extends { id: string }> {
  // State
  selectedIds: string[];
  currentPage: number;
  itemsPerPage: number;
  filters: TableFilterState;
  sortBy: StringKeyOf<T> | null;
  sortDirection: "asc" | "desc" | null;

  // Computed
  getFilteredSortedData: (data: T[]) => T[];
  getPaginatedData: (data: T[]) => T[];
  getTotal: (data: T[]) => number;

  // Actions
  toggleRow: (id: string) => void;
  toggleAll: (rows: T[]) => void;
  clearSelection: () => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setFilter: (
    key: StringKeyOf<T>,
    value: string | number | boolean | undefined
  ) => void;
  resetFilters: () => void;
  setSort: (
    key: StringKeyOf<T> | null,
    direction: "asc" | "desc" | null
  ) => void;
}

export const createTableStore = <T extends { id: string }>() =>
  create<TableStore<T>>()((set, get) => ({
    // Initial state
    selectedIds: [],
    currentPage: 1,
    itemsPerPage: 10,
    filters: {},
    sortBy: null,
    sortDirection: null,

    // Computed: filter and sort
    getFilteredSortedData: (data) => {
      const { filters, sortBy, sortDirection } = get();

      let result = [...data];

      // 🔍 Filter: only if filter value is set
      result = result.filter((item) =>
        Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === "") return true;

          const itemValue = (item as Record<string, unknown>)[key];
          if (itemValue === undefined || itemValue === null) return false;

          return String(itemValue)
            .toLowerCase()
            .includes(String(value).toLowerCase());
        })
      );

      // 🔼 Sort: only if sortBy is a valid key
      if (sortBy && sortDirection) {
        result.sort((a, b) => {
          const aVal = (a as Record<string, unknown>)[sortBy] as
            | string
            | number
            | boolean;
          const bVal = (b as Record<string, unknown>)[sortBy] as
            | string
            | number
            | boolean;

          if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
          if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
          return 0;
        });
      }

      return result;
    },

    getPaginatedData: (data) => {
      const filtered = get().getFilteredSortedData(data);
      const { currentPage, itemsPerPage } = get();
      const start = (currentPage - 1) * itemsPerPage;
      return filtered.slice(start, start + itemsPerPage);
    },

    getTotal: (data) => get().getFilteredSortedData(data).length,

    // Actions
    toggleRow: (id) =>
      set((state) => ({
        selectedIds: state.selectedIds.includes(id)
          ? state.selectedIds.filter((i) => i !== id)
          : [...state.selectedIds, id],
      })),

    toggleAll: (rows) =>
      set((state) => {
        const allSelected = rows.every((row) =>
          state.selectedIds.includes(row.id)
        );
        const newIds = allSelected
          ? state.selectedIds.filter((id) => !rows.some((r) => r.id === id))
          : [
              ...state.selectedIds,
              ...rows
                .map((r) => r.id)
                .filter((id) => !state.selectedIds.includes(id)),
            ];
        return { selectedIds: newIds };
      }),

    clearSelection: () => set({ selectedIds: [] }),

    setCurrentPage: (page) => set({ currentPage: page }),

    setItemsPerPage: (count) => set({ itemsPerPage: count, currentPage: 1 }),

    setFilter: (key, value) =>
      set({
        filters: { ...get().filters, [key]: value },
        currentPage: 1,
      }),

    resetFilters: () => set({ filters: {}, currentPage: 1 }),

    setSort: (key, direction) =>
      set({ sortBy: key, sortDirection: direction, currentPage: 1 }),
  }));
