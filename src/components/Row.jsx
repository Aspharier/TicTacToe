import { View, StyleSheet } from "react-native";
import React from "react";
import Cell from "./Cell";

const Row = (props) => {
  const { row, rowIndex, onPress } = props;
  return (
    <View key={`row-${rowIndex}`} style={styles.row}>
      {row.map((cell, columnIndex) => (
        <Cell
          key={`row-${rowIndex}-col-${columnIndex}`}
          cell={cell}
          onPress={() => onPress(rowIndex, columnIndex)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
  },
});
export default Row;
