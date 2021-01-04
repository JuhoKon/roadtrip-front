import React from "react";
import SearchField from "../components/AsynchronousField";
import { PlaceDetailResult } from "../functions/GoogleMaps";

const SearchContainer = ({
  setLocation,
}: {
  setLocation: (value: PlaceDetailResult | undefined) => void;
}) => {
  return (
    <div style={{ maxWidth: "500px", marginBottom: "10px" }}>
      <SearchField
        isForForm={false}
        isStart={false}
        placeholder="Search for a location"
        setLocation={(selectedLocation: PlaceDetailResult | undefined) =>
          setLocation(selectedLocation)
        }
      />
    </div>
  );
};

export default SearchContainer;
