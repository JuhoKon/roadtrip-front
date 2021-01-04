import React from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  InfoWindow,
  MarkerClusterer,
} from "@react-google-maps/api";

import {
  PlaceDetailResult,
  RetrievePlaceDetails,
} from "../functions/GoogleMaps";

import InfoWindowItem from "./InfoWindowItem";

import gas_station from "../assets/gas-pump.png";
import gps from "../assets/gps.png";
import coffee from "../assets/coffee.png";
import mall from "../assets/mall.png";
import point_of_interest from "../assets/point-of-interest.png";
import restaurant from "../assets/restaurant.png";
import shops from "../assets/shops.png";
import spa from "../assets/spa.png";
import hotel from "../assets/hotel.png";
import park from "../assets/park.png";
import bar from "../assets/bar.png";
import { ALPHABET, PLACETYPES } from "../other/Constants";

const containerStyle = {
  height: "70vh",
  width: "100%",
};

function GoogleMaps({
  center,
  zoom,
  directions,
  addWayPoint,
  waypointMarkerInfo,
  markers,
}: {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  directions?: google.maps.DirectionsResult;
  addWayPoint: (item: any) => void;
  waypointMarkerInfo?: PlaceDetailResult[];
  markers?: any;
}) {
  return (
    <>
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
      >
        <>
          {directions && <DirectionsMemo directions={directions} />}
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
const DirectionsRender = ({ directions }: any) => {
  return (
    <DirectionsRenderer
      options={{
        directions: directions,
        polylineOptions: {
          strokeColor: "red",
        },
        suppressMarkers: true,
      }}
    />
  );
};
const DirectionsMemo = React.memo(DirectionsRender, checkIfPropsAreEqual2);

const WayPointMarkers = ({ items, addWayPoint }: any) => {
  const [selectedMarker, setSelectedMarker] = React.useState<any | undefined>(
    undefined
  );
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
            label={{ text: ALPHABET[index], color: "white" }}
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
          <InfoWindowItem
            name={selectedMarker.name}
            adr_address={selectedMarker.adr_address}
            url={selectedMarker.website}
            mapsURL={selectedMarker.url}
            place_id={selectedMarker.place_id}
            alphabet={selectedMarker.alphabet}
            rating={selectedMarker.rating}
            types={selectedMarker.types}
            photos={selectedMarker.photos}
            addMarker={() => addWayPoint(selectedMarker)}
            showWayPointButton={false}
          />
        </InfoWindow>
      )}
      )
    </>
  );
};
const getIcon = (types: any[]) => {
  let item;
  for (let i = 0; i < PLACETYPES.length; i++) {
    if (types.includes(PLACETYPES[i])) {
      item = PLACETYPES[i];
      break;
    }
  }
  if (item) {
    switch (item) {
      case "gas_station":
        return gas_station;
      case "shopping_mall":
        return mall;
      case "cafe":
        return coffee;
      case "store":
        return shops;
      case "point_of_interest":
        return point_of_interest;
      case "restaurant":
        return restaurant;
      case "spa":
        return spa;
      case "lodging":
        return hotel;
      case "park":
        return park;
      case "food":
        return restaurant;
      case "bar":
        return bar;
      default:
        return gps;
    }
  }
  return gps;
};
const Markers = ({ items, addWayPoint }: any) => {
  const options = {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    minimumClusterSize: 5,
  };

  const [selectedMarker, setSelectedMarker] = React.useState<any | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(false);
  return (
    <>
      {items && (
        <MarkerClusterer options={options}>
          {(clusterer) =>
            items.map((marker: any) => (
              <Marker
                key={marker.place_id}
                position={marker.geometry.location}
                onClick={async () => {
                  setLoading(true);
                  setSelectedMarker(marker);
                  const result = await RetrievePlaceDetails(marker.place_id);
                  setLoading(false);
                  setSelectedMarker(result);
                }}
                clusterer={clusterer}
                icon={{
                  url: getIcon(marker.types),
                  origin: new google.maps.Point(0, 0),
                }}
              />
            ))
          }
        </MarkerClusterer>
      )}
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
          <InfoWindowItem
            name={selectedMarker.name}
            adr_address={selectedMarker.adr_address}
            url={selectedMarker.website}
            mapsURL={selectedMarker.url}
            place_id={selectedMarker.place_id}
            alphabet={selectedMarker.alphabet}
            rating={selectedMarker.rating}
            types={selectedMarker.types}
            photos={selectedMarker.photos}
            addMarker={() => addWayPoint(selectedMarker)}
            showWayPointButton={true}
            loading={loading}
          />
        </InfoWindow>
      )}
      )
    </>
  );
};

function checkIfPropsAreEqual(prevProps: any, nextProps: any) {
  return (
    prevProps.directions === nextProps.directions &&
    prevProps.waypointMarkerInfo === nextProps.waypointMarkerInfo &&
    prevProps.markers === nextProps.markers &&
    prevProps.zoom === nextProps.zoom &&
    prevProps.center === nextProps.center
  );
}

function checkIfPropsAreEqual2(prevProps: any, nextProps: any) {
  return prevProps.directions === nextProps.directions;
}
export default React.memo(GoogleMaps, checkIfPropsAreEqual);
