import { Container, Typography } from "@material-ui/core";
import React from "react";
import SearchField from "../components/AsynchronousField";
import { PlaceDetailResult } from "../functions/GoogleMaps";
import GoogleMaps from "../components/GoogleMap";
const MapContainer = ({
  center,
  zoom,
}: {
  center?: { lat: number; lng: number };
  zoom?: number;
}) => {
  return (
    <div>
      <GoogleMaps center={center} zoom={zoom} />
    </div>
  );
};

export default MapContainer;
