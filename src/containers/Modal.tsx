import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SearchContainer from "./SearchContainer";
import { PlaceDetailResult } from "../functions/GoogleMaps";

const Modal = ({
  setStartLocation,
  setEndLocation,
}: {
  setStartLocation: (value: PlaceDetailResult | undefined) => void;
  setEndLocation: (value: PlaceDetailResult | undefined) => void;
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Roadtrip planner</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Welcome to Roadtrip planner! As the name states, this is a planner
            for roadtrips. Start by choosing a starting location and the
            destination with the forms below.
          </DialogContentText>
          <br />
          <SearchContainer
            setStartLocation={setStartLocation}
            setEndLocation={setEndLocation}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Next step
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Modal;
