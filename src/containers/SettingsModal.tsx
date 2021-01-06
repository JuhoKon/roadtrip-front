import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  CircularProgress,
  Typography,
} from "@material-ui/core";

const Modal = ({
  handleClose,
  handleOpen,
  showModal,
  getNearbyPlaces,
  canWeShowSettings,
}: {
  showModal: boolean;
  getNearbyPlaces: (settings: any) => Promise<void>;
  handleClose: () => void;
  handleOpen: () => void;
  canWeShowSettings: boolean;
}) => {
  const [isLoading, setLoading] = React.useState(false);
  const [type, setType] = React.useState("");
  const [keyword, setKeyword] = React.useState("");
  const handleChangeType = (event: any) => {
    setType(event.target.value);
  };
  const handleChangeKeyword = (event: any) => {
    setKeyword(event.target.value);
  };

  return (
    <div>
      <div
        style={{ position: "absolute", top: "50%", left: "50%", zIndex: 40000 }}
      >
        {isLoading ? <CircularProgress /> : null}
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        disabled={!canWeShowSettings}
      >
        Place search
      </Button>
      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Search for places along the route
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Here you can choose what kind of activities you want to search from
            the map! Everything here is <strong>optional</strong>, if you don't
            want to specify anything, just click the <strong>Search</strong> -
            button!
          </Typography>
          <br />
          <Typography variant="body2">
            Note: The <strong>Show me everything</strong> - option shows what
            Google Maps think are the most relevant results.
          </Typography>
          <br />
          <FormControl component="fieldset">
            <FormLabel component="legend">Type:</FormLabel>
            <RadioGroup
              aria-label="type"
              name="type1"
              value={type}
              onChange={handleChangeType}
            >
              <FormControlLabel
                value="lodging"
                control={<Radio />}
                label="Lodging"
              />
              <FormControlLabel
                value="gas_station"
                control={<Radio />}
                label="Gas"
              />
              <FormControlLabel value="cafe" control={<Radio />} label="Cafe" />
              <FormControlLabel
                value="shopping_mall"
                control={<Radio />}
                label="Shopping"
              />
              <FormControlLabel
                value="restaurant"
                control={<Radio />}
                label="Restaurant"
              />
              <FormControlLabel value="bar" control={<Radio />} label="Bar" />
              <FormControlLabel
                value="tourist_attraction"
                control={<Radio />}
                label="Tourist Attraction"
              />
              <FormControlLabel
                value="none"
                control={<Radio />}
                label="Show me everything!"
              />
            </RadioGroup>
          </FormControl>

          <div>
            <br />
            <FormLabel component="legend">
              Enter a keyword (leave empty for no preference):
            </FormLabel>

            <TextField
              id="standard-multiline-flexible"
              label="Keyword"
              multiline
              rowsMax={4}
              value={keyword}
              onChange={handleChangeKeyword}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={async () => {
              setLoading(true);
              await getNearbyPlaces({ type, keyword });
              setLoading(false);
              handleClose();
            }}
            color="primary"
          >
            {isLoading ? "Loading..." : "Search"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Modal;
