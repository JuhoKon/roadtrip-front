import React from "react";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
} from "@react-google-maps/api";
import DirectionServiceProvider from "./Directions";
import { PlaceDetailResult } from "../functions/GoogleMaps";

const containerStyle = {
  height: "70vh",
  width: "100%",
};

function MyComponent({
  center,
  zoom,
  startLocation,
  endLocation,
}: {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  startLocation: PlaceDetailResult | undefined;
  endLocation: PlaceDetailResult | undefined;
}) {
  const [map, setMap] = React.useState(null);

  const [directions, setDirections] = React.useState<
    google.maps.DirectionsResult | undefined
  >(undefined);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  return (
    <>
      <LoadScript googleMapsApiKey="API-here">
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
            {startLocation && endLocation ? (
              <DirectionServiceProvider
                destination={endLocation.geometry.location}
                origin={startLocation.geometry.location}
                outputDirections={(directions) => setDirections(directions)}
              />
            ) : null}

            {startLocation && endLocation && directions && (
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
          </>
        </GoogleMap>
      </LoadScript>
    </>
  );
}
export default React.memo(MyComponent);
