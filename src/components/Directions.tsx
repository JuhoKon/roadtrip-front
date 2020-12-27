import React from "react";
import { DirectionsService } from "@react-google-maps/api";
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
  waypoints,
}: {
  destination: google.maps.Place;
  origin: google.maps.Place;
  outputDirections: (value: google.maps.DirectionsResult) => void;
  waypoints?: google.maps.DirectionsWaypoint[];
}) => {
  console.log(destination, origin);
  return (
    <DirectionsService
      // required
      options={{
        destination: destination,
        origin: origin,
        travelMode: TravelMode.DRIVING,
        waypoints: waypoints,
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
