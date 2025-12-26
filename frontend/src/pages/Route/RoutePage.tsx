import {Box, Button, FormControlLabel, Paper, Radio, RadioGroup, Typography} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useCallback, useEffect, useRef, useState} from "react";
import InfiniteScrollableSelect from "../../components/InfiniteScrollableSelect";
import {Location} from "../../types/location";
import {Route} from "../../types/route";
import {locationService} from "../../services/locationService";
import {routeService} from "../../services/routeService";
import dayjs, {Dayjs} from "dayjs";

export default function RoutePage() {
    const [originCode, setOriginCode] = useState("");
    const [destinationCode, setDestinationCode] = useState("");
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(null);

    // Location state - shared across all dialog opens
    const [locations, setLocations] = useState<Location[]>([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationHasMore, setLocationHasMore] = useState(true);
    const locationPageRef = useRef(0);
    const locationLoadingRef = useRef(false);

    // Load locations
    const loadLocations = useCallback(async () => {
        if (locationLoadingRef.current || !locationHasMore) return;

        locationLoadingRef.current = true;
        setLocationLoading(true);
        try {
            const response = await locationService.getAll({
                page: locationPageRef.current,
                size: 10,
                sort: "name,asc"
            });
            setLocations(prev =>
                locationPageRef.current === 0 ? response.content : [...prev, ...response.content]
            );
            setLocationHasMore(!response.last);
            locationPageRef.current++;
        } catch (error) {
            console.error("Failed to load locations:", error);
        } finally {
            locationLoadingRef.current = false;
            setLocationLoading(false);
        }
    }, [locationHasMore]);

    // Load initial data
    useEffect(() => {
        if (locations.length === 0) {
            loadLocations();
        }
    }, [locations.length, loadLocations]);

    const handleSearch = async () => {
        if (!originCode || !destinationCode || !selectedDate) return;
        setLoading(true);
        setSelectedRouteIndex(null);
        try {
            const results = await routeService.searchRoutes({
                originCode,
                destinationCode,
                date: selectedDate.toISOString(),
            });
            setRoutes(results);
        } catch (error) {
            setRoutes([]);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type: string) => {
        if (type === "FLIGHT") return "✈️";
        if (type === "BUS") return "🚌";
        if (type === "SUBWAY") return "🚇";
        if (type === "UBER") return "🚗";
        return "🚶";
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{display: "flex", flexDirection: "column", height: "100vh"}}>
                <Paper elevation={1}
                       sx={{width: "100%", p: 2, borderRadius: 0, borderBottom: 2, borderColor: "divider"}}>
                    <Typography variant="h5" sx={{mb: 2, fontWeight: 600}}>Route Search</Typography>
                    <Box sx={{display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap"}}>
                        <InfiniteScrollableSelect<Location>
                            sx={{minWidth: 200}}
                            value={originCode || null}
                            onChange={setOriginCode}
                            label="Origin"
                            options={locations}
                            loading={locationLoading}
                            onLoadMore={loadLocations}
                            hasMore={locationHasMore}
                            getOptionLabel={(location) => location.name}
                            getOptionValue={(location) => location.locationCode}
                        />
                        <InfiniteScrollableSelect<Location>
                            sx={{minWidth: 200}}
                            value={destinationCode || null}
                            onChange={setDestinationCode}
                            label="Destination"
                            options={locations}
                            loading={locationLoading}
                            onLoadMore={loadLocations}
                            hasMore={locationHasMore}
                            getOptionLabel={(location) => location.name}
                            getOptionValue={(location) => location.locationCode}
                        />
                        <DatePicker label="Date" value={selectedDate} onChange={setSelectedDate}
                                    slotProps={{textField: {sx: {minWidth: 200}}}}/>
                        <Button variant="contained" onClick={handleSearch}
                                disabled={!originCode || !destinationCode || !selectedDate || loading}
                                sx={{height: 56}}>
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </Box>
                </Paper>

                <Box sx={{display: "flex", flex: 1, overflow: "hidden"}}>
                    <Box sx={{
                        flex: 1,
                        p: 3,
                        overflow: "auto",
                        borderRight: selectedRouteIndex === null ? 0 : 1,
                        borderColor: "divider"
                    }}>
                        {routes.length > 0 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{mb: 2}}>Available Routes</Typography>
                                <RadioGroup value={selectedRouteIndex?.toString() || ""}>
                                    {routes.map((route, idx) => (
                                        <Paper key={idx} sx={{
                                            p: 2, mb: 2, cursor: "pointer",
                                            border: selectedRouteIndex === idx ? 2 : 1,
                                            borderColor: selectedRouteIndex === idx ? "primary.main" : "divider",
                                            "&:hover": {bgcolor: "action.hover"}
                                        }}
                                               onClick={() => setSelectedRouteIndex(idx)}>
                                            <FormControlLabel value={idx.toString()} control={<Radio/>}
                                                              label={
                                                                  <Box sx={{ml: 1}}>
                                                                      <Typography variant="subtitle1"
                                                                                  sx={{fontWeight: 500}}>
                                                                          Via {route.steps.map((s) => s.destination.name).join(" → ")}
                                                                      </Typography>
                                                                      <Box sx={{
                                                                          display: "flex",
                                                                          gap: 1,
                                                                          flexWrap: "wrap",
                                                                          mt: 1
                                                                      }}>
                                                                          {route.steps.map((step, si) => (
                                                                              <Typography key={si} variant="body2"
                                                                                          color="text.secondary">
                                                                                  {getIcon(step.transportationType)} {step.transportationType.replace("_", " ")}
                                                                                  {si < route.steps.length - 1 && " →"}
                                                                              </Typography>
                                                                          ))}
                                                                      </Box>
                                                                  </Box>
                                                              }/>
                                        </Paper>
                                    ))}
                                </RadioGroup>
                            </Box>
                        )}
                        {routes.length === 0 && !loading && originCode && destinationCode && (
                            <Typography variant="body1" color="text.secondary" sx={{textAlign: "center", mt: 4}}>
                                No routes found.
                            </Typography>
                        )}
                    </Box>

                    {selectedRouteIndex !== null && routes[selectedRouteIndex] && (
                        <Box sx={{width: 350, p: 3, bgcolor: "background.paper", overflow: "auto"}}>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 3
                            }}>
                                <Typography variant="h6" sx={{fontWeight: 600}}>Route Details</Typography>
                                <Button onClick={() => setSelectedRouteIndex(null)} size="small">Close</Button>
                            </Box>
                            <Box sx={{position: "relative", pl: 1}}>
                                {routes[selectedRouteIndex].steps.map((step, si) => (
                                    <Box key={si} sx={{position: "relative"}}>
                                        <Box sx={{display: "flex", alignItems: "center"}}>
                                            <Box sx={{mr: 2, position: "relative"}}>
                                                <Box sx={{
                                                    width: 18,
                                                    height: 18,
                                                    borderRadius: "50%",
                                                    border: "2px solid",
                                                    borderColor: "#000",
                                                    bgcolor: "white",
                                                    flexShrink: 0,
                                                    position: "relative",
                                                    zIndex: 1
                                                }}/>
                                                {si < routes[selectedRouteIndex].steps.length && (
                                                    <Box sx={{
                                                        position: "absolute",
                                                        top: 18,
                                                        left: "50%",
                                                        transform: "translateX(-50%)",
                                                        width: 0,
                                                        height: "calc(100% + 45px)",
                                                        borderLeft: "2px dotted",
                                                        borderColor: "#666"
                                                    }}/>
                                                )}
                                            </Box>
                                            <Box sx={{flex: 1}}>
                                                <Typography variant="body1"
                                                            sx={{fontWeight: 600}}>{step.origin.name}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ml: 4.5, mb: 3, mt: 1.5}}>
                                            <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                                                <Typography
                                                    variant="body2">{getIcon(step.transportationType)}</Typography>
                                                <Typography variant="body2" color="text.secondary"
                                                            sx={{textTransform: "uppercase"}}>
                                                    {step.transportationType.replace("_", " ")}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                                {routes[selectedRouteIndex].steps.length > 0 && (
                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                        <Box sx={{mr: 2}}>
                                            <Box sx={{
                                                width: 18, height: 18, borderRadius: "50%", border: "2px solid",
                                                borderColor: "#000", bgcolor: "white"
                                            }}/>
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
