import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Chip, CircularProgress } from "@material-ui/core";
import { PLACETYPES } from "../other/Constants";
import { GetPhoto } from "../functions/API";

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
  console.log(photos);
  const classes = useStyles();
  const [photo, setPhoto] = React.useState<any | undefined>(undefined);
  const [loadingPhoto, setLoadingPhoto] = React.useState(false);
  React.useEffect(() => {
    const GetPhotos = async () => {
      if (!photos) {
        return;
      }
      setLoadingPhoto(true);
      const result = await GetPhoto({ photoId: photos[0].photo_reference });
      setLoadingPhoto(false);
      setPhoto(result);
    };
    GetPhotos();
  }, [photos]);
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
        {loadingPhoto ? (
          <div>
            <CircularProgress />
          </div>
        ) : null}
        {photos && !loadingPhoto ? (
          <img src={photo} alt="point of interest" width="200"></img>
        ) : null}
        <br />
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
      {items.map((item, index) => (
        <Chip
          key={index}
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
    item = item.split("_").join(" ");
    array.push(item);
  }
  return array;
};
