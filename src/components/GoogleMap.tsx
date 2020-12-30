import React from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import {
  NearbySearch,
  PlaceDetailResult,
  RetrievePlaceDetails,
} from "../functions/GoogleMaps";
import { Button } from "@material-ui/core";

var polyline = require("google-polyline");

const containerStyle = {
  height: "70vh",
  width: "100%",
};

function GoogleMaps({
  center,
  zoom,
  directions,
  addWayPoint,
  removeListItem,
  waypointMarkerInfo,
}: {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  directions?: google.maps.DirectionsResult;
  addWayPoint: (item: any) => void;
  removeListItem: (item: any) => void;
  waypointMarkerInfo?: PlaceDetailResult[];
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
      let promises = [];
      for (let i = 0; i < waypoints.length; i += 40) {
        const promise = NearbySearch({
          location: {
            lat: waypoints[i][0],
            lng: waypoints[i][1],
          },
          radius: 20000,
          type: "restaurant",
        });
        promises.push(promise);
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
  console.log(waypointMarkerInfo);
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setMarkers(undefined);
        }}
      >
        Clear markers
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
        <>
          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
                polylineOptions: {
                  strokeColor: "red",
                },
                suppressMarkers: true,
              }}
            />
          )}

          <Markers items={markers} addWayPoint={addWayPoint} />
          <WayPointMarkers
            items={waypointMarkerInfo}
            addWayPoint={addWayPoint}
          />
        </>
      </GoogleMap>
    </>
  );
}
const Stars = (rating: any) => {
  if (typeof rating.stars === "undefined") return <></>;
  const numberOfStars = Math.round(rating.stars);
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
const WayPointMarkers = ({ items, addWayPoint }: any) => {
  const [selectedMarker, setSelectedMarker] = React.useState<any | undefined>(
    undefined
  );
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return (
    <>
      {items &&
        items.map((marker: any, index: number) => (
          <Marker
            key={marker.geometry.location.lat + marker.name}
            position={marker.geometry.location}
            onClick={() => {
              setSelectedMarker(marker);
            }}
            label={{ text: alphabet[index], color: "white" }}
            zIndex={5050}
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
            <div></div>
          </div>
        </InfoWindow>
      )}
      )
    </>
  );
};
const Markers = ({ items, addWayPoint }: any) => {
  const [selectedMarker, setSelectedMarker] = React.useState<any | undefined>(
    undefined
  );

  console.log(items);
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
//tänne vertailua jos propsit on samat, niin ei piirrä uudestaan kaikesta turhuudesta
//samalla kun painetaan get route, niin lasketaan listitemeille joku (A, B , C jne.
//tunnus, niin nähdään ne "samalla tavalla kartalla"?)

function checkIfPropsAreEqual(prevProps: any, nextProps: any) {
  return (
    prevProps.directions === nextProps.directions &&
    prevProps.waypointMarkerInfo === nextProps.waypointMarkerInfo
  );
}

export default React.memo(GoogleMaps, checkIfPropsAreEqual);
