import React from "react";

import GoogleMaps from "../components/GoogleMap";
const MapContainer = ({
  center,
  zoom,
  directions,
  addWayPoint,
  removeListItem,
}: {
  center?: { lat: number; lng: number };
  zoom?: number;
  directions?: google.maps.DirectionsResult;
  addWayPoint: (item: any) => void;
  removeListItem: (item: any) => void;
}) => {
  return (
    <div>
      <GoogleMaps
        addWayPoint={addWayPoint}
        removeListItem={removeListItem}
        center={center}
        zoom={zoom}
        directions={directions}
      />
    </div>
  );
};

export default MapContainer;
