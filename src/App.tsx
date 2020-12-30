import React from "react";
import Nav from "./components/Nav";

import "./App.css";
import { Button, Grid } from "@material-ui/core";
import SearchContainer from "./containers/SearchContainer";
import MapContainer from "./containers/MapContainer";
import ListContainer from "./containers/ListContainer";
import Modal from "./containers/Modal";
import {
  PlaceDetailResult,
  RetrievePlaceDetails,
} from "./functions/GoogleMaps";
import DirectionServiceProvider from "./components/Directions";
import { LoadScript } from "@react-google-maps/api";
import { useForceUpdate } from "./components/ForceUpdate";

type Center = {
  lat: number;
  lng: number;
};
function App() {
  const [showError, setError] = React.useState(false);
  const [waypointMarkerInfo, setWaypointMarkerInfo] = React.useState<
    PlaceDetailResult[] | undefined
  >(undefined);
  const [routeLength, setRouteLength] = React.useState<any | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(false);
  const forceUpdate = useForceUpdate();
  const [listItems, setListItems] = React.useState<PlaceDetailResult[] | any[]>(
    []
  );
  const [waypoints, setWaypoints] = React.useState<any[] | undefined>(
    undefined
  );
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
  const addWayPoint = async (item: any) => {
    const result = await RetrievePlaceDetails(item.place_id);
    listItems.splice(listItems.length - 1, 0, result); //second last
    forceUpdate();
  };
  const removeListItem = (place_id: any) => {
    setListItems(
      listItems.filter((item: any) => {
        return item.place_id !== place_id;
      })
    );
    forceUpdate();
  };
  const calculateDirectionAndWaypoints = () => {
    let waypoints = [];
    if (listItems.length > 2) {
      for (const item of listItems) {
        if (item !== listItems[0] && item !== listItems[listItems.length - 1]) {
          console.log(item);
          waypoints.push({
            location: {
              placeId: item.place_id,
            },
          });
        }
      }
    }
    if (waypoints.length > 0) {
      setWaypoints(waypoints);
    } else {
      setWaypoints(undefined);
    }
    setDirections(undefined);
    setLoading(true);
    setGetDirection(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  console.log(waypointMarkerInfo);
  return (
    <div className="App">
      <Nav />
      <div style={{ padding: 20 }}>
        <LoadScript googleMapsApiKey="API">
          <Grid container spacing={3}>
            <Grid item xs={8}>
              {showError ? <p>Error fetching directions. Try again!</p> : null}
              <Button
                variant="contained"
                color="primary"
                disabled={loading || listItems.length < 2}
                onClick={() => {
                  calculateDirectionAndWaypoints();
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
                  outputDirections={async (directions: any) => {
                    if (directions.status !== "OK") {
                      setError(true);
                      return;
                    }
                    setError(false);

                    let totalDistance = 0;
                    let totalDuration = 0;

                    for (const leg of directions.routes[0].legs) {
                      totalDuration = leg.duration.value + totalDuration;
                      totalDistance = leg.distance.value + totalDistance;
                    }
                    setDirections(directions);
                    setRouteLength({
                      distance: Math.round(totalDistance / 1000) + "km",
                      duration: secondsToHms(totalDuration),
                    });

                    // fetch placedetails for waypoints, to render seperately on the maps
                    let promises = [];
                    for (const waypoint of directions?.geocoded_waypoints) {
                      const result = RetrievePlaceDetails(waypoint.place_id);
                      promises.push(result);
                    }
                    const results = await Promise.all(promises);
                    setWaypointMarkerInfo(results);

                    //set alphabet for the waypoints, so we can render them on the list
                    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    for (let index = 0; index < listItems.length; index++) {
                      const element = listItems[index];
                      element["alphabet"] = alphabet[index];
                    }
                  }}
                  waypoints={waypoints}
                />
              )}
              <MapContainer
                center={center}
                zoom={zoom}
                directions={directions}
                addWayPoint={addWayPoint}
                removeListItem={removeListItem}
                waypointMarkerInfo={waypointMarkerInfo}
              />
            </Grid>
            <Grid item xs={4}>
              <ListContainer
                setItems={(items: any) => {
                  setListItems(items);
                }}
                items={listItems ? listItems : []}
                removeListItem={removeListItem}
                routeLength={routeLength}
              />
            </Grid>
          </Grid>
        </LoadScript>
      </div>
    </div>
  );
}
//https://stackoverflow.com/questions/37096367/how-to-convert-seconds-to-minutes-and-hours-in-javascript
function secondsToHms(seconds: any) {
  seconds = Number(seconds);
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor((seconds % 3600) % 60);

  var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
}

export default App;

//kuvien haku? https://developers.google.com/places/web-service/photos skippa?
//kun valitaan paikka siihen markeri?
// ne markerit kuntoon (iconeita?) + katan esimerkistä ne waypointti hommat
// modali kuntoon, nappulat "oikeisiin paikkoihin"
