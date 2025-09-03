import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share } from "react-native";
import { Link } from "expo-router";
import { useJokes } from "@/context/JokesContext";

const COLORS = ["#FFD700", "#FFB6C1", "#87CEFA", "#90EE90", "#FFA07A", "#DDA0DD"];
const EMOJIS = ["🤣", "😂", "😎", "🥳", "🤪", "🤩"];

export default function Saved() {
  const { savedJokes, deleteJoke } = useJokes();

  const shareJoke = async (joke: string) => {
    try {
      await Share.share({ message: joke });
    } catch (error) {
      console.log("Error sharing joke:", error);
    }
  };

  const getRandomStyle = () => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    return { backgroundColor: color, emoji };
  };

  return (
    
    <View style={styles.container}>
      <Link href="/">
        <Text style={styles.back}>⬅</Text>
      </Link>
      <Text style={styles.title}>Saved Jokes</Text>

      {savedJokes.length === 0 ? (
        <Text style={styles.empty}>No jokes saved yet!</Text>
      ) : (
        <FlatList
          data={savedJokes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const { backgroundColor, emoji } = getRandomStyle();
            return (
              <View style={[styles.card, { backgroundColor }]}>
                <Text style={styles.emoji}>{emoji}</Text>
                <Text style={styles.joke}>{item}</Text>
                <View style={styles.buttonsRow}>
                  <TouchableOpacity onPress={() => deleteJoke(index)}>
                    <Text style={styles.delete}>❌</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => shareJoke(item)}>
                    <Text style={styles.share}>📤</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  empty: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  emoji: {
    position: "absolute",
    bottom: -8,
    left: -2,
    fontSize: 24,
  },
  joke: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  delete: {
    fontSize: 18,
    color: "red",
    marginRight: 16,
  },
  share: {
    fontSize: 18,
    color: "blue",
  },
  back: {
    fontSize: 24,
    color: "grey",
    textAlign: "center",
  },
});
