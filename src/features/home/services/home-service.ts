import { apiClient } from "@/lib";
import type { ApiResponse } from "@/types";

interface HomeData {
  greeting: string;
}

export const homeService = {
  getData: () =>
    apiClient.get<ApiResponse<HomeData>>("/home"),
};
