import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  deleteBirthday,
  updateBirthday,
  isNameAlreadyUsed,
} from '../database/birthdayRepository';

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export default function Editar() {
  const params = useLocalSearchParams();

  const id = Number(params.id);

  const [name, setName] = useState(String(params.name ?? ''));
  const [day, setDay] = useState(String(params.day ?? ''));
  const [month, setMonth] = useState(String(params.month ?? ''));
  const [year, setYear] = useState(
    params.year ? String(params.year) : ''
  );

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert(
        'Dato requerido',
        'Escribe el nombre de la persona.'
      );
      return;
    }

    const nameAlreadyUsed = await isNameAlreadyUsed(
        name,
        id
    );

    if (nameAlreadyUsed) {
        Alert.alert(
            'Nombre duplicado',
            'Ya existe otro cumpleaños registrado con ese nombre.'
        );
        return;
    }

    if (!day.trim()) {
      Alert.alert(
        'Dato requerido',
        'Escribe el día del cumpleaños.'
      );
      return;
    }

    if (!month.trim()) {
      Alert.alert(
        'Dato requerido',
        'Escribe el mes del cumpleaños.'
      );
      return;
    }

    const dayNumber = Number(day);
    const monthNumber = Number(month);

    if (
      !Number.isInteger(dayNumber) ||
      dayNumber < 1 ||
      dayNumber > 31
    ) {
      Alert.alert(
        'Día inválido',
        'El día debe estar entre 1 y 31.'
      );
      return;
    }

    if (
      !Number.isInteger(monthNumber) ||
      monthNumber < 1 ||
      monthNumber > 12
    ) {
      Alert.alert(
        'Mes inválido',
        'El mes debe estar entre 1 y 12.'
      );
      return;
    }

    const currentYear = new Date().getFullYear();

    const testDate = new Date(
      currentYear,
      monthNumber - 1,
      dayNumber
    );

    if (
      testDate.getMonth() !== monthNumber - 1 ||
      testDate.getDate() !== dayNumber
    ) {
      Alert.alert(
        'Fecha inválida',
        'El día no existe para el mes seleccionado.'
      );
      return;
    }

    let yearNumber: number | null = null;

    if (year.trim()) {
      yearNumber = Number(year);

      if (
        !Number.isInteger(yearNumber) ||
        yearNumber < 1900 ||
        yearNumber > currentYear
      ) {
        Alert.alert(
          'Año inválido',
          `El año debe estar entre 1900 y ${currentYear}.`
        );
        return;
      }
    }

    try {
      await updateBirthday(
        id,
        name.trim(),
        dayNumber,
        monthNumber,
        yearNumber
      );

      Alert.alert(
        'Cumpleaños actualizado',
        'Los datos fueron actualizados correctamente.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error(
        'Error actualizando cumpleaños:',
        error
      );

      Alert.alert(
        'Error',
        'No se pudo actualizar el cumpleaños.'
      );
    }
  }

  function handleDelete() {
    Alert.alert(
      'Eliminar cumpleaños',
      `¿Estás seguro de que deseas eliminar el cumpleaños de ${name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBirthday(id);

              Alert.alert(
                'Cumpleaños eliminado',
                'El cumpleaños fue eliminado correctamente.',
                [
                  {
                    text: 'OK',
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error) {
              console.error(
                'Error eliminando cumpleaños:',
                error
              );

              Alert.alert(
                'Error',
                'No se pudo eliminar el cumpleaños.'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Editar cumpleaños
      </Text>

      <Text style={styles.label}>Nombre</Text>

      <TextInput
        style={styles.input}
        placeholder="Ej. María"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Día</Text>

      <TextInput
        style={styles.input}
        placeholder="Ej. 15"
        keyboardType="number-pad"
        value={day}
        onChangeText={setDay}
        maxLength={2}
      />

      <Text style={styles.label}>Mes</Text>

      <TextInput
        style={styles.input}
        placeholder="Ej. 9"
        keyboardType="number-pad"
        value={month}
        onChangeText={setMonth}
        maxLength={2}
      />

      <Text style={styles.label}>
        Año (opcional)
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ej. 1990"
        keyboardType="number-pad"
        value={year}
        onChangeText={setYear}
        maxLength={4}
      />

      <Pressable
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>
          Guardar cambios
        </Text>
      </Pressable>

      <Pressable
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.deleteButtonText}>
          Eliminar cumpleaños
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 18,
  },

  saveButton: {
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  deleteButton: {
    borderWidth: 1,
    borderColor: '#c62828',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },

  deleteButtonText: {
    color: '#c62828',
    fontSize: 16,
    fontWeight: 'bold',
  },
});