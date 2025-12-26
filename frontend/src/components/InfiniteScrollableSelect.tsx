import {Autocomplete, CircularProgress, TextField} from "@mui/material";
import {useCallback, useEffect, useRef, useState} from "react";
import {PaginatedRequest, PaginatedResponse} from "../types/api";

interface InfiniteScrollableSelectProps {
    value: string | null;
    onChange: (value: string) => void;
    label: string;
    loadData: (params: PaginatedRequest) => Promise<PaginatedResponse<string>>;
    pageSize?: number;
    sort?: string;
    autoFocus?: boolean;
    sx?: object;
}

export default function InfiniteScrollableSelect({
                                                     value,
                                                     onChange,
                                                     label,
                                                     loadData,
                                                     pageSize = 50,
                                                     sort = "id,asc",
                                                     autoFocus = false,
                                                     sx
                                                 }: InfiniteScrollableSelectProps) {
    const [options, setOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const pageRef = useRef(0);
    const hasMoreRef = useRef(true);
    const loadingRef = useRef(false);

    const loadOptions = useCallback(async (page: number) => {
        if (loadingRef.current || !hasMoreRef.current) return;

        loadingRef.current = true;
        setLoading(true);
        try {
            const response = await loadData({page, size: pageSize, sort});
            setOptions(prev => page === 0 ? response.content : [...prev, ...response.content]);
            hasMoreRef.current = !response.last;
            pageRef.current = page;
        } catch (error) {
            console.error(`Failed to load ${label} options:`, error);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [loadData, pageSize, sort, label]);

    useEffect(() => {
        loadOptions(0);
    }, [loadOptions]);

    const handleScroll = useCallback((event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget as HTMLUListElement;
        const scrollTop = listboxNode.scrollTop;
        const scrollHeight = listboxNode.scrollHeight;
        const clientHeight = listboxNode.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 10) {
            if (hasMoreRef.current && !loadingRef.current) {
                const nextPage = pageRef.current + 1;
                loadOptions(nextPage);
            }
        }
    }, [loadOptions, label]);

    return (
        <Autocomplete
            sx={sx}
            options={options}
            value={value}
            onChange={(_e, newValue) => onChange(newValue || '')}
            loading={loading}
            slotProps={{
                listbox: {
                    onScroll: handleScroll,
                    style: {maxHeight: '200px'}
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    autoFocus={autoFocus}
                    label={label}
                    margin="dense"
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress size={20}/> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }
                    }}
                />
            )}
        />
    );
}


