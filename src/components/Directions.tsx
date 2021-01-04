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
        outputDirections(result);
      }}
      // optional
      onLoad={(directionsService: any) => {}}
      // optional
      onUnmount={(directionsService: any) => {}}
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
