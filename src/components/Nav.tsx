import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";

const Nav = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Roadtrip Planner</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
