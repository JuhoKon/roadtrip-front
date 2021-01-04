import React from "react";

import GoogleMaps from "../components/GoogleMap";
import { PlaceDetailResult } from "../functions/GoogleMaps";
const MapContainer = ({
  center,
  zoom,
  directions,
  addWayPoint,
  waypointMarkerInfo,
  markers,
}: {
  center?: { lat: number; lng: number };
  zoom?: number;
  directions?: google.maps.DirectionsResult;
  addWayPoint: (item: any) => void;
  waypointMarkerInfo?: PlaceDetailResult[];
  markers?: any;
}) => {
  return (
    <GoogleMaps
      addWayPoint={addWayPoint}
      center={center}
      zoom={zoom}
      directions={directions}
      waypointMarkerInfo={waypointMarkerInfo}
      markers={markers}
    />
  );
};

export default MapContainer;
