export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data: T;
  timestamp?: string;
  path?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
