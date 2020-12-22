import { Container, Typography } from "@material-ui/core";
import React from "react";
import SearchField from "../components/AsynchronousField";
import { PlaceDetailResult } from "../functions/GoogleMaps";
import GoogleMaps from "../components/GoogleMap";
const MapContainer = ({
  center,
  zoom,
  startLocation,
  endLocation,
}: {
  center?: { lat: number; lng: number };
  zoom?: number;
  startLocation: PlaceDetailResult | undefined;
  endLocation: PlaceDetailResult | undefined;
}) => {
  return (
    <div>
      <GoogleMaps
        center={center}
        zoom={zoom}
        startLocation={startLocation}
        endLocation={endLocation}
      />
    </div>
  );
};

export default MapContainer;
