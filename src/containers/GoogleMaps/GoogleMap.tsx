import React from "react";
import { GoogleMap } from "@react-google-maps/api";

import { PlaceDetailResult, RetrievePlaceDetails } from "../../functions/API";

import DirectionsMemo from "./components/DirectionsRenderer";
import WayPointMarkers from "./components/WaypointMakers";
import Markers from "./components/Markers";
import InfoWindowHandler from "./components/InfoWindowHandler";

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
  const [result, setResult] = React.useState<any | undefined>(undefined);
  //refi google mapsiin täällä
  //click listeneri, tai onClick homma
  //katotaan onko eventillä placeID, jos on
  // näytetään oma infowindow?
  // pitäis olla ez pz?
  // ehkä oma memo sille, jos tää alkaa sekoilla
  const handleClick = async (event: any) => {
    console.log(event);
    if (event.placeId) {
      // Have clicked on a point of interest (marker on default google maps)
      event.stop(); // Stop the default infowindow from showing
      const result = await RetrievePlaceDetails(event.placeId);
      setResult(result);
    }
  };
  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom ? zoom : 14}
        onClick={(e) => handleClick(e)}
      >
        <>
          {directions && <DirectionsMemo directions={directions} />}
          <Markers items={markers} addWayPoint={addWayPoint} />
          <WayPointMarkers
            items={waypointMarkerInfo}
            addWayPoint={addWayPoint}
          />
          <InfoWindowHandler marker={result} addWayPoint={addWayPoint} />
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
    prevProps.center === nextProps.center &&
    prevProps.addWayPoint === nextProps.addWayPoint
  );
}

export default React.memo(GoogleMaps, checkIfPropsAreEqual);
