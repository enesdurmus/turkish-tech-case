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
            const response = await locationService.getAllCodes({page, size: 20, sort: "locationCode,asc"});
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
            const response = await locationService.getAllCodes({page, size: 20, sort: "locationCode,asc"});
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
        {field: "origin", headerName: "Origin", width: 150, valueGetter: (_v, row) => row.origin?.name || ''},
        {field: "destination", headerName: "Destination", width: 150, valueGetter: (_v, row) => row.destination?.name || ''},
        {field: "transportationType", headerName: "Type", width: 130, valueFormatter: (value) => (value as string)?.replace('_', ' ') || ''},
        {
            field: "operatingDays", headerName: "Operating Days", width: 200,
            valueGetter: (_v, row) => {
                const days = row.operatingDays;
                if (!days || !Array.isArray(days) || days.length === 0) return '';
                return [...days].sort((a, b) => a - b).map(d => DAYS_OF_WEEK_SHORT[d] || '').join(', ');
            },
        },
        {field: "createdAt", headerName: "Created At", width: 180, type: 'dateTime', valueGetter: (value) => value && new Date(value)},
        {field: "updatedAt", headerName: "Updated At", width: 180, type: 'dateTime', valueGetter: (value) => value && new Date(value)},
    ];
    return (
        <>
            <Typography variant="h4" gutterBottom>Transportation</Typography>
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
                formFields={(formData, onChange) => (
                    <Box sx={{minWidth: 300}}>
                        <Autocomplete
                            options={originCodes}
                            value={formData.originCode || null}
                            onChange={(_e, newValue) => onChange({...formData, originCode: newValue || ''})}
                            loading={originLoading}
                            ListboxProps={{onScroll: handleOriginScroll}}
                            renderInput={(params) => (
                                <TextField {...params} autoFocus margin="dense" label="Origin Code"
                                    InputProps={{...params.InputProps,
                                        endAdornment: <>{originLoading ? <CircularProgress size={20}/> : null}{params.InputProps.endAdornment}</>}}/>
                            )}
                        />
                        <Autocomplete
                            options={destinationCodes}
                            value={formData.destinationCode || null}
                            onChange={(_e, newValue) => onChange({...formData, destinationCode: newValue || ''})}
                            loading={destinationLoading}
                            ListboxProps={{onScroll: handleDestinationScroll}}
                            renderInput={(params) => (
                                <TextField {...params} margin="dense" label="Destination Code"
                                    InputProps={{...params.InputProps,
                                        endAdornment: <>{destinationLoading ? <CircularProgress size={20}/> : null}{params.InputProps.endAdornment}</>}}/>
                            )}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Transportation Type</InputLabel>
                            <Select value={formData.transportationType} label="Transportation Type"
                                onChange={(e) => onChange({...formData, transportationType: e.target.value as TransportationType})}>
                                {Object.values(TransportationType).map((type) => (
                                    <MenuItem key={type} value={type}>{type.replace('_', ' ')}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography variant="subtitle1" sx={{mt: 1}}>Operating Days</Typography>
                        <FormGroup row>
                            {DAYS_OF_WEEK_SHORT.map((day, index) => (
                                <FormControlLabel key={day}
                                    control={<Checkbox checked={(formData.operatingDays || []).includes(index)}
                                        onChange={(e) => {
                                            const currentDays = formData.operatingDays || [];
                                            const newDays = e.target.checked ?
                                                [...currentDays, index].sort((a, b) => a - b) :
                                                currentDays.filter((d) => d !== index);
                                            onChange({...formData, operatingDays: newDays});
                                        }}/>}
                                    label={day}/>
                            ))}
                        </FormGroup>
                    </Box>
                )}
                getNewFormData={() => ({originCode: '', destinationCode: '', transportationType: TransportationType.BUS, operatingDays: []})}
                toFormData={(t) => ({
                    originCode: t.origin?.locationCode || '',
                    destinationCode: t.destination?.locationCode || '',
                    transportationType: t.transportationType,
                    operatingDays: t.operatingDays || [],
                })}
                entityName="Transportation"
            />
        </>
    );
}