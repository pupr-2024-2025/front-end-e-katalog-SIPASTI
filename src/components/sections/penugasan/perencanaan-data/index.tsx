"use client";

import DataTableMui from "@components/ui/table";
import { useFetch } from "@hooks/perencanaan-data/use-fetch";
import { getPenugasanList } from "@lib/api/penugasan/list-table";
import {
  ColumnDef,
  PenugasanRow,
} from "../../../../types/penugasan/penugasan-list";
import { useMemo, useState } from "react";
import Pagination from "@components/ui/pagination";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function PenugasanDataList() {
  const { data, error, loading } = useFetch(getPenugasanList, []);
  console.log(data);
  const allData = data ?? [];

  const [currentPage, setCurrentPage] = useState<number>(1);

  //   define constant
  const ITEMS_PER_PAGE = 10;
  const total = allData.length;

  const columns: ColumnDef<PenugasanRow>[] = useMemo(
    () => [
      { key: "nama_paket", header: "Nama Paket" },
      { key: "nama_ppk", header: "Nama PPK" },
      { key: "jabatan_ppk", header: "Jabatan PPK" },
      { key: "kode_rup", header: "Kode RUP" },
      { key: "status", header: "Status" },
      {
        key: "aksi",
        header: "Aksi",
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
      </div>
    </div>
  );
}
