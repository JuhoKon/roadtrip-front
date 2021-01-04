import React from "react";
import { InfoWindow, Marker, MarkerClusterer } from "@react-google-maps/api";
import { RetrievePlaceDetails } from "../../../functions/API";
import { PLACETYPES } from "../../../other/Constants";

import InfoWindowItem from "../../../components/InfoWindowItem";

import gas_station from "../../../assets/gas-pump.png";
import gps from "../../../assets/gps.png";
import coffee from "../../../assets/coffee.png";
import mall from "../../../assets/mall.png";
import point_of_interest from "../../../assets/point-of-interest.png";
import restaurant from "../../../assets/restaurant.png";
import shops from "../../../assets/shops.png";
import spa from "../../../assets/spa.png";
import hotel from "../../../assets/hotel.png";
import park from "../../../assets/park.png";
import bar from "../../../assets/bar.png";

const Markers = ({ items, addWayPoint }: any) => {
  const options = {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    minimumClusterSize: 5,
  };

  const [selectedMarker, setSelectedMarker] = React.useState<any | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(false);
  return (
    <>
      {items && (
        <MarkerClusterer options={options}>
          {(clusterer) =>
            items.map((marker: any) => (
              <Marker
                key={marker.place_id}
                position={marker.geometry.location}
                onClick={async () => {
                  setLoading(true);
                  setSelectedMarker(marker);
                  const result = await RetrievePlaceDetails(marker.place_id);
                  setLoading(false);
                  setSelectedMarker(result);
                }}
                clusterer={clusterer}
                icon={{
                  url: getIcon(marker.types),
                  origin: new google.maps.Point(0, 0),
                }}
              />
            ))
          }
        </MarkerClusterer>
      )}
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
            loading={loading}
          />
        </InfoWindow>
      )}
      )
    </>
  );
};
const getIcon = (types: any[]) => {
  let item;
  for (let i = 0; i < PLACETYPES.length; i++) {
    if (types.includes(PLACETYPES[i])) {
      item = PLACETYPES[i];
      break;
    }
  }
  if (item) {
    switch (item) {
      case "gas_station":
        return gas_station;
      case "shopping_mall":
        return mall;
      case "cafe":
        return coffee;
      case "store":
        return shops;
      case "point_of_interest":
        return point_of_interest;
      case "restaurant":
        return restaurant;
      case "spa":
        return spa;
      case "lodging":
        return hotel;
      case "park":
        return park;
      case "food":
        return restaurant;
      case "bar":
        return bar;
      default:
        return gps;
    }
  }
  return gps;
};
export default Markers;
