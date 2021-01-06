import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Chip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    marginBottom: 2,
    cursor: "pointer",
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
  removeListItem,
  place_id,
  alphabet,
  rating,
  types,
  photos,
}: {
  name: string;
  adr_address: string;
  url: string;
  mapsURL: string;
  removeListItem: (item: any) => void;
  place_id: string;
  alphabet?: string;
  rating: any;
  types: string[];
  photos: any;
}) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h5" style={{ marginBottom: "0px" }}>
          {name}
        </Typography>
        {alphabet ? (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "#ea4335",
              color: "white",
              borderRadius: "50%",
              height: "40px",
              width: "40px",
              alignSelf: "center",
              textAlign: "center",
              verticalAlign: "middle",
              lineHeight: "40px",
              boxShadow: "3px 2px 7px 0px rgba(0,0,0,0.75)",
            }}
          >
            {alphabet}
          </div>
        ) : null}

        <Button
          onClick={() => {
            removeListItem(place_id);
          }}
          style={{
            position: "absolute",
            color: "red",
            top: "25px",
            right: "0px",
          }}
        >
          <DeleteIcon />
        </Button>

        {/*           <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography> */}
      </CardContent>

      <div dangerouslySetInnerHTML={{ __html: adr_address }} />

      <Stars rating={rating} />
      <Badges types={types} />
      <CardActions style={{ zIndex: 10 }}>
        <Button
          disabled={!url}
          size="small"
          color="primary"
          href={url}
          target="_blank"
        >
          Learn More
        </Button>
        <Button
          disabled={!mapsURL}
          size="small"
          color="primary"
          href={mapsURL}
          target="_blank"
        >
          Google Maps
        </Button>
      </CardActions>
    </Card>
  );
}
const wantedItems = [
  "gas_station",
  "liquor_store",
  "park",
  "parking",
  "restaurant",
  "food",
  "spa",
  "store",
  "point_of_interest",
  "bar",
  "atm",
  "lodging",
  "shopping_mall",
  "cafe",
];

const getColor = (type: string) => {
  switch (type) {
    case "GAS STATION":
      return "#242f40";
    case "LIQUOR STORE":
      return "#5dd39e";
    case "PARK":
      return "#348aa7";
    case "PARKING":
      return "#525174";
    case "RESTAURANT":
      return "#513b56";
    case "FOOD":
      return "#242f40";
    case "SPA":
      return "#5dd39e";
    case "STORE":
      return "#348aa7";
    case "POINT OF INTEREST":
      return "#525174";
    case "BAR":
      return "#513b56";
    case "ATM":
      return "#525174";
    case "LODGING":
      return "orange";
    case "SHOPPING MALL":
      return "purple";
    case "CAFE":
      return "#513b56";
    default:
      return "#242f40";
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

  let res = items.filter((item: any) => wantedItems.includes(item));

  for (let item of res) {
    item = item.toUpperCase();
    item = item.split("_").join(" ");
    array.push(item);
  }
  return array;
};
