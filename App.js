import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import bg from "./assets/bg.png";
import React, { useState, useEffect } from "react";
import Row from "./src/components/Row";

const emptyMap = [
  ["", "", ""], // 1st Row
  ["", "", ""], // 2nd Row
  ["", "", ""], // 3rd Row
];

const copyArray = (original) => {
  const copy = original.map((arr) => {
    return arr.slice();
  });
  return copy;
};
export default function App() {
  const [map, setMap] = useState(emptyMap);
  const [currentTurn, setCurrentTurn] = useState("x");
  const [gameMode, setGameMode] = useState("BOT_MEDIUM"); // LOCAL, BOT_EASY, BOT_MEDIUM

  useEffect(() => {
    if (currentTurn === "o" && gameMode !== "LOCAL") {
      botTurn();
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    const winner = getWinner(map);
    if (winner) {
      gameWon(winner);
    } else if (checkTieState(map)) {
      showTieAlert();
    }
  }, [map]);

  const onPress = (rowIndex, columnIndex) => {
    if (map[rowIndex][columnIndex] !== "") {
      Alert.alert("Position already occupied");
      return;
    }

    setMap((existingMap) => {
      const updatedMap = [...existingMap];
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });

    setCurrentTurn(currentTurn === "x" ? "o" : "x");
  };

  const getWinner = (winnerMap) => {
    // check rows
    for (let i = 0; i < 3; i++) {
      const isRowXWinning = winnerMap[i].every((cell) => cell === "x");
      const isRowOWinning = winnerMap[i].every((cell) => cell === "o");
      if (isRowXWinning) {
        return "x";
      }

      if (isRowOWinning) {
        return "o";
      }
    }

    // check columns

    for (let col = 0; col < 3; col++) {
      let isColumnXWinner = true;
      let isColumnOWinner = true;

      for (let row = 0; row < 3; row++) {
        if (winnerMap[row][col] !== "x") {
          isColumnXWinner = false;
        }
        if (winnerMap[row][col] !== "o") {
          isColumnOWinner = false;
        }
      }

      if (isColumnXWinner) {
        return "x";
      }

      if (isColumnOWinner) {
        return "o";
      }
    }
    // check diagnols
    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;

    for (let i = 0; i < 3; i++) {
      if (winnerMap[i][i] !== "o") {
        isDiagonal1OWinning = false;
      }
      if (winnerMap[i][i] !== "x") {
        isDiagonal1XWinning = false;
      }

      if (winnerMap[i][2 - i] !== "o") {
        isDiagonal2OWinning = false;
      }
      if (winnerMap[i][2 - i] !== "x") {
        isDiagonal2XWinning = false;
      }
    }

    if (isDiagonal1OWinning || isDiagonal2OWinning) {
      return "o";
    }
    if (isDiagonal1XWinning || isDiagonal2XWinning) {
      return "x";
    }
  };

  const checkTieState = (currentMap) => {
    return currentMap.every((row) => row.every((cell) => cell !== ""));
  };

  const showTieAlert = () => {
    Alert.alert("It's a Tie!", "Restart the game?", [
      {
        text: "Restart",
        onPress: resetGame,
      },
    ]);
  };

  const gameWon = (player) => {
    Alert.alert(`Congratulations!`, `Player ${player.toUpperCase()} won!`, [
      {
        text: "Restart",
        onPress: resetGame,
      },
    ]);
  };

  const resetGame = () => {
    setMap([
      ["", "", ""], // 1st Row
      ["", "", ""], // 2nd Row
      ["", "", ""], // 3rd Row
    ]);
    setCurrentTurn("x");
  };

  const botTurn = () => {
    // collect all possible options
    const possiblePositions = [];
    map.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === "") {
          possiblePositions.push({ row: rowIndex, col: columnIndex });
        }
      });
    });

    let choosenOption;

    if (gameMode === "BOT_MEDIUM") {
      // Attack
      possiblePositions.forEach((pos) => {
        const mapCopy = copyArray(map);
        mapCopy[pos.row][pos.col] = "o";
        if (getWinner(mapCopy) === "o") choosenOption = pos;
      });

      if (!choosenOption) {
        // defend
        // check if opponent WINs if it takes one of the possible position
        possiblePositions.forEach((pos) => {
          const mapCopy = copyArray(map);
          mapCopy[pos.row][pos.col] = "x";

          if (getWinner(mapCopy) === "x") choosenOption = pos;
        });
      }
    }
    // choose random
    if (!choosenOption) {
      choosenOption =
        possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }
    if (choosenOption) {
      onPress(choosenOption.row, choosenOption.col);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.bg}>
        <Text style={styles.currentTurnText}>
          Current Turn - {currentTurn.toUpperCase()}
        </Text>
        <View style={styles.map}>
          {map.map((row, rowIndex) => (
            <Row
              key={`row-${rowIndex}`}
              row={row}
              rowIndex={rowIndex}
              onPress={onPress}
            />
          ))}
        </View>
        <View style={styles.buttons}>
          <Text
            onPress={() => setGameMode("LOCAL")}
            style={[
              styles.button,
              {
                backgroundColor: gameMode === "LOCAL" ? "lightblue" : "#F5E0B4",
              },
            ]}
          >
            Local
          </Text>
          <Text
            onPress={() => setGameMode("BOT_EASY")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "BOT_EASY" ? "lightblue" : "#F5E0B4",
              },
            ]}
          >
            Easy Bot
          </Text>
          <Text
            onPress={() => setGameMode("BOT_MEDIUM")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "BOT_MEDIUM" ? "lightblue" : "#F5E0B4",
              },
            ]}
          >
            Medium Bot
          </Text>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bg: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  currentTurnText: {
    fontSize: 30,
    padding: 10,
    fontWeight: "bold",
    color: "black",
    position: "absolute",
    backgroundColor: "#F5E0B4",
    top: 50,
  },
  map: {
    width: "90%",
    aspectRatio: 2 / 3,
  },
  buttons: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
  },
  button: {
    color: "black",
    margin: 10,
    fontSize: 30,
    fontWeight: "bold",
    backgroundColor: "#F5E0B4",
    padding: 10,
    paddingHorizontal: 15,
  },
});
