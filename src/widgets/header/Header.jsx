import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
        <Typography variant="h6">Users App</Typography>
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}