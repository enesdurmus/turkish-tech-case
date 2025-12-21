import { useCallback, useEffect, useState } from "react";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Typography, TextField } from "@mui/material";
import CrudGrid from "../../components/CrudGrid";
import {
  Location,
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation,
} from "./locationService";

export default function LocationPage() {
  const [data, setData] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getLocations({
        page: paginationModel.page,
        size: paginationModel.pageSize,
      });
      setData(response.content);
      setRowCount(response.totalElements);
    } catch (error) {
      // console.error("Failed to fetch locations:", error);
    } finally {
      setLoading(false);
    }
  }, [paginationModel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 150, editable: true },
    { field: "country", headerName: "Country", width: 120, editable: true },
    { field: "city", headerName: "City", width: 120, editable: true },
    { field: "locationCode", headerName: "Code", width: 100, editable: true },
    { field: "createdAt", headerName: "Created At", width: 180, type: 'dateTime', valueGetter: (value) => value && new Date(value), editable: false },
    { field: "updatedAt", headerName: "Updated At", width: 180, type: 'dateTime', valueGetter: (value) => value && new Date(value), editable: false },
  ];

  const handleAdd = async (newItem: Omit<Location, "id" | "createdAt" | "updatedAt">) => {
    try {
      await addLocation(newItem);
      fetchData();
    } catch (error) {
      // console.error("Failed to add location:", error);
    }
  };

  const handleUpdate = async (updatedItem: Location) => {
    try {
      await updateLocation(updatedItem);
      fetchData();
    } catch (error) {
      // console.error("Failed to update location:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteLocation(String(id));
      fetchData();
    } catch (error) {
      // console.error("Failed to delete location:", error);
    }
  };
  
  const locationFormFields = (location: Location) => (
    <>
      <TextField
        autoFocus
        margin="dense"
        label="Name"
        name="name"
        type="text"
        fullWidth
        defaultValue={location.name || ''}
        onChange={(e) => (location.name = e.target.value)}
      />
      <TextField
        margin="dense"
        label="Country"
        name="country"
        type="text"
        fullWidth
        defaultValue={location.country || ''}
        onChange={(e) => (location.country = e.target.value)}
      />
      <TextField
        margin="dense"
        label="City"
        name="city"
        type="text"
        fullWidth
        defaultValue={location.city || ''}
        onChange={(e) => (location.city = e.target.value)}
      />
      <TextField
        margin="dense"
        label="Location Code"
        name="locationCode"
        type="text"
        fullWidth
        defaultValue={location.locationCode || ''}
        onChange={(e) => (location.locationCode = e.target.value)}
      />
    </>
  );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Locations
      </Typography>
      <CrudGrid<Location>
        data={data}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        formFields={locationFormFields}
        getNewItem={() => ({ 
          id: '', 
          name: '', 
          country: '', 
          city: '', 
          locationCode: '',
          createdAt: '',
          updatedAt: '',
        })}
        entityName="Location"
      />
    </>
  );
}