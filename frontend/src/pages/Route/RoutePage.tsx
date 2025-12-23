import {
    Box,
    Button,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useEffect, useState} from "react";
import {Location} from "../../types/location";
import {Route, SearchRouteRequest} from "../../types/route";
import {locationService} from "../../services/locationService";
import {routeService} from "../../services/routeService";
import dayjs, {Dayjs} from "dayjs";

export default function RoutePage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [originCode, setOriginCode] = useState<string>("");
    const [destinationCode, setDestinationCode] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await locationService.getAll({page: 0, size: 100});
            setLocations(response.content);
        } catch (error) {
            console.error("Failed to fetch locations", error);
        }
    };

    const handleSearch = async () => {
        if (!originCode || !destinationCode || !selectedDate) {
            return;
        }

        setLoading(true);
        try {
            const request: SearchRouteRequest = {
                originCode: originCode,
                destinationCode: destinationCode,
                date: selectedDate.toISOString(),
            };
            const results = await routeService.searchRoutes(request);
            setRoutes(results);
        } catch (error) {
            console.error("Failed to search routes", error);
            setRoutes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOriginChange = (event: SelectChangeEvent) => {
        setOriginCode(event.target.value);
    };

    const handleDestinationChange = (event: SelectChangeEvent) => {
        setDestinationCode(event.target.value);
    };

    const getTransportationIcon = (type: string) => {
        switch (type) {
            case "FLIGHT":
                return "✈️";
            case "BUS":
                return "🚌";
            case "SUBWAY":
                return "🚇";
            case "UBER":
                return "🚗";
            default:
                return "🚶";
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                {/* Header Section */}
                <Box sx={{p: 2, borderBottom: 1, borderColor: "divider", mb: 3}}>
                    <Typography variant="h5" sx={{mb: 0}}>
                        HEADER
                    </Typography>
                </Box>

                <Box sx={{px: 3}}>
                    <Box sx={{display: "flex", gap: 2, alignItems: "center", mb: 3}}>
                        {/* Origin */}
                        <FormControl sx={{minWidth: 200}}>
                            <InputLabel>Origin</InputLabel>
                            <Select value={originCode} label="Origin" onChange={handleOriginChange}>
                                {locations.map((location) => (
                                    <MenuItem key={location.id} value={location.locationCode}>
                                        {location.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Destination */}
                        <FormControl sx={{minWidth: 200}}>
                            <InputLabel>Destination</InputLabel>
                            <Select
                                value={destinationCode}
                                label="Destination"
                                onChange={handleDestinationChange}
                            >
                                {locations.map((location) => (
                                    <MenuItem key={location.id} value={location.locationCode}>
                                        {location.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Date Picker */}
                        <DatePicker
                            label="Date"
                            value={selectedDate}
                            onChange={(newValue: Dayjs | null) => setSelectedDate(newValue)}
                            slotProps={{textField: {sx: {minWidth: 200}}}}
                        />

                        {/* Search Button */}
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            disabled={!originCode || !destinationCode || !selectedDate || loading}
                        >
                            Search
                        </Button>
                    </Box>

                    {/* Available Routes */}
                    {routes.length > 0 && (
                        <Paper sx={{p: 2, mt: 3}}>
                            <Typography variant="h6" gutterBottom>
                                Available Routes
                            </Typography>
                            <List>
                                {routes.map((route, index) => (
                                    <ListItem key={index} sx={{flexDirection: "column", alignItems: "flex-start"}}>
                                        <ListItemText
                                            primary={`Via ${route.steps
                                                .map((step) => step.destination.name)
                                                .join(" → ")}`}
                                            secondary={route.steps
                                                .map(
                                                    (step) =>
                                                        `${getTransportationIcon(step.transportationType)} ${
                                                            step.transportationType
                                                        }: ${step.origin.name} → ${step.destination.name}`
                                                )
                                                .join(" | ")}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Box>
            </Box>
        </LocalizationProvider>
    );
}

