import {GridColDef} from "@mui/x-data-grid";
import {
    Autocomplete,
    Box,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import CrudGrid from "../../components/CrudGrid";
import {Transportation, TransportationFormData, TransportationType} from "../../types/transportation";
import {transportationService} from "../../services/transportationService";
import {locationService} from "../../services/locationService";
import {useCrudOperations} from "../../hooks/useCrudOperations";
import {DAYS_OF_WEEK_SHORT} from "../../constants";
import {useCallback, useEffect, useState} from "react";

export default function TransportationPage() {
    const {
        data,
        loading,
        rowCount,
        paginationModel,
        setPaginationModel,
        handleCreate,
        handleUpdate,
        handleDelete,
    } = useCrudOperations<Transportation, TransportationFormData>(transportationService);

    const [originCodes, setOriginCodes] = useState<string[]>([]);
    const [destinationCodes, setDestinationCodes] = useState<string[]>([]);
    const [originLoading, setOriginLoading] = useState(false);
    const [destinationLoading, setDestinationLoading] = useState(false);
    const [originPage, setOriginPage] = useState(0);
    const [destinationPage, setDestinationPage] = useState(0);
    const [originHasMore, setOriginHasMore] = useState(true);
    const [destinationHasMore, setDestinationHasMore] = useState(true);

    const loadOriginCodes = useCallback(async (page: number) => {
        if (originLoading || !originHasMore) return;

        setOriginLoading(true);
        try {
            const response = await locationService.getAllCodes({page, size: 20});
            setOriginCodes(prev => page === 0 ? response.content : [...prev, ...response.content]);
            setOriginHasMore(!response.last);
        } catch (error) {
            console.error("Failed to load origin codes:", error);
        } finally {
            setOriginLoading(false);
        }
    }, [originLoading, originHasMore]);

    const loadDestinationCodes = useCallback(async (page: number) => {
        if (destinationLoading || !destinationHasMore) return;

        setDestinationLoading(true);
        try {
            const response = await locationService.getAllCodes({page, size: 20});
            setDestinationCodes(prev => page === 0 ? response.content : [...prev, ...response.content]);
            setDestinationHasMore(!response.last);
        } catch (error) {
            console.error("Failed to load destination codes:", error);
        } finally {
            setDestinationLoading(false);
        }
    }, [destinationLoading, destinationHasMore]);

    useEffect(() => {
        loadOriginCodes(0);
        loadDestinationCodes(0);
    }, []);

    const handleOriginScroll = useCallback((event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget as HTMLUListElement;
        if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 50) {
            if (originHasMore && !originLoading) {
                const nextPage = originPage + 1;
                setOriginPage(nextPage);
                loadOriginCodes(nextPage);
            }
        }
    }, [originHasMore, originLoading, originPage, loadOriginCodes]);

    const handleDestinationScroll = useCallback((event: React.SyntheticEvent) => {
        const listboxNode = event.currentTarget as HTMLUListElement;
        if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 50) {
            if (destinationHasMore && !destinationLoading) {
                const nextPage = destinationPage + 1;
                setDestinationPage(nextPage);
                loadDestinationCodes(nextPage);
            }
        }
    }, [destinationHasMore, destinationLoading, destinationPage, loadDestinationCodes]);

    const columns: GridColDef[] = [
        {
            field: "origin",
            headerName: "Origin",
            width: 150,
            valueGetter: (_value, row) => row.origin?.name || '',
        },
        {
            field: "destination",
            headerName: "Destination",
            width: 150,
            valueGetter: (_value, row) => row.destination?.name || '',
        },
        {
            field: "transportationType",
            headerName: "Type",
            width: 130,
            valueFormatter: (value) => (value as string)?.replace('_', ' ') || '',
        },
        {
            field: "operatingDays",
            headerName: "Operating Days",
            width: 200,
            valueGetter: (_value, row) => {
                const days = row.operatingDays;
                if (!days || !Array.isArray(days) || days.length === 0) {
                    return '';
                }
                const sortedDays = [...days].sort((a, b) => a - b);
                return sortedDays
                    .map(dayNum => DAYS_OF_WEEK_SHORT[dayNum] || '')
                    .join(', ');
            },
        },
        {
            field: "createdAt",
            headerName: "Created At",
            width: 180,
            type: 'dateTime',
            valueGetter: (value) => value && new Date(value),
        },
        {
            field: "updatedAt",
            headerName: "Updated At",
            width: 180,
            type: 'dateTime',
            valueGetter: (value) => value && new Date(value),
        },
    ];

    const transportationFormFields = (
        formData: TransportationFormData,
        onChange: (data: TransportationFormData) => void
    ) => (
        <Box sx={{minWidth: 300}}>
            <Autocomplete
                options={originCodes}
                value={formData.originCode || null}
                onChange={(_event, newValue) => onChange({...formData, originCode: newValue || ''})}
                loading={originLoading}
                freeSolo={false}
                disableClearable={false}
                disablePortal
                slotProps={{
                    listbox: {
                        onScroll: handleOriginScroll,
                    },
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        autoFocus
                        margin="dense"
                        label="Origin Code"
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {originLoading ? <CircularProgress color="inherit" size={20}/> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            },
                        }}
                    />
                )}
            />

            <Autocomplete
                options={destinationCodes}
                value={formData.destinationCode || null}
                onChange={(_event, newValue) => onChange({...formData, destinationCode: newValue || ''})}
                loading={destinationLoading}
                freeSolo={false}
                disableClearable={false}
                disablePortal
                slotProps={{
                    listbox: {
                        onScroll: handleDestinationScroll,
                    },
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        margin="dense"
                        label="Destination Code"
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {destinationLoading ? <CircularProgress color="inherit" size={20}/> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            },
                        }}
                    />
                )}
            />

            <FormControl fullWidth margin="dense">
                <InputLabel>Transportation Type</InputLabel>
                <Select
                    value={formData.transportationType}
                    label="Transportation Type"
                    onChange={(e) => onChange({...formData, transportationType: e.target.value as TransportationType})}
                >
                    {Object.values(TransportationType).map((type) => (
                        <MenuItem key={type} value={type}>
                            {type.replace('_', ' ')}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl component="fieldset" margin="dense" fullWidth>
                <Typography variant="subtitle1" sx={{mt: 1}}>Operating Days</Typography>
                <FormGroup row>
                    {DAYS_OF_WEEK_SHORT.map((day, index) => {
                        const dayValue = index; // 0=Sun, 1=Mon, ..., 6=Sat
                        return (
                            <FormControlLabel
                                key={day}
                                control={
                                    <Checkbox
                                        checked={(formData.operatingDays || []).includes(dayValue)}
                                        onChange={(e) => {
                                            const currentDays = formData.operatingDays || [];
                                            let newOperatingDays: number[];
                                            if (e.target.checked) {
                                                newOperatingDays = [...currentDays, dayValue].sort((a, b) => a - b);
                                            } else {
                                                newOperatingDays = currentDays.filter((d) => d !== dayValue);
                                            }
                                            onChange({...formData, operatingDays: newOperatingDays});
                                        }}
                                    />
                                }
                                label={day}
                            />
                        );
                    })}
                </FormGroup>
            </FormControl>
        </Box>
    );

    const getNewFormData = (): TransportationFormData => ({
        originCode: '',
        destinationCode: '',
        transportationType: TransportationType.BUS,
        operatingDays: [],
    });

    const toFormData = (transportation: Transportation): TransportationFormData => ({
        originCode: transportation.origin?.locationCode || '',
        destinationCode: transportation.destination?.locationCode || '',
        transportationType: transportation.transportationType,
        operatingDays: transportation.operatingDays || [],
    });

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Transportation
            </Typography>
            <CrudGrid<Transportation, TransportationFormData>
                data={data}
                columns={columns}
                rowCount={rowCount}
                loading={loading}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onAdd={handleCreate}
                onUpdate={(id, formData) => handleUpdate(Number(id), formData)}
                onDelete={(id) => handleDelete(Number(id))}
                formFields={transportationFormFields}
                getNewFormData={getNewFormData}
                toFormData={toFormData}
                entityName="Transportation"
            />
        </>
    );
}