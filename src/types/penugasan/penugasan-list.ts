export type PenugasanRow = {
    id: number | string;
    status: string;
    nama_balai: string;
    nama_ppk: string;
    jabatan_ppk: string;
    kode_rup: string;
}

export type ApiPenugasanListResponse = {
    data: PenugasanRow[];
}

export type ColumnDef<T extends object> = {
  key: keyof T | string;
  header: string | React.ReactNode;
  className?: string;
  cell?: (row: T, rowIndex: number) => React.ReactNode;
};