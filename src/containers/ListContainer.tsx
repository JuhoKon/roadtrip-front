import React, { Component } from "react";
import { render } from "react-dom";
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

const SortableItem = SortableElement(({ item }: any) => (
  <ListItem name={item.name} adr_address={item.adr_address} url={item.url} />
));

const SortableList = SortableContainer(({ items }: any) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {items.map((item: any, index: number) => (
        <SortableItem key={`item-${item.place_id}`} index={index} item={item} />
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
  };

  render() {
    console.log(this.props);
    return (
      <SortableList
        distance={1}
        items={this.state.items}
        onSortEnd={this.onSortEnd}
      />
    );
  }
}
export default ListContainer;
