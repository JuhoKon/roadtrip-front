import React from "react";
import Nav from "./components/Nav";

import "./App.css";
import { Button, Grid } from "@material-ui/core";
import SearchContainer from "./containers/SearchContainer";
import MapContainer from "./containers/MapContainer";
import ListContainer from "./containers/ListContainer";
import Modal from "./containers/Modal";
import { PlaceDetailResult, CalculateDirections } from "./functions/GoogleMaps";
import DirectionServiceProvider from "./components/Directions";
import { LoadScript } from "@react-google-maps/api";
import { useForceUpdate } from "./components/ForceUpdate";

type Center = {
  lat: number;
  lng: number;
};
function App() {
  const forceUpdate = useForceUpdate();
  const [listItems, setListItems] = React.useState<PlaceDetailResult[] | any[]>(
    []
  );
  const [startLocation, setStartLocation] = React.useState<
    PlaceDetailResult | undefined
  >(undefined);
  const [endLocation, setEndLocation] = React.useState<
    PlaceDetailResult | undefined
  >(undefined);
  const [directions, setDirections] = React.useState<
    google.maps.DirectionsResult | undefined
  >(undefined);
  const [getDirection, setGetDirection] = React.useState(false);
  const [center, setCenter] = React.useState<Center | undefined>(undefined);
  const [zoom, setZoom] = React.useState<number | undefined>(undefined);
  const setCenteredStartLocation = (value: PlaceDetailResult | undefined) => {
    if (!value) {
      listItems.shift();
      setZoom(10);
      return;
    }
    listItems.unshift(value);

    setCenter(value?.geometry.location);
    setZoom(15);
  };
  const setCenteredEndLocation = (value: PlaceDetailResult | undefined) => {
    if (!value) {
      listItems.pop();
      setZoom(10);
      return;
    }
    listItems.push(value);

    setCenter(value?.geometry.location);
    setZoom(15);
  };
  const addWayPoint = (item: any) => {
    //get information about the place by getplacebyID?
    // another thing, update the sortable list to also update the parent component as its only modifying only its state!
    console.log("Hello");
    listItems.splice(listItems.length - 1, 0, item); //second last
    forceUpdate();
  };
  const removeListItem = (item: any) => {
    console.log(item);
  };
  /*   const waypoints: google.maps.DirectionsWaypoint[] = [
    {
      location: {
        placeId:
          "EkRZdWthcsSxeXVydMOndSwgVHVya3VheiBUT0vEsCBLb251dGxhcsSxLCBZZW5pbWFoYWxsZS9BbmthcmEsIFR1cmtleSIuKiwKFAoSCS-XDrbIF9MUEapL8pEF-aeHEhQKEgm7_ePb2BfTFBFclxP5MimZ4g",
      },
    },
    {
      location: {
        placeId: "ChIJozelNqR3jEYRiKcLSo-Jths",
      },
    },
  ]; */
  return (
    <div className="App">
      <Nav />
      <div style={{ padding: 20 }}>
        <LoadScript googleMapsApiKey="AIzaSyC9JS6BGxWFhmhzMNrOkUtymM_uM8tU_V4">
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Button
                variant="contained"
                color="primary"
                disabled={getDirection}
                onClick={() => {
                  setDirections(undefined);
                  setGetDirection(true);
                  setTimeout(() => {
                    setGetDirection(false);
                  }, 1000);
                }}
              >
                Get route
              </Button>
              <Modal
                setStartLocation={setCenteredStartLocation}
                setEndLocation={setCenteredEndLocation}
              />
              {!directions && getDirection && (
                <DirectionServiceProvider
                  destination={{
                    placeId: listItems[listItems.length - 1].place_id,
                  }}
                  origin={{ placeId: listItems[0].place_id }}
                  outputDirections={(directions) => setDirections(directions)}
                  /*   waypoints={waypoints} */
                />
              )}
              <MapContainer
                center={center}
                zoom={zoom}
                directions={directions}
                addWayPoint={addWayPoint}
                removeListItem={removeListItem}
              />
            </Grid>
            <Grid item xs={4}>
              <ListContainer items={listItems ? listItems : []} />
            </Grid>
          </Grid>
        </LoadScript>
      </div>
    </div>
  );
}

export default App;
