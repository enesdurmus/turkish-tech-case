import {
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Paper,
    SelectChangeEvent,
    Radio,
    RadioGroup,
    FormControlLabel,
} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useState, useEffect} from "react";
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
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);

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
        setSelectedRouteIndex(null);
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

    const handleRouteSelect = (index: number) => {
        setSelectedRouteIndex(index);
    };

    const handleCloseDrawer = () => {
        setSelectedRouteIndex(null);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{display: "flex", flexDirection: "column", height: "100vh"}}>
                {/* Full Width Header */}
                <Paper
                    elevation={1}
                    sx={{
                        width: "100%",
                        p: 2,
                        borderRadius: 0,
                        borderBottom: 2,
                        borderColor: "divider",
                    }}
                >
                    <Typography variant="h5" sx={{mb: 2, fontWeight: 600}}>
                        HEADER
                    </Typography>

                    <Box sx={{display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap"}}>
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
                            sx={{height: 56}}
                        >
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </Box>

                    {/* Day Headers */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: 2,
                            justifyContent: "flex-start",
                            borderTop: 1,
                            borderColor: "divider",
                            pt: 1,
                        }}
                    >
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                            <Typography
                                key={day}
                                variant="body2"
                                sx={{minWidth: 40, textAlign: "center", fontWeight: 500}}
                            >
                                {day}
                            </Typography>
                        ))}
                    </Box>
                </Paper>

                {/* Main Content Area with Split Layout */}
                <Box sx={{display: "flex", flex: 1, overflow: "hidden"}}>
                    {/* Left Side - Routes List */}
                    <Box sx={{
                        flex: 1,
                        p: 3,
                        overflow: "auto",
                        borderRight: selectedRouteIndex !== null ? 1 : 0,
                        borderColor: "divider"
                    }}>
                        {routes.length > 0 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{mb: 2}}>
                                    Available Routes
                                </Typography>
                                <RadioGroup value={selectedRouteIndex?.toString() || ""}>
                                    {routes.map((route, index) => (
                                        <Paper
                                            key={index}
                                            sx={{
                                                p: 2,
                                                mb: 2,
                                                cursor: "pointer",
                                                border: selectedRouteIndex === index ? 2 : 1,
                                                borderColor:
                                                    selectedRouteIndex === index ? "primary.main" : "divider",
                                                "&:hover": {
                                                    bgcolor: "action.hover",
                                                },
                                            }}
                                            onClick={() => handleRouteSelect(index)}
                                        >
                                            <FormControlLabel
                                                value={index.toString()}
                                                control={<Radio/>}
                                                label={
                                                    <Box sx={{ml: 1}}>
                                                        <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                                                            Via {route.steps
                                                            .map((step) => step.destination.name)
                                                            .join(" → ")}
                                                        </Typography>
                                                        <Box sx={{display: "flex", gap: 1, flexWrap: "wrap", mt: 1}}>
                                                            {route.steps.map((step, stepIndex) => (
                                                                <Typography
                                                                    key={stepIndex}
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {getTransportationIcon(step.transportationType)}{" "}
                                                                    {step.transportationType.replace("_", " ")}
                                                                    {stepIndex < route.steps.length - 1 && " →"}
                                                                </Typography>
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                        </Paper>
                                    ))}
                                </RadioGroup>
                            </Box>
                        )}

                        {routes.length === 0 && !loading && originCode && destinationCode && (
                            <Typography variant="body1" color="text.secondary" sx={{textAlign: "center", mt: 4}}>
                                No routes found. Try different locations or dates.
                            </Typography>
                        )}
                    </Box>

                    {/* Right Side - Route Details Panel */}
                    {selectedRouteIndex !== null && routes[selectedRouteIndex] && (
                        <Box
                            sx={{
                                width: 350,
                                p: 3,
                                bgcolor: "background.paper",
                                overflow: "auto",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 3,
                                }}
                            >
                                <Typography variant="h6" sx={{fontWeight: 600}}>
                                    Route Details
                                </Typography>
                                <Button onClick={handleCloseDrawer} size="small">
                                    Close
                                </Button>
                            </Box>

                            {/* Timeline View */}
                            <Box sx={{position: "relative", pl: 1}}>
                                {routes[selectedRouteIndex].steps.map((step, stepIndex) => (
                                    <Box key={stepIndex} sx={{position: "relative"}}>
                                        {/* Origin Location with Dot */}
                                        <Box sx={{display: "flex", alignItems: "center"}}>
                                            <Box sx={{mr: 2, position: "relative"}}>
                                                {/* Empty Circle Dot for Location */}
                                                <Box
                                                    sx={{
                                                        width: 18,
                                                        height: 18,
                                                        borderRadius: "50%",
                                                        border: "2px solid",
                                                        borderColor: "#000",
                                                        bgcolor: "white",
                                                        flexShrink: 0,
                                                        position: "relative",
                                                        zIndex: 1,
                                                    }}
                                                />
                                                {/* Dotted Connecting Line - only if not the last step */}
                                                {stepIndex < routes[selectedRouteIndex].steps.length && (
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: 18,
                                                            left: "50%",
                                                            transform: "translateX(-50%)",
                                                            width: 0,
                                                            height: "calc(100% + 45px)",
                                                            borderLeft: "2px dotted",
                                                            borderColor: "#666",
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                            <Box sx={{flex: 1}}>
                                                <Typography variant="body1" sx={{fontWeight: 600}}>
                                                    {step.origin.name}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Transportation Info (between dots) */}
                                        <Box sx={{ml: 4.5, mb: 3, mt: 1.5}}>
                                            <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                                                <Typography variant="body2">
                                                    {getTransportationIcon(step.transportationType)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary"
                                                            sx={{textTransform: "uppercase"}}>
                                                    {step.transportationType.replace("_", " ")}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}

                                {/* Final Destination */}
                                {routes[selectedRouteIndex].steps.length > 0 && (
                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                        <Box sx={{mr: 2}}>
                                            <Box
                                                sx={{
                                                    width: 18,
                                                    height: 18,
                                                    borderRadius: "50%",
                                                    border: "2px solid",
                                                    borderColor: "#000",
                                                    bgcolor: "white",
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body1" sx={{fontWeight: 600}}>
                                            {routes[selectedRouteIndex].steps[routes[selectedRouteIndex].steps.length - 1].destination.name}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </LocalizationProvider>
    );
}

