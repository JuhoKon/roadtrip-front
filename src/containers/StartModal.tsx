import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import SearchContainer from "./SearchContainer";
import { PlaceDetailResult } from "../functions/API";
import RoadTripImage from "../assets/roadtrip.jpg";
import { CardMedia, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  media: {
    height: 200,
  },
});

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
  const classes = useStyles();
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
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <CardMedia
            className={classes.media}
            image={RoadTripImage}
            title="Roadtrip"
          />
          <h2 style={{ position: "absolute", top: "20%", left: "30%" }}>
            Roadtrip Planner
          </h2>
        </div>

        <DialogContent>
          <Typography variant="body1">
            Welcome to Roadtrip planner! As the name states, this is a planner
            for creating roadtrips. Start by choosing a starting location and
            the destination with the forms below.
          </Typography>

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
