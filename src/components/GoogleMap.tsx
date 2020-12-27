import React from "react";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import DirectionServiceProvider from "./Directions";
import { PlaceDetailResult, NearbySearch } from "../functions/GoogleMaps";
import { Button } from "@material-ui/core";

var polyline = require("google-polyline");

const containerStyle = {
  height: "70vh",
  width: "100%",
};
function PolygonArray(latitude: any) {
  const R = 6378137;
  const pi = 3.14;
  //distance in meters
  const upper_offset = 1000;
  const lower_offset = -1000;
  let Lat_up = upper_offset / R;
  let Lat_down = lower_offset / R;
  //OffsetPosition, decimal degrees
  let lat_upper = latitude + (Lat_up * 180) / pi;
  let lat_lower = latitude + (Lat_down * 180) / pi;
  return [lat_upper, lat_lower];
}

function PolygonPoints(waypoints: any) {
  let polypoints = waypoints;
  let PolyLength = polypoints.length;
  let UpperBound = [];
  let LowerBound = [];
  for (let j = 0; j <= PolyLength - 1; j++) {
    let NewPoints = PolygonArray(polypoints[j][0]);
    UpperBound.push({ lat: NewPoints[0], lng: polypoints[j][1] });
    LowerBound.push({ lat: NewPoints[1], lng: polypoints[j][1] });
  }
  let reversebound = LowerBound.reverse();
  let FullPoly = UpperBound.concat(reversebound);
  return FullPoly;
}

function MyComponent({
  center,
  zoom,
  directions,
  addWayPoint,
  removeListItem,
}: {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  directions?: google.maps.DirectionsResult;
  addWayPoint: (item: any) => void;
  removeListItem: (item: any) => void;
}) {
  const [markers, setMarkers] = React.useState<any | undefined>(undefined);
  const [map, setMap] = React.useState<any | null>(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const getNearbyStuff = async () => {
    let results: any[] = [];
    let waypoints = [];
    if (directions && map !== null) {
      waypoints = polyline.decode(directions.routes[0].overview_polyline);
      for (let i = 0; i < waypoints.length; i += 40) {
        const res = await NearbySearch({
          location: {
            lat: waypoints[i][0],
            lng: waypoints[i][1],
          },
          radius: 20000,
          type: "restaurant",
        });
        results = results.concat(res.results);
      }
      console.log(results);
      setMarkers(results);
      for (const location of results) {
      }
    }
  };
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          getNearbyStuff();
        }}
      >
        Get stuff
      </Button>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={
          center
            ? center
            : {
                lat: 61.05499289999999,
                lng: 28.1896628,
              }
        }
        zoom={zoom ? zoom : 14}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <>
          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
              }}
              // optional
              onLoad={(directionsRenderer) => {
                console.log(
                  "DirectionsRenderer onLoad directionsRenderer: ",
                  directionsRenderer
                );
              }}
              // optional
              onUnmount={(directionsRenderer) => {
                console.log(
                  "DirectionsRenderer onUnmount directionsRenderer: ",
                  directionsRenderer
                );
              }}
            />
          )}
          <Markers items={markers} addWayPoint={addWayPoint} />
        </>
      </GoogleMap>
    </>
  );
}
const Stars = (stars: any) => {
  console.log(stars);
  if (!stars) return <></>;
  const numberOfStars = Math.round(stars.stars);
  console.log(numberOfStars);
  const goldenStar = (
    <span style={{ fontSize: "15px", color: "red" }}>&#9733;</span>
  );
  const greyStar = (
    <span style={{ fontSize: "15px", color: "black" }}>&#9733;</span>
  );
  return (
    <>
      {numberOfStars > 0 ? goldenStar : greyStar}
      {numberOfStars > 1 ? goldenStar : greyStar}
      {numberOfStars > 2 ? goldenStar : greyStar}
      {numberOfStars > 3 ? goldenStar : greyStar}
      {numberOfStars > 4 ? goldenStar : greyStar}
    </>
  );
};
const Markers = ({ items, addWayPoint }: any) => {
  const [selectedMarker, setSelectedMarker] = React.useState<any | undefined>(
    undefined
  );
  return (
    <>
      {items &&
        items.map((marker: any) => (
          <Marker
            key={marker.geometry.location.lat + marker.name}
            position={marker.geometry.location}
            onClick={() => {
              setSelectedMarker(marker);
            }}
          />
        ))}
      {selectedMarker && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedMarker(null);
          }}
          position={{
            lat: selectedMarker.geometry.location.lat + 0.0001,
            lng: selectedMarker.geometry.location.lng,
          }}
        >
          <div>
            <h3 style={{ marginBottom: "2px" }}>{selectedMarker.name}</h3>
            <Stars stars={selectedMarker.rating} />
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addWayPoint(selectedMarker);
                }}
              >
                Add waypoint
              </Button>
            </div>
          </div>
        </InfoWindow>
      )}
      )
    </>
  );
};
export default React.memo(MyComponent);
