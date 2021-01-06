import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import InfoWindowItem from "../../../components/InfoWindowItem";

const InfoWindowHandler = ({ marker, addWayPoint }: any) => {
  const [selectedMarker, setSelectedMarker] = React.useState<any | undefined>(
    marker
  );
  React.useEffect(() => {
    setSelectedMarker(marker);
  }, [marker]);
  return (
    <>
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
            showWayPointButton={true}
          />
        </InfoWindow>
      )}
      )
    </>
  );
};

export default InfoWindowHandler;
