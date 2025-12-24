import {GridColDef} from "@mui/x-data-grid";
import {TextField, Typography} from "@mui/material";
import CrudGrid from "../../components/CrudGrid";
import {Location, LocationFormData} from "../../types/location";
import {locationService} from "../../services/locationService";
import {useCrudOperations} from "../../hooks/useCrudOperations";

export default function LocationPage() {
    const {data, loading, rowCount, paginationModel, setPaginationModel, handleCreate, handleUpdate, handleDelete} =
        useCrudOperations<Location, LocationFormData>(locationService);

    const columns: GridColDef[] = [
        {field: "name", headerName: "Name", width: 150},
        {field: "country", headerName: "Country", width: 120},
        {field: "city", headerName: "City", width: 120},
        {field: "locationCode", headerName: "Code", width: 100},
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
            <Typography variant="h4" gutterBottom>Locations</Typography>
            <CrudGrid<Location, LocationFormData>
                data={data}
                columns={columns}
                rowCount={rowCount}
                loading={loading}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onAdd={handleCreate}
                onUpdate={(id, formData) => handleUpdate(String(id), formData)}
                onDelete={(id) => handleDelete(String(id))}
                formFields={(formData, onChange) => (
                    <>
                        <TextField autoFocus margin="dense" label="Name" fullWidth value={formData.name}
                                   onChange={(e) => onChange({...formData, name: e.target.value})}/>
                        <TextField margin="dense" label="Country" fullWidth value={formData.country}
                                   onChange={(e) => onChange({...formData, country: e.target.value})}/>
                        <TextField margin="dense" label="City" fullWidth value={formData.city}
                                   onChange={(e) => onChange({...formData, city: e.target.value})}/>
                        <TextField margin="dense" label="Location Code" fullWidth value={formData.locationCode}
                                   onChange={(e) => onChange({...formData, locationCode: e.target.value})}/>
                    </>
                )}
                getNewFormData={() => ({name: '', country: '', city: '', locationCode: ''})}
                toFormData={(location) => ({
                    name: location.name,
                    country: location.country,
                    city: location.city,
                    locationCode: location.locationCode,
                })}
                entityName="Location"
            />
        </>
    );
}