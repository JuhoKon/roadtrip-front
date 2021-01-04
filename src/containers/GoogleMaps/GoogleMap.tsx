import React from "react";
import { GoogleMap } from "@react-google-maps/api";

import { PlaceDetailResult } from "../../functions/API";

import DirectionsMemo from "./components/DirectionsRenderer";
import WayPointMarkers from "./components/WaypointMakers";
import Markers from "./components/Markers";

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

function checkIfPropsAreEqual(prevProps: any, nextProps: any) {
  return (
    prevProps.directions === nextProps.directions &&
    prevProps.waypointMarkerInfo === nextProps.waypointMarkerInfo &&
    prevProps.markers === nextProps.markers &&
    prevProps.zoom === nextProps.zoom &&
    prevProps.center === nextProps.center
  );
}

export default React.memo(GoogleMaps, checkIfPropsAreEqual);
