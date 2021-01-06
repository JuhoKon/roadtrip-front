import React from "react";
import Nav from "./components/Nav";
import "./App.css";
import { Button, Grid } from "@material-ui/core";
import SearchContainer from "./containers/LocationSearch";
import GoogleMaps from "./containers/GoogleMaps/GoogleMap";
import ListContainer from "./containers/ListContainer";
import StartModal from "./containers/StartModal";
import SettingsModal from "./containers/SettingsModal";
import {
  NearbySearch,
  PlaceDetailResult,
  RetrievePlaceDetails,
} from "./functions/API";
import DirectionServiceProvider from "./components/Directions";
import { LoadScript } from "@react-google-maps/api";
import { useForceUpdate } from "./components/ForceUpdate";
import {
  distanceInKmBetweenEarthCoordinates,
  secondsToHms,
} from "./functions/Helpers";
import { ALPHABET } from "./other/Constants";
import CustomTabs from "./containers/Tabs/Tabs";
var polyline = require("google-polyline");

type Center = {
  lat: number;
  lng: number;
};
function App() {
  const [
    shouldCalculateRouteAgain,
    setShouldCalculateRouteAgain,
  ] = React.useState(true);
  const [markers, setMarkers] = React.useState<any | undefined>(undefined);
  const [showModal] = React.useState(true);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showError, setError] = React.useState(false);
  const [waypointMarkerInfo, setWaypointMarkerInfo] = React.useState<
    PlaceDetailResult[] | undefined
  >(undefined);
  const [routeLength, setRouteLength] = React.useState<any | undefined>(
    undefined
  );
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
  const [center, setCenter] = React.useState<Center | undefined>({
    lat: 61.05499289999999,
    lng: 28.1896628,
  });
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
    const exists = listItems.find(
      (element: PlaceDetailResult) => element.place_id === item.place_id
    );
    if (exists) {
      forceUpdate();
      alert("The location already exists on the list!");
      return;
    }
    const result = await RetrievePlaceDetails(item.place_id);
    if (listItems.length === 0 || listItems.length === 1) {
      listItems.push(result);

      forceUpdate();
      setShouldCalculateRouteAgain(true);
      return;
    }
    listItems.splice(listItems.length - 1, 0, result); //second last
    forceUpdate();
    setShouldCalculateRouteAgain(true);
  };
  const removeListItem = (place_id: any) => {
    const newListItems = listItems.filter((item: any) => {
      return item.place_id !== place_id;
    });
    const newWayPointParkers = waypointMarkerInfo?.filter((item: any) => {
      return item.place_id !== place_id;
    });

    setListItems(newListItems);
    setWaypointMarkerInfo(newWayPointParkers);
    forceUpdate();
    setShouldCalculateRouteAgain(true);
  };
  const calculateDirectionAndWaypoints = () => {
    let waypoints = [];
    if (listItems.length > 2) {
      for (const item of listItems) {
        if (item !== listItems[0] && item !== listItems[listItems.length - 1]) {
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
    setGetDirection(true);
    setShouldCalculateRouteAgain(false);
    setTimeout(() => {
      setGetDirection(false);
    }, 1000);
  };
  const handleGetDirection = async (directions: any) => {
    if (directions.status !== "OK") {
      setError(true);
      return;
    }
    setError(false);

    let totalDistance = 0;
    let totalDuration = 0;
    //get total distance and duration
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
    for (let index = 0; index < listItems.length; index++) {
      const element = listItems[index];
      element["alphabet"] = ALPHABET[index];
    }
    forceUpdate();
  };

  const getNearbyStuff = async (options: any) => {
    let results: any[] = [];
    let waypoints = [];
    if (directions) {
      waypoints = polyline.decode(directions.routes[0].overview_polyline);
      let promises = [];
      let cumulativeDistance = 0;
      for (let i = 0; i < waypoints.length; i++) {
        if (i === 0) {
          //if starting the iteration, get first point's nearby places
          const promise = NearbySearch({
            location: {
              lat: waypoints[i][0],
              lng: waypoints[i][1],
            },
            radius: 20000,
            type: options.type,
            keyword: options.keyword,
          });
          promises.push(promise);
        }
        if (!waypoints[i + 1]) {
          // take the last points' nearby places
          const promise = NearbySearch({
            location: {
              lat: waypoints[i][0],
              lng: waypoints[i][1],
            },
            radius: 20000,
            type: options.type,
            keyword: options.keyword,
          });
          promises.push(promise);
          break;
        }
        // get cumulative distance between i and i+n points
        cumulativeDistance =
          cumulativeDistance +
          distanceInKmBetweenEarthCoordinates(
            waypoints[i][0],
            waypoints[i][1],
            waypoints[i + 1][0],
            waypoints[i + 1][1]
          );
        // if we're over 19km in distance between the n points, get prev points' nearby places
        // and reset cumulativeDistance
        if (cumulativeDistance >= 19) {
          const promise = NearbySearch({
            location: {
              lat: waypoints[i][0],
              lng: waypoints[i][1],
            },
            radius: 20000,
            type: options.type,
            keyword: options.keyword,
          });
          promises.push(promise);
          cumulativeDistance = 0;
        }
      }
      const searchResults = await Promise.all(promises);
      for (const res of searchResults) {
        results = res.results.concat(results);
      }
      const uniqueArray = results.filter((obj: any, pos: any, arr: any) => {
        return (
          arr.map((mapObj: any) => mapObj.place_id).indexOf(obj.place_id) ===
          pos
        );
      });
      setMarkers(uniqueArray);
    }
  };
  const createWayPointFromSearch = (value: PlaceDetailResult | undefined) => {
    if (!value) return;
    if (!markers) {
      setMarkers([value]);
      setCenter(value?.geometry.location);
      setZoom(18);
    } else {
      const exists = markers.find(
        (element: PlaceDetailResult) => element.place_id === value.place_id
      );
      if (!exists) {
        setMarkers((markers: any) => [...markers, value]);
      }
      setCenter(value?.geometry.location);
      setZoom(18);
    }
    setCenter(value?.geometry.location);
    setZoom(18);
    setShouldCalculateRouteAgain(true);
  };
  const canWeShowSettings = () => {
    if (directions && listItems.length > 1) return true;
    return false;
  };

  return (
    <div className="App">
      <Nav />
      <div style={{ padding: 20 }}>
        <LoadScript
          /*         googleMapsApiKey={
            window.REACT_APP_API_KEY ? window.REACT_APP_API_KEY : "API"
          } */
          googleMapsApiKey={"AIzaSyAMTyAeraWU_WFtLGvVc6CO3YuVsq-Wg40"}
        >
          <Grid container spacing={3}>
            <Grid item xs={8}>
              {showError ? <p>Error fetching directions. Try again!</p> : null}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <div
                  id={
                    shouldCalculateRouteAgain && listItems.length > 1
                      ? "bounce"
                      : ""
                  }
                >
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      listItems.length < 2 || !shouldCalculateRouteAgain
                    }
                    onClick={() => {
                      calculateDirectionAndWaypoints();
                    }}
                  >
                    Calculate route
                  </Button>
                </div>

                <SettingsModal
                  canWeShowSettings={canWeShowSettings()}
                  handleClose={() => setShowSettings(false)}
                  handleOpen={() => setShowSettings(true)}
                  showModal={showSettings}
                  getNearbyPlaces={getNearbyStuff}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!markers}
                  onClick={() => {
                    setMarkers(undefined);
                  }}
                >
                  Clear markers
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!directions}
                  onClick={() => {
                    setDirections(undefined);
                    setWaypointMarkerInfo(undefined);
                    setListItems([]);
                    setRouteLength(undefined);
                  }}
                >
                  Clear route
                </Button>
                <StartModal
                  setStartLocation={setCenteredStartLocation}
                  setEndLocation={setCenteredEndLocation}
                  showModal={showModal}
                  calculateDirectionAndWaypoints={
                    calculateDirectionAndWaypoints
                  }
                  showSettings={() => {
                    setShowSettings(true);
                  }}
                  startOver={() => {
                    setDirections(undefined);
                    setWaypointMarkerInfo(undefined);
                    setMarkers(undefined);
                    setListItems([]);
                    setRouteLength(undefined);
                    setError(false);
                  }}
                />
              </div>
              <br />
              {!directions && getDirection && listItems.length > 1 && (
                <DirectionServiceProvider
                  destination={{
                    placeId: listItems[listItems.length - 1].place_id,
                  }}
                  origin={{ placeId: listItems[0].place_id }}
                  outputDirections={async (directions: any) => {
                    handleGetDirection(directions);
                  }}
                  waypoints={waypoints}
                />
              )}
              <SearchContainer
                setLocation={(location) => {
                  createWayPointFromSearch(location);
                }}
              />
              <GoogleMaps
                center={center}
                zoom={zoom}
                directions={directions}
                addWayPoint={(item: any) => {
                  addWayPoint(item);
                }}
                waypointMarkerInfo={waypointMarkerInfo}
                markers={markers}
              />
            </Grid>
            <Grid item xs={4}>
              <CustomTabs
                first={
                  <ListContainer
                    setItems={(items: any) => {
                      setShouldCalculateRouteAgain(true);
                      setListItems(items);
                    }}
                    items={listItems}
                    removeListItem={removeListItem}
                    routeLength={routeLength}
                  />
                }
                second={
                  <div
                    id="directionspanel"
                    style={{ overflow: "auto", maxHeight: "750px" }}
                  ></div>
                }
                shouldSecondShow={canWeShowSettings()}
              />
            </Grid>
          </Grid>
        </LoadScript>
      </div>
    </div>
  );
}
export default App;
