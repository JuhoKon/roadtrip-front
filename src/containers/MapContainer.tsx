import React from "react";

import GoogleMaps from "../components/GoogleMap";
import { PlaceDetailResult } from "../functions/GoogleMaps";
const MapContainer = ({
  center,
  zoom,
  directions,
  addWayPoint,
  removeListItem,
  waypointMarkerInfo,
}: {
  center?: { lat: number; lng: number };
  zoom?: number;
  directions?: google.maps.DirectionsResult;
  addWayPoint: (item: any) => void;
  removeListItem: (item: any) => void;
  waypointMarkerInfo?: PlaceDetailResult[];
}) => {
  console.log(waypointMarkerInfo);
  return (
    <GoogleMaps
      addWayPoint={addWayPoint}
      removeListItem={removeListItem}
      center={center}
      zoom={zoom}
      directions={directions}
      waypointMarkerInfo={waypointMarkerInfo}
    />
  );
};

export default MapContainer;
