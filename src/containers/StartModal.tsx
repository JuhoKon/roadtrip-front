import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SearchContainer from "./SearchContainer";
import { PlaceDetailResult } from "../functions/API";

const Modal = ({
  setStartLocation,
  setEndLocation,
  showModal,
  calculateDirectionAndWaypoints,
  showSettings,
  startOver,
}: {
  setStartLocation: (value: PlaceDetailResult | undefined) => void;
  setEndLocation: (value: PlaceDetailResult | undefined) => void;
  showModal: boolean;
  calculateDirectionAndWaypoints: () => void;
  showSettings: () => void;
  startOver: () => void;
}) => {
  const [open, setOpen] = React.useState(showModal);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handleClickOpen();
          startOver();
        }}
      >
        Start over
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
          <Button
            onClick={() => {
              calculateDirectionAndWaypoints();
              handleClose();
              showSettings();
            }}
            color="primary"
          >
            Next step
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default Modal;
