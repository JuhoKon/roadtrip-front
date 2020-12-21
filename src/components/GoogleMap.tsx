import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }: any) => <div>{text}</div>;

const GoogleMaps = ({
  center,
  zoom,
}: {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}) => {
  console.log(zoom, center);
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "70vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "API_KEY_HERE" }}
        defaultCenter={{ lat: 61.0601593, lng: 28.1826022 }}
        defaultZoom={8}
        center={center}
        zoom={zoom ? zoom : 8}
        yesIWantToUseGoogleMapApiInternals
      >
        <AnyReactComponent
          lat={center?.lat}
          lng={center?.lng}
          text="I am marker"
        />
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMaps;
