import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    background: "#e0e0e0b3",
    marginBottom: 5,
    cursor: "pointer",
  },
  media: {
    height: 140,
  },
});

export default function ListItem({
  name,
  adr_address,
  url,
}: {
  name: string;
  adr_address: string;
  url: string;
}) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
        <Button style={{ float: "right", color: "red" }}>x</Button>
        {/*           <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography> */}
      </CardContent>
      <div dangerouslySetInnerHTML={{ __html: adr_address }} />

      <CardActions style={{ zIndex: 10 }}>
        <Button size="small" color="primary" href={url} target="_blank">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
