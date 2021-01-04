import React from "react";
import { DirectionsRenderer } from "@react-google-maps/api";

const DirectionsRender = ({ directions }: any) => {
  return (
    <DirectionsRenderer
      options={{
        directions: directions,
        suppressMarkers: true,
      }}
    />
  );
};
function checkIfPropsAreEqual2(prevProps: any, nextProps: any) {
  return prevProps.directions === nextProps.directions;
}

const DirectionsMemo = React.memo(DirectionsRender, checkIfPropsAreEqual2);
export default DirectionsMemo;
