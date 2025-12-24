import {useCallback, useEffect, useState} from "react";
import {GridPaginationModel} from "@mui/x-data-grid";
import {PaginatedRequest, PaginatedResponse} from "../types/api";
import {DEFAULT_PAGE_SIZE} from "../constants";

interface CrudService<T, TFormData> {
    getAll: (params: PaginatedRequest) => Promise<PaginatedResponse<T>>;
    create: (data: TFormData) => Promise<T>;
    update: (id: string | number, data: TFormData) => Promise<T>;
    delete: (id: string | number) => Promise<void>;
}

export function useCrudOperations<T, TFormData>(service: CrudService<T, TFormData>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: DEFAULT_PAGE_SIZE,
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await service.getAll({
                page: paginationModel.page,
                size: paginationModel.pageSize,
                sort: "id,desc",
            });
            setData(response.content);
            setRowCount(response.totalElements);
        } finally {
            setLoading(false);
        }
    }, [paginationModel, service]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreate = async (formData: TFormData) => {
        await service.create(formData);
        await fetchData();
    };

    const handleUpdate = async (id: string | number, formData: TFormData) => {
        await service.update(id, formData);
        await fetchData();
    };

    const handleDelete = async (id: string | number) => {
        await service.delete(id);
        await fetchData();
    };

    return {
        data,
        loading,
        rowCount,
        paginationModel,
        setPaginationModel,
        handleCreate,
        handleUpdate,
        handleDelete,
    };
}

