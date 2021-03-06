import React from "react";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab/";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  GoogleMapsAutoComplete,
  AutoCompleteResult,
  RetrievePlaceDetails,
  PlaceDetailResult,
} from "../functions/API";
import { InputLabel } from "@material-ui/core";

const debounce = require("lodash.debounce");

export default function Asynchronous({
  setLocation,
  placeholder,
  isStart,
  isForForm,
}: {
  setLocation: (selectedOption: PlaceDetailResult | undefined) => void;
  placeholder: string;
  isStart: boolean;
  isForForm: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  const [options, setOptions] = React.useState<AutoCompleteResult[] | []>([]);

  const [loading, setLoading] = React.useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = React.useCallback(
    debounce(async (nextValue: any) => {
      //Fetch data
      //Set it to options via setOptions
      if (nextValue === "") {
        setLoading(false);
        return;
      }
      const data = await GoogleMapsAutoComplete(nextValue);
      setOptions(data);
      setLoading(false);
    }, 140),
    []
  );

  const handleChange = async (query: string) => {
    setLoading(true);
    debouncedSave(query);
  };
  return (
    <Autocomplete
      autoComplete={true}
      id={"asynchronous-demo" + Math.random()}
      open={open}
      clearOnBlur={false}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      filterOptions={(options: any[], state) => {
        return options;
      }}
      getOptionSelected={(option: any, value: any) =>
        option.description === value.description
      }
      getOptionLabel={(option: any) => option.description}
      options={options}
      loading={loading}
      onChange={async (event, newValue: AutoCompleteResult) => {
        if (newValue) {
          const details = await RetrievePlaceDetails(newValue.place_id);
          setLocation(details);
        } else {
          setLocation(undefined);
        }
      }}
      renderInput={(params: any) => (
        <>
          {isForForm ? (
            <InputLabel htmlFor="input-with-icon-adornment">
              {isStart
                ? "Select a starting location"
                : "Select an end location"}
              <br />
              <br />
            </InputLabel>
          ) : null}

          <TextField
            {...params}
            label={placeholder}
            variant="outlined"
            onChange={(e) => {
              handleChange(e.target.value);
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        </>
      )}
    />
  );
}
