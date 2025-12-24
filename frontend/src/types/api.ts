export interface PaginatedRequest {
    page: number;
    size: number;
    sort: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    last: boolean;
}
