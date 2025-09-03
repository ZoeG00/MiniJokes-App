import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Link } from "expo-router";
import { useJokes } from "@/context/JokesContext";

export default function Index() {
  const [joke, setJoke] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { savedJokes, saveJoke } = useJokes();

  const getJoke = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://official-joke-api.appspot.com/random_joke");
      const data = await res.json();
      setJoke(`${data.setup} 🤣 ${data.punchline}`);
    } catch (e) {
      setJoke("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJoke();
  }, []);

  const isDuplicate = joke ? savedJokes.includes(joke) : false;

  const handleSave = () => {
    if (!joke) return;
    if (isDuplicate) {
      Alert.alert("⚠️ Oops", "Este chiste ya está guardado.");
      return;
    }
    saveJoke(joke);
    Alert.alert("✅ Guardado", "El chiste fue guardado en tu lista.");
  };

  const [setup, punchline] = (joke ?? "").split(" 🤣 ");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤣 Joke App</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <View style={styles.card}>
          <Text style={styles.setup}>{setup || "Press the button to get a joke!"}</Text>
          {!!punchline && <Text style={styles.punchline}>{punchline}</Text>}
        </View>
      )}

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrap}>
          <Button title="Get another joke" onPress={getJoke} color="#4CAF50" disabled={loading} />
        </View>
        <View style={styles.buttonWrap}>
          <Button
            title={isDuplicate ? "Already saved" : "Save joke"}
            onPress={handleSave}
            color="#FF5722"
            disabled={!joke || isDuplicate}
          />
        </View>
      </View>

      <Link href="/saved">
        <Text style={styles.link}>Go to saved jokes</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5, // Android
  },
  setup: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  punchline: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
    marginBottom: 6,
  },
  buttonWrap: {
    flex: 1,
    marginHorizontal: 6, // usar esto en lugar de gap para compatibilidad
  },
  link: {
    marginTop: 16,
    color: "blue",
    fontSize: 16,
  },
});
