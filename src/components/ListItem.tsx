import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import { Chip } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    background: "#e0e0e0b3",
    marginBottom: 5,
    cursor: "pointer",
    position: "relative",
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
  console.log(photos);
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
              background: "red",
              color: "white",
              borderRadius: "50%",
              height: "40px",
              width: "40px",
              alignSelf: "center",
              textAlign: "center",
              verticalAlign: "middle",
              lineHeight: "40px",
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
          x
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
];

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

  let res = items.filter((item: any) => wantedItems.includes(item));
  console.log(res);
  console.log(items);
  for (let item of res) {
    console.log(item);
    item = item.toUpperCase();
    item = item.replaceAll("_", " ");
    array.push(item);
  }
  return array;
};
