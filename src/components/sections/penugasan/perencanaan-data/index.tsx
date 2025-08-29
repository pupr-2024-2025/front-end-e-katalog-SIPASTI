"use client";

import DataTableMui from "@components/ui/table";
import { getPenugasanList } from "@lib/api/penugasan/list-table";
import {
  ColumnDef,
  PenugasanRow,
} from "../../../../types/penugasan/penugasan-list";
import React, { useMemo, useState } from "react";
import Pagination from "@components/ui/pagination";
import { IconButton } from "@mui/material";
import { More, DocumentText, Document, People } from "iconsax-react";
import ActionMenu, { type ActionMenuItem } from "@components/ui/action-menu";
import { useFetch } from "@hooks/penugasan/use-fetch";

export default function PenugasanDataList() {
  const { data, error, loading } = useFetch(getPenugasanList, []);
  const allData = data ?? [];

  const [currentPage, setCurrentPage] = useState<number>(1);

  // state untuk action-menu dan sub-menu
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedRow, setSelectedRow] = useState<PenugasanRow | null>(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState<HTMLElement | null>(
    null
  );

  // define constant
  const ITEMS_PER_PAGE = 10;
  const total = allData.length;

  // handle menu utama
  const handleMenuOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
    row: PenugasanRow
  ) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  // handle close sub-menu
  const handleSubMenuClose = () => {
    setSubmenuAnchorEl(null);
  };

  // daftar menu aksi utama
  const menuItems: ActionMenuItem[] = useMemo(
    () => [
      {
        id: "pdf",
        label: "Lihat PDF Kuesioner",
        icon: <DocumentText size={18} color="currentColor" />,
        onClick: () => {
          console.log("Lihat PDF", selectedRow);
          handleMenuClose();
        },
      },
      {
        id: "detail",
        label: "Lihat Detail Kuesioner",
        icon: <Document size={18} color="currentColor" />,
        onClick: () => {
          console.log("Lihat Detail", selectedRow);
          handleMenuClose();
        },
      },
      {
        id: "penugasan",
        label: "Penugasan Tim",
        icon: <People size={18} color="currentColor" />,
        onClick: () => {
          // ✅ Open submenu using existing anchorEl
          // No event needed — we already have anchorEl from parent menu
          setSubmenuAnchorEl(anchorEl);
        },
      },
    ],
    [selectedRow, anchorEl]
  );

  // daftar sub-menu penugasan tim
  const submenuItems: ActionMenuItem[] = useMemo(
    () => [
      {
        id: "pengawas",
        label: "Pengawas",
        onClick: () => {
          console.log("Penugasan Pengawas", selectedRow);
          handleSubMenuClose();
          handleMenuClose();
        },
      },
      {
        id: "lapangan",
        label: "Petugas Lapangan",
        onClick: () => {
          console.log("Penugasan Petugas Lapangan", selectedRow);
          handleSubMenuClose();
          handleMenuClose();
        },
      },
      {
        id: "pengolah",
        label: "Pengolah Data",
        onClick: () => {
          console.log("Penugasan Pengolah Data", selectedRow);
          handleSubMenuClose();
          handleMenuClose();
        },
      },
    ],
    [selectedRow]
  );

  const columns: ColumnDef<PenugasanRow>[] = useMemo(
    () => [
      { key: "nama_paket", header: "Nama Paket" },
      { key: "nama_ppk", header: "Nama PPK" },
      { key: "jabatan_ppk", header: "Jabatan PPK" },
      { key: "kode_rup", header: "Kode RUP" },
      { key: "status", header: "Status" },
      {
        key: "__aksi",
        header: "Aksi",
        className: "w-[64px] text-center",
        cell: (row) => (
          <IconButton
            aria-label="aksi"
            onClick={(e) => handleMenuOpen(e, row)}
            size="small"
          >
            <More
              size={20}
              color="var(--color-emphasis-light-on-surface-high)"
            />
          </IconButton>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-8">
      <div className="space-y-3">
        {error && <div className="text-red-600">Error: {error}</div>}
        {loading && <div>Memuat data…</div>}

        {!loading && !error && (
          <>
            <DataTableMui<PenugasanRow>
              columns={columns}
              data={allData}
              striped
              stickyHeader
              pagination={{
                currentPage,
                itemsPerPage: ITEMS_PER_PAGE,
                total,
                onPageChange: setCurrentPage,
              }}
            />
            <Pagination
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalData={total}
              onPageChange={setCurrentPage}
            />
          </>
        )}
        {/* Main Action Menu */}
        <ActionMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          items={menuItems}
        />

        {/* Submenu for Penugasan Tim */}
        <ActionMenu
          anchorEl={submenuAnchorEl}
          open={Boolean(submenuAnchorEl)}
          onClose={handleSubMenuClose}
          items={submenuItems}
        />
      </div>
    </div>
  );
}
