import { Stack, router } from "expo-router";
import { Pressable, Text } from "react-native";

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
            headerRight: () => (
              <Pressable
                onPress={() => router.setParams({ today: Date.now().toString() })}
                style={{ marginRight: 10 }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                >
                  Hoy
                </Text>
              </Pressable>
            ),
        }}
      />

      <Stack.Screen
        name="editar"
        options={{
          title: 'Editar',
        }}
      />
    </Stack>
  );
}