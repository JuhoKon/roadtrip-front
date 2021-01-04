import React from "react";
import Nav from "./components/Nav";
import "./App.css";
import { Button, Grid } from "@material-ui/core";
import SearchContainer from "./containers/SearchContainer2";
import MapContainer from "./containers/MapContainer";
import ListContainer from "./containers/ListContainer";
import StartModal from "./containers/StartModal";
import SettingsModal from "./containers/SettingsModal";
import {
  NearbySearch,
  PlaceDetailResult,
  RetrievePlaceDetails,
} from "./functions/GoogleMaps";
import DirectionServiceProvider from "./components/Directions";
import { LoadScript } from "@react-google-maps/api";
import { useForceUpdate } from "./components/ForceUpdate";
import { distanceInKmBetweenEarthCoordinates } from "./functions/Helpers";
import { ALPHABET } from "./other/Constants";
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
  const [showModal, setShowModal] = React.useState(true);
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
    const exists = listItems.find(
      (element: PlaceDetailResult) => element.place_id === item.place_id
    );
    if (exists) {
      alert("The location already exists on the list!");
      return;
    }
    const result = await RetrievePlaceDetails(item.place_id);

    listItems.splice(listItems.length - 1, 0, result); //second last
    forceUpdate();
    setShouldCalculateRouteAgain(true);
  };
  const removeListItem = (place_id: any) => {
    setListItems(
      listItems.filter((item: any) => {
        return item.place_id !== place_id;
      })
    );
    setWaypointMarkerInfo(
      waypointMarkerInfo?.filter((item: any) => {
        return item.place_id !== place_id;
      })
    );
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
        <LoadScript googleMapsApiKey="API">
          <Grid container spacing={3}>
            <Grid item xs={8}>
              {showError ? <p>Error fetching directions. Try again!</p> : null}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  disabled={listItems.length < 2 || !shouldCalculateRouteAgain}
                  onClick={() => {
                    calculateDirectionAndWaypoints();
                  }}
                >
                  Calculate route
                </Button>
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
              <MapContainer
                center={center}
                zoom={zoom}
                directions={directions}
                addWayPoint={addWayPoint}
                waypointMarkerInfo={waypointMarkerInfo}
                markers={markers}
              />
            </Grid>
            <Grid item xs={4}>
              <ListContainer
                setItems={(items: any) => {
                  setShouldCalculateRouteAgain(true);
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
// mahdollisuus asettaa paikka "nukkumapaikaksi" => muuttaa vaikka markerin värin tms.
// => näkyy myös listalla
//ja joku juttu, että ei voi laittaa samaa paikkaa kahta kertaa, esim alertti että nope
