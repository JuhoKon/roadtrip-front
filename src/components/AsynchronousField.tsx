import React from "react";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab/";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";
import { GoogleMapsAutoComplete } from "../functions/GoogleMaps";
GoogleMapsAutoComplete("Yhdyskatu");
var debounce = require("lodash.debounce");

const useStyles = makeStyles((theme) => ({
  spinner: {
    color: "#03dac5",
  },
  formControl: {
    marginTop: theme.spacing(5),
    width: "400px",
  },
}));

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function Asynchronous() {
  const [open, setOpen] = React.useState(false);

  const [options, setOptions] = React.useState([]);

  const [loading, setLoading] = React.useState(false);

  const [values, setValues] = React.useState({
    appointment: "",
    chosenCustomer: { name: "" },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = React.useCallback(
    debounce(async (nextValue: any) => {
      //Fetch data
      //Set it to options via setOptions
      console.log(nextValue);
      setLoading(false);
    }, 1000),
    []
  );

  const handleChange = async (query: string) => {
    setLoading(true);
    debouncedSave(query);
  };

  return (
    <Autocomplete
      id="asynchronous-demo"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option: any, value: any) =>
        option.name === value.name
      }
      getOptionLabel={(option: any) => option.name}
      options={options}
      loading={loading}
      onChange={(event, newValue) => {
        if (newValue) {
          console.log("hello");
          setValues({ ...values, chosenCustomer: newValue });
        } else {
          setValues({
            ...values,
            chosenCustomer: { name: "" },
            appointment: "",
          });
        }
      }}
      renderInput={(params: any) => (
        <TextField
          {...params}
          label="Point A"
          variant="outlined"
          onChange={(e) => {
            handleChange(e.target.value);
            setValues({ ...values, chosenCustomer: { name: "" } });
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
      )}
    />
  );
}
