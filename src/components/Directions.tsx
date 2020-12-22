import React from "react";
import { DirectionsService } from "@react-google-maps/api";
import { PlaceDetailResult } from "../functions/GoogleMaps";
enum TravelMode {
  BICYCLING = "BICYCLING",
  DRIVING = "DRIVING",
  TRANSIT = "TRANSIT",
  TWO_WHEELER = "TWO_WHEELER",
  WALKING = "WALKING",
}

const DirectionServiceProvider = ({
  destination,
  origin,
  outputDirections,
}: {
  destination: {
    lat: number;
    lng: number;
  };
  origin: {
    lat: number;
    lng: number;
  };
  outputDirections: (value: google.maps.DirectionsResult) => void;
}) => {
  const dest = new google.maps.LatLng(destination.lat, destination.lng);
  const orig = new google.maps.LatLng(origin.lat, origin.lng);
  console.log(destination, origin);
  return (
    <DirectionsService
      // required
      options={{
        destination: dest,
        origin: orig,
        travelMode: TravelMode.DRIVING,
      }}
      // required
      callback={(result) => {
        console.log(result);
        outputDirections(result);
      }}
      // optional
      onLoad={(directionsService: any) => {
        console.log(
          "DirectionsService onLoad directionsService: ",
          directionsService
        );
      }}
      // optional
      onUnmount={(directionsService: any) => {
        console.log(
          "DirectionsService onUnmount directionsService: ",
          directionsService
        );
      }}
    />
  );
};

function checkIfPropsAreEqual(prevProps: any, nextProps: any) {
  return (
    prevProps.destination === nextProps.destination &&
    prevProps.origin === nextProps.origin
  );
}

export default React.memo(DirectionServiceProvider, checkIfPropsAreEqual);
