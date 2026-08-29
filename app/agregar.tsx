import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";

export default function AgregarScreen() {
  const [nombre, setNombre] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");

  const guardarCumpleanos = () => {
    if (!nombre.trim()) {
      Alert.alert("Falta información", "Ingresa el nombre de la persona.");
      return;
    }

    if (!dia || !mes) {
      Alert.alert(
        "Falta información",
        "Ingresa el día y el mes del cumpleaños."
      );
      return;
    }

    Alert.alert(
      "Cumpleaños",
      `Nombre: ${nombre}\nFecha: ${dia}/${mes}${
        anio ? `/${anio}` : ""
      }`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar cumpleaños</Text>

      <Text style={styles.label}>Nombre de la persona</Text>

      <TextInput
        style={styles.input}
        placeholder="Ej. María"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.sectionTitle}>Fecha de nacimiento</Text>

      <View style={styles.dateContainer}>
        <View style={styles.dateField}>
          <Text style={styles.label}>Día</Text>

          <TextInput
            style={styles.input}
            placeholder="DD"
            keyboardType="numeric"
            maxLength={2}
            value={dia}
            onChangeText={setDia}
          />
        </View>

        <View style={styles.dateField}>
          <Text style={styles.label}>Mes</Text>

          <TextInput
            style={styles.input}
            placeholder="MM"
            keyboardType="numeric"
            maxLength={2}
            value={mes}
            onChangeText={setMes}
          />
        </View>

        <View style={styles.dateFieldYear}>
          <Text style={styles.label}>Año (opcional)</Text>

          <TextInput
            style={styles.input}
            placeholder="AAAA"
            keyboardType="numeric"
            maxLength={4}
            value={anio}
            onChangeText={setAnio}
          />
        </View>
      </View>

      <Pressable style={styles.button} onPress={guardarCumpleanos}>
        <Text style={styles.buttonText}>Guardar cumpleaños</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 28,
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  dateContainer: {
    flexDirection: "row",
    gap: 10,
  },

  dateField: {
    flex: 1,
  },

  dateFieldYear: {
    flex: 1.5,
  },

  button: {
    marginTop: 40,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#222",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});