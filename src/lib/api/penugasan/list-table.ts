import { http } from "@lib/api/https";
import { ENDPOINTS } from "@constants/endpoints";
import type {
  ApiPenugasanListResponse,
  PenugasanRow,
} from "../../../types/penugasan/penugasan-list";

export async function getPenugasanList(): Promise<PenugasanRow[]> {
  const { data } = await http.get<ApiPenugasanListResponse>(
    ENDPOINTS.getListPengumpulan
  );
  return data?.data ?? [];
}
