import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Cumpleaños",
        }}
      />

      <Stack.Screen
        name="agregar"
        options={{
          title: "Agregar cumpleaños",
        }}
      />

      <Stack.Screen
        name="calendario"
        options={{
          title: "Calendario",
        }}
      />
    </Stack>
  );
}