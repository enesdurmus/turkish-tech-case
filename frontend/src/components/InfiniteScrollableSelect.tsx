import {Autocomplete, CircularProgress, TextField} from "@mui/material";
import {useCallback} from "react";

interface InfiniteScrollableSelectProps<T> {
    value: string | null;
    onChange: (value: string) => void;
    label: string;
    options: T[];
    loading: boolean;
    onLoadMore: () => void;
    hasMore: boolean;
    autoFocus?: boolean;
    sx?: object;
    getOptionLabel?: (option: T) => string;
    getOptionValue?: (option: T) => string;
}

export default function InfiniteScrollableSelect<T = string>({
                                                                 value,
                                                                 onChange,
                                                                 label,
                                                                 options,
                                                                 loading,
                                                                 onLoadMore,
                                                                 hasMore,
                                                                 autoFocus = false,
                                                                 sx,
                                                                 getOptionLabel,
                                                                 getOptionValue
                                                             }: InfiniteScrollableSelectProps<T>) {

    const handleScroll = useCallback((event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget as HTMLUListElement;
        const scrollTop = listboxNode.scrollTop;
        const scrollHeight = listboxNode.scrollHeight;
        const clientHeight = listboxNode.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 10) {
            if (hasMore && !loading) {
                onLoadMore();
            }
        }
    }, [onLoadMore, hasMore, loading]);

    const getLabel = (option: T): string => {
        if (getOptionLabel) return getOptionLabel(option);
        return option as unknown as string;
    };

    const getValue = (option: T): string => {
        if (getOptionValue) return getOptionValue(option);
        return option as unknown as string;
    };

    const selectedOption = options.find(opt => getValue(opt) === value) || null;

    return (
        <Autocomplete
            sx={sx}
            options={options}
            value={selectedOption}
            onChange={(_e, newValue) => onChange(newValue ? getValue(newValue) : '')}
            getOptionLabel={getLabel}
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

