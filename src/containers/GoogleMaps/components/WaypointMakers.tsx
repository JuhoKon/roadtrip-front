import { InfoWindow, Marker } from "@react-google-maps/api";
import React from "react";
import InfoWindowItem from "../../../components/InfoWindowItem";
import { ALPHABET } from "../../../other/Constants";

const WayPointMarkers = ({ items, addWayPoint }: any) => {
  const [selectedMarker, setSelectedMarker] = React.useState<any | undefined>(
    undefined
  );
  return (
    <>
      {items &&
        items.map((marker: any, index: number) => (
          <Marker
            key={marker.geometry.location.lat + marker.name}
            position={marker.geometry.location}
            onClick={() => {
              setSelectedMarker(marker);
            }}
            label={{ text: ALPHABET[index], color: "white" }}
            zIndex={5050}
          />
        ))}
      {selectedMarker && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedMarker(null);
          }}
          position={{
            lat: selectedMarker.geometry.location.lat + 0.0001,
            lng: selectedMarker.geometry.location.lng,
          }}
        >
          <InfoWindowItem
            name={selectedMarker.name}
            adr_address={selectedMarker.adr_address}
            url={selectedMarker.website}
            mapsURL={selectedMarker.url}
            place_id={selectedMarker.place_id}
            alphabet={selectedMarker.alphabet}
            rating={selectedMarker.rating}
            types={selectedMarker.types}
            photos={selectedMarker.photos}
            addMarker={() => addWayPoint(selectedMarker)}
            showWayPointButton={false}
          />
        </InfoWindow>
      )}
      )
    </>
  );
};

export default WayPointMarkers;
