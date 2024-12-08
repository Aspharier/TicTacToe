import { View, StyleSheet, Pressable } from "react-native";
import React from "react";
import Cross from "./cross";

const Cell = (props) => {
  const { cell, onPress } = props;
  return (
    <Pressable
      onPress={() => onPress()}
      style={styles.cell}
    >
      {cell === "o" && <View style={styles.circle} />}
      {cell === "x" && <Cross />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  circle: {
    // left: 0 * 162,
    // top: 0 * 250,
    flex: 1,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#F5E0B4",
    borderWidth: 25,
    margin: 10,
  },
  cell: {
    width: 150,
    height: 150,
    flex: 1,
  },
});

export default Cell;
