import React from "react";
import Nav from "./components/Nav";

import "./App.css";
import { Grid } from "@material-ui/core";
import SearchContainer from "./containers/SearchContainer";
import MapContainer from "./containers/MapContainer";
import { PlaceDetailResult } from "./functions/GoogleMaps";
type Center = {
  lat: number;
  lng: number;
};
function App() {
  const [startLocation, setStartLocation] = React.useState<
    PlaceDetailResult | undefined
  >(undefined);
  const [endLocation, setEndLocation] = React.useState<
    PlaceDetailResult | undefined
  >(undefined);

  const [center, setCenter] = React.useState<Center | undefined>(undefined);
  const [zoom, setZoom] = React.useState<number | undefined>(undefined);
  const setCenteredStartLocation = (value: PlaceDetailResult | undefined) => {
    setStartLocation(value);
    setCenter(value?.geometry.location);
    setZoom(15);
  };
  const setCenteredEndLocation = (value: PlaceDetailResult | undefined) => {
    setEndLocation(value);
    setCenter(value?.geometry.location);
    setZoom(15);
  };

  return (
    <div className="App">
      <Nav />
      <div style={{ padding: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <SearchContainer
              setStartLocation={setCenteredStartLocation}
              setEndLocation={setCenteredEndLocation}
            />
            <MapContainer
              center={center}
              zoom={zoom}
              startLocation={startLocation}
              endLocation={endLocation}
            />
          </Grid>
          <Grid item xs={4}>
            <div style={{ background: "red" }}>Lista kaikesta</div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
