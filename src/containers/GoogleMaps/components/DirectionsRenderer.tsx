import React from "react";
import { DirectionsRenderer } from "@react-google-maps/api";

const DirectionsRender = ({ directions }: any) => {
  let element: any = document.getElementById("directionspanel");
  if (element === null) {
    element = undefined;
  }
  if (element !== null) {
    element.innerHTML = "";
  }
  return (
    <>
      <DirectionsRenderer
        options={{
          directions: directions,
          suppressMarkers: true,
          panel: element,
        }}
      />
    </>
  );
};
function checkIfPropsAreEqual2(prevProps: any, nextProps: any) {
  return prevProps.directions === nextProps.directions;
}

const DirectionsMemo = React.memo(DirectionsRender, checkIfPropsAreEqual2);
export default DirectionsMemo;
