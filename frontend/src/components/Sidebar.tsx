import {Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar} from "@mui/material";
import {Link} from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CommuteIcon from "@mui/icons-material/Commute";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import {DRAWER_WIDTH} from "../constants";

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    {text: "Location", path: "/", icon: <LocationOnIcon/>},
    {text: "Transportation", path: "/transportation", icon: <CommuteIcon/>},
    {text: "Route", path: "/route", icon: <AltRouteIcon/>},
];

export default function Sidebar({mobileOpen, onClose}: SidebarProps) {
    const menu = (
        <div>
            <Toolbar/>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={Link} to={item.path} onClick={onClose}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box component="nav" sx={{width: {md: DRAWER_WIDTH}, flexShrink: {md: 0}}}>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{keepMounted: true}}
                sx={{
                    display: {xs: "block", md: "none"},
                    "& .MuiDrawer-paper": {width: DRAWER_WIDTH},
                }}
            >
                {menu}
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: {xs: "none", md: "block"},
                    "& .MuiDrawer-paper": {width: DRAWER_WIDTH},
                }}
                open
            >
                {menu}
            </Drawer>
        </Box>
    );
}
