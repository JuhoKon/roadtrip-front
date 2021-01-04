import React from "react";
import SearchField from "../components/AsynchronousField";
import { PlaceDetailResult } from "../functions/API";

const SearchContainer = ({
  setStartLocation,
  setEndLocation,
}: {
  setStartLocation: (value: PlaceDetailResult | undefined) => void;
  setEndLocation: (value: PlaceDetailResult | undefined) => void;
}) => {
  return (
    <div style={{ maxWidth: "500px" }}>
      <SearchField
        isForForm={true}
        isStart={true}
        placeholder="Start location"
        setLocation={(selectedLocation: PlaceDetailResult | undefined) =>
          setStartLocation(selectedLocation)
        }
      />
      <br />
      <SearchField
        isForForm={true}
        isStart={false}
        placeholder="End location"
        setLocation={(selectedLocation: PlaceDetailResult | undefined) =>
          setEndLocation(selectedLocation)
        }
      />
      <br />
    </div>
  );
};

export default SearchContainer;
