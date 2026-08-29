import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎂</Text>

      <Text style={styles.title}>Cumpleaños</Text>

      <Text style={styles.subtitle}>
        Tus cumpleaños siempre a mano
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/agregar")}
      >
        <Text style={styles.buttonText}>Agregar cumpleaños</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push("/calendario")}
      >
        <Text style={styles.secondaryButtonText}>Ver calendario</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 17,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },

  button: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#222",
    alignItems: "center",
    marginBottom: 12,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryButton: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});