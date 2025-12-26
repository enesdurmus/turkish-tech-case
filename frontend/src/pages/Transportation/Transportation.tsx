import {GridColDef} from "@mui/x-data-grid";
import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import {useCallback, useEffect, useRef, useState} from "react";
import CrudGrid from "../../components/CrudGrid";
import InfiniteScrollableSelect from "../../components/InfiniteScrollableSelect";
import {Transportation, TransportationFormData, TransportationType} from "../../types/transportation";
import {transportationService} from "../../services/transportationService";
import {locationService} from "../../services/locationService";
import {useCrudOperations} from "../../hooks/useCrudOperations";
import {DAYS_OF_WEEK_SHORT} from "../../constants";

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

    const [locationCodes, setLocationCodes] = useState<string[]>([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationHasMore, setLocationHasMore] = useState(true);
    const locationPageRef = useRef(0);
    const locationLoadingRef = useRef(false);

    const loadLocationCodes = useCallback(async () => {
        if (locationLoadingRef.current || !locationHasMore) return;

        locationLoadingRef.current = true;
        setLocationLoading(true);
        try {
            const response = await locationService.getAllCodes({
                page: locationPageRef.current,
                size: 10,
                sort: "locationCode,asc"
            });
            setLocationCodes(prev =>
                locationPageRef.current === 0 ? response.content : [...prev, ...response.content]
            );
            setLocationHasMore(!response.last);
            locationPageRef.current++;
        } catch (error) {
            console.error("Failed to load location codes:", error);
        } finally {
            locationLoadingRef.current = false;
            setLocationLoading(false);
        }
    }, [locationHasMore]);

    useEffect(() => {
        if (locationCodes.length === 0) {
            loadLocationCodes();
        }
    }, [locationCodes.length, loadLocationCodes]);


    const columns: GridColDef[] = [
        {field: "origin", headerName: "Origin", width: 150, valueGetter: (_v, row) => row.origin?.name || ''},
        {
            field: "destination",
            headerName: "Destination",
            width: 150,
            valueGetter: (_v, row) => row.destination?.name || ''
        },
        {
            field: "transportationType",
            headerName: "Type",
            width: 130,
            valueFormatter: (value) => (value as string)?.replace('_', ' ') || ''
        },
        {
            field: "operatingDays", headerName: "Operating Days", width: 200,
            valueGetter: (_v, row) => {
                const days = row.operatingDays;
                if (!days || !Array.isArray(days) || days.length === 0) return '';
                return [...days].sort((a, b) => a - b).map(d => DAYS_OF_WEEK_SHORT[d] || '').join(', ');
            },
        },
        {
            field: "createdAt",
            headerName: "Created At",
            width: 180,
            type: 'dateTime',
            valueGetter: (value) => value && new Date(value)
        },
        {
            field: "updatedAt",
            headerName: "Updated At",
            width: 180,
            type: 'dateTime',
            valueGetter: (value) => value && new Date(value)
        },
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
                        <InfiniteScrollableSelect
                            value={formData.originCode || null}
                            onChange={(value) => onChange({...formData, originCode: value})}
                            label="Origin Code"
                            options={locationCodes}
                            loading={locationLoading}
                            onLoadMore={loadLocationCodes}
                            hasMore={locationHasMore}
                            autoFocus={true}
                        />
                        <InfiniteScrollableSelect
                            value={formData.destinationCode || null}
                            onChange={(value) => onChange({...formData, destinationCode: value})}
                            label="Destination Code"
                            options={locationCodes}
                            loading={locationLoading}
                            onLoadMore={loadLocationCodes}
                            hasMore={locationHasMore}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Transportation Type</InputLabel>
                            <Select value={formData.transportationType} label="Transportation Type"
                                    onChange={(e) => onChange({
                                        ...formData,
                                        transportationType: e.target.value as TransportationType
                                    })}>
                                {Object.values(TransportationType).map((type) => (
                                    <MenuItem key={type} value={type}>{type.replace('_', ' ')}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography variant="subtitle1" sx={{mt: 1}}>Operating Days</Typography>
                        <FormGroup row>
                            {DAYS_OF_WEEK_SHORT.map((day, index) => (
                                <FormControlLabel key={day}
                                                  control={<Checkbox
                                                      checked={(formData.operatingDays || []).includes(index)}
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
                getNewFormData={() => ({
                    originCode: '',
                    destinationCode: '',
                    transportationType: TransportationType.BUS,
                    operatingDays: []
                })}
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