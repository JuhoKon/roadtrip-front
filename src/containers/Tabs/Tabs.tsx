import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Box from "@material-ui/core/Box";

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: 500,
    padding: 0,
  },
}));

export default function CustomTabs(props: any) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Waypoints" {...a11yProps(0)} />
          <Tab
            disabled={!props.shouldSecondShow}
            label="Directions"
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
      <Box display={value === 0 ? "" : "none"} style={{ marginTop: 25 }}>
        {props.first}
      </Box>
      <Box display={value === 1 ? "" : "none"} style={{ marginTop: 25 }}>
        {" "}
        {props.second}
      </Box>
    </div>
  );
}
