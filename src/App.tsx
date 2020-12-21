import React from "react";
import Nav from "./components/Nav";

import "./App.css";
import { Container, Grid } from "@material-ui/core";
import SearchContainer from "./containers/SearchContainer";

function App() {
  return (
    <div className="App">
      <Nav />
      <div style={{ padding: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <SearchContainer />
            <div style={{ background: "red" }}>1</div>
          </Grid>
          <Grid item xs={4}>
            <div style={{ background: "red" }}>2</div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
