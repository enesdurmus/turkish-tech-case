import { useCallback, useEffect, useState } from "react";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Typography, TextField, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel, FormGroup, Box } from "@mui/material";
import CrudGrid from "../../components/CrudGrid";
import {
  Transportation,
  getTransportations,
  addTransportation,
  updateTransportation,
  deleteTransportation,
  TransportationType,
  TransportationPayload,
} from "./transportationService";
import { Location } from "../Location/locationService";

export default function TransportationPage() {
  const [data, setData] = useState<Transportation[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTransportations({
        page: paginationModel.page,
        size: paginationModel.pageSize,
      });
      setData(response.content);
      setRowCount(response.totalElements);
    } catch (error) {
      // console.error("Failed to fetch transportations:", error); // Removed
    } finally {
      setLoading(false);
    }
  }, [paginationModel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: GridColDef[] = [
    { 
        field: "origin", 
        headerName: "Origin", 
        width: 150, 
        valueGetter: (value, row) => row.origin?.name || '',
    },
    { 
        field: "destination", 
        headerName: "Destination", 
        width: 150, 
        valueGetter: (value, row) => row.destination?.name || '',
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
        valueFormatter: (value) => (value as number[])?.map(dayNum => {
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return days[dayNum];
        }).join(', ') || '',
    },
    { field: "createdAt", headerName: "Created At", width: 180, type: 'dateTime', valueGetter: (value) => value && new Date(value), editable: false },
    { field: "updatedAt", headerName: "Updated At", width: 180, type: 'dateTime', valueGetter: (value) => value && new Date(value), editable: false },
  ];

  const handleAdd = async (item: any) => {
    try {
      const payload: TransportationPayload = {
        originCode: item.origin.locationCode,
        destinationCode: item.destination.locationCode,
        transportationType: item.transportationType,
        operatingDays: item.operatingDays,
      };
      await addTransportation(payload);
      fetchData();
    } catch (error) {
      // console.error("Failed to add route:", error); // Removed
    }
  };

  const handleUpdate = async (item: any) => {
    try {
        const payload: TransportationPayload = {
            originCode: item.origin.locationCode,
            destinationCode: item.destination.locationCode,
            transportationType: item.transportationType,
            operatingDays: item.operatingDays,
        };
      await updateTransportation(item.id, payload);
      fetchData();
    } catch (error) {
      // console.error("Failed to update route:", error); // Removed
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransportation(id);
      fetchData();
    } catch (error) {
      // console.error("Failed to delete route:", error); // Removed
    }
  };

  const transportationFormFields = (trans: any) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const handleOperatingDaysChange = (dayIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        trans.operatingDays = [...(trans.operatingDays || []), dayIndex].sort((a, b) => a - b);
      } else {
        trans.operatingDays = (trans.operatingDays || []).filter((day) => day !== dayIndex);
      }
    };

    return (
      <Box sx={{ minWidth: 300 }}>
        <TextField
            autoFocus
            margin="dense"
            label="Origin Code"
            type="text"
            fullWidth
            defaultValue={trans.origin?.locationCode || ''}
            onChange={(e) => trans.originCode = e.target.value}
        />
        <TextField
            margin="dense"
            label="Destination Code"
            type="text"
            fullWidth
            defaultValue={trans.destination?.locationCode || ''}
            onChange={(e) => trans.destinationCode = e.target.value}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Transportation Type</InputLabel>
          <Select
            value={trans.transportationType || ''}
            label="Transportation Type"
            onChange={(e) => (trans.transportationType = e.target.value as TransportationType)}
          >
            {Object.values(TransportationType).map((type) => (
              <MenuItem key={type} value={type}>
                {type.replace('_', ' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl component="fieldset" margin="dense" fullWidth>
            <Typography variant="subtitle1">Operating Days</Typography>
            <FormGroup row>
                {daysOfWeek.map((day, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Checkbox
                                defaultChecked={(trans.operatingDays || []).includes(index)}
                                onChange={handleOperatingDaysChange(index)}
                            />
                        }
                        label={day}
                    />
                ))}
            </FormGroup>
        </FormControl>
      </Box>
    );
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Routes
      </Typography>
      <CrudGrid<Transportation>
        data={data}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        formFields={transportationFormFields}
        getNewItem={() => ({ 
          id: 0, 
          origin: null, 
          destination: null, 
          transportationType: TransportationType.BUS, 
          operatingDays: [],
          createdAt: '',
          updatedAt: '',
        } as unknown as Transportation)}
        entityName="Route"
      />
    </>
  );
}