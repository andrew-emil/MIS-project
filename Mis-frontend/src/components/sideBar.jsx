// components/Sidebar.js
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Divider,
  useMediaQuery,
  Typography,
  Box,
} from "@mui/material";
import {
  PersonAdd,
  Person,
  Delete,
  LocalHospital,
  Healing,
  BatchPrediction,
  Functions,
  Calculate,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const expandedWidth = 240;
const collapsedWidth = 60;

const navLinks = [
  { path: "/add-patient", label: "Add Patient", icon: <PersonAdd /> },
  { path: "/update-patient", label: "Update Patient", icon: <Person /> },
  { path: "/delete-patient", label: "Delete Patient", icon: <Delete /> },
  { path: "/add-doctor", label: "Add Doctor", icon: <PersonAdd /> },
  { path: "/update-doctor", label: "Update Doctor", icon: <Person /> },
  { path: "/delete-doctor", label: "Delete Doctor", icon: <Delete /> },
  { path: "/add-hospital", label: "Add Hospital", icon: <LocalHospital /> },
  {
    path: "/update-hospital",
    label: "Update Hospital",
    icon: <LocalHospital />,
  },
  { path: "/delete-hospital", label: "Delete Hospital", icon: <Delete /> },
  { path: "/add-surgery", label: "Add Surgery", icon: <Healing /> },
  { path: "/update-surgery", label: "Update Surgery", icon: <Healing /> },
  { path: "/delete-surgery", label: "Delete Surgery", icon: <Delete /> },
  { path: "/batch", label: "Batch Ops", icon: <BatchPrediction /> },
  { path: "/aggregate", label: "Aggregate", icon: <Functions /> },
  { path: "/array-sum", label: "Array Sum", icon: <Calculate /> },
];

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleDrawer = () => {
    setCollapsed((prev) => !prev);
  };

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: collapsed ? "center" : "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        {!collapsed && (
          <Typography variant="h6" noWrap sx={{ color: "black" }}>
            Dashboard
          </Typography>
        )}
        <IconButton onClick={toggleDrawer}>
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {navLinks.map(({ path, label, icon }) => (
          <ListItem
            button
            key={path}
            component={NavLink}
            to={path}
            onClick={() => setMobileOpen(false)}
            sx={{
              color: "black",
              "&.active": {
                backgroundColor: theme.palette.action.selected,
              },
              "& .MuiListItemIcon-root": {
                color: "black",
              },
              justifyContent: collapsed ? "center" : "flex-start",
              px: collapsed ? 2 : 3,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2 }}>
              {icon}
            </ListItemIcon>
            {!collapsed && <ListItemText primary={label} />}
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ ml: 2, mt: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": { width: expandedWidth },
            }}
          >
            {drawer}
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: collapsed ? collapsedWidth : expandedWidth,
            flexShrink: 0,
            transition: "width 0.3s",
            "& .MuiDrawer-paper": {
              width: collapsed ? collapsedWidth : expandedWidth,
              transition: "width 0.3s",
              overflowX: "hidden",
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
