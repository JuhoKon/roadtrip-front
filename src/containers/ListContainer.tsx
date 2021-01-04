import React, { Component } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import ListItem from "../components/ListItem";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 800,
  },
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
}));

const SortableItem = SortableElement(({ item, removeListItem }: any) => (
  <ListItem
    name={item.name}
    adr_address={item.adr_address}
    url={item.website}
    mapsURL={item.url}
    removeListItem={removeListItem}
    place_id={item.place_id}
    alphabet={item.alphabet}
    rating={item.rating}
    types={item.types}
    photos={item.photos}
  />
));

const SortableList = SortableContainer(({ items, removeListItem }: any) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {items.map((item: any, index: number) => (
        <SortableItem
          key={`item-${item.place_id}`}
          index={index}
          item={item}
          removeListItem={removeListItem}
        />
      ))}
    </List>
  );
});

class ListContainer extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      items: props.items,
    };
  }
  componentDidUpdate(prevProps: any) {
    // Typical usage (don't forget to compare props):
    if (this.props.items !== prevProps.items) {
      this.setState({ items: this.props.items });
    }
  }
  onSortEnd = ({ oldIndex, newIndex }: any) => {
    this.setState(({ items }: any) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));
    this.props.setItems(this.state.items);
  };

  render() {
    return (
      <>
        {this.props.items.length > 0 ? (
          <>
            <SortableList
              distance={1}
              items={this.state.items}
              onSortEnd={this.onSortEnd}
              removeListItem={this.props.removeListItem}
            />
            {this.props.routeLength && (
              <div>
                <p>Trip length: {this.props.routeLength?.distance}</p>
                <p>Estimated duration: {this.props.routeLength?.duration}</p>
              </div>
            )}
          </>
        ) : (
          <div>
            Welcome to Roadtrip Planner! Start by either searching for locations
            from the field above Google Maps or by clicking the "Start Over" -
            button!
          </div>
        )}
      </>
    );
  }
}
export default ListContainer;
