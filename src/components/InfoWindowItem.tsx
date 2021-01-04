import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Chip } from "@material-ui/core";
import { PLACETYPES } from "../other/Constants";

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    marginBottom: 5,
    position: "relative",
    textAlign: "center",
  },
  media: {
    height: 140,
  },
  customBadge: {
    backgroundColor: "#00AFD7",
    color: "white",
  },
});

export default function ListItem({
  name,
  adr_address,
  url,
  mapsURL,
  addMarker,
  place_id,
  alphabet,
  rating,
  types,
  photos,
  showWayPointButton,
  loading,
}: {
  name: string;
  adr_address: string;
  url: string;
  mapsURL: string;
  addMarker: () => void;
  place_id: string;
  alphabet?: string;
  rating: any;
  types: string[];
  photos: any;
  showWayPointButton: boolean;
  loading?: boolean;
}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        <Typography gutterBottom variant="h5" style={{ marginBottom: "0px" }}>
          {name}
        </Typography>
      </div>
      <div dangerouslySetInnerHTML={{ __html: adr_address }} />
      <Stars rating={rating} />
      <Badges types={types} />
      <div style={{ zIndex: 10 }}>
        <br />
        <Button
          style={{ marginRight: 25 }}
          variant="contained"
          disabled={!url}
          size="small"
          color="primary"
          href={url}
          target="_blank"
        >
          {loading ? "Loading..." : "Learn More"}
        </Button>

        <Button
          disabled={!showWayPointButton}
          style={{ marginLeft: 25 }}
          variant="contained"
          onClick={() => addMarker()}
          size="small"
          color="primary"
        >
          Add waypoint
        </Button>
      </div>
    </div>
  );
}
const getColor = (type: string) => {
  switch (type) {
    case "GAS STATION":
      return "green";
    case "LIQUOR STORE":
      return "blue";
    case "PARK":
      return "orange";
    case "PARKING":
      return "green";
    case "RESTAURANT":
      return "blue";
    case "FOOD":
      return "purple";
    case "SPA":
      return "purple";
    case "STORE":
      return "green";
    case "POINT OF INTEREST":
      return "blue";
    case "BAR":
      return "green";
    case "ATM":
      return "blue";
    case "LODGING":
      return "orange";
    case "SHOPPING MALL":
      return "purple";
    case "CAFE":
      return "green";
    default:
      return "red";
  }
};
const Badges = (types: any) => {
  const items = getTypeNames(types.types);
  return (
    <>
      {items.map((item) => (
        <Chip
          label={item}
          style={{
            background: getColor(item),
            color: "white",
            fontWeight: "bold",
            margin: "5px",
          }}
        />
      ))}
    </>
  );
};
const Stars = (rating: any) => {
  if (typeof rating.rating === "undefined") return <></>;
  const numberOfStars = Math.round(rating.rating);
  const goldenStar = (
    <span style={{ fontSize: "15px", color: "red" }}>&#9733;</span>
  );
  const greyStar = (
    <span style={{ fontSize: "15px", color: "black" }}>&#9733;</span>
  );
  return (
    <div style={{ alignContent: "center", textAlign: "center" }}>
      {numberOfStars > 0 ? goldenStar : greyStar}
      {numberOfStars > 1 ? goldenStar : greyStar}
      {numberOfStars > 2 ? goldenStar : greyStar}
      {numberOfStars > 3 ? goldenStar : greyStar}
      {numberOfStars > 4 ? goldenStar : greyStar}
    </div>
  );
};
const getTypeNames = (items: any): string[] => {
  let array = [];
  let res = items.filter((item: any) => PLACETYPES.includes(item));

  for (let item of res) {
    item = item.toUpperCase();
    item = item.replaceAll("_", " ");
    array.push(item);
  }
  return array;
};
