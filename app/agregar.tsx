import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { addBirthday } from '../database/birthdayRepository';

export default function Agregar() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [includeYear, setIncludeYear] = useState(false);

  function handleDateChange(
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) {
    setShowDatePicker(false);

    if (event.type === 'set' && selectedDate) {
      setBirthDate(selectedDate);
    }
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString('es-PA', {
      day: '2-digit',
      month: 'long',
    });
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert(
        'Dato requerido',
        'Escribe el nombre de la persona.'
      );
      return;
    }

    if (!birthDate) {
      Alert.alert(
        'Dato requerido',
        'Selecciona la fecha de cumpleaños.'
      );
      return;
    }

    const dayNumber = birthDate.getDate();
    const monthNumber = birthDate.getMonth() + 1;

    let yearNumber: number | null = null;

    if (includeYear) {
      yearNumber = birthDate.getFullYear();

      const currentYear = new Date().getFullYear();

      if (
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
      await addBirthday(
        name.trim(),
        dayNumber,
        monthNumber,
        yearNumber
      );

      Alert.alert(
        'Cumpleaños guardado',
        `${name.trim()} fue agregado correctamente.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error(
        'Error guardando cumpleaños:',
        error
      );

      Alert.alert(
        'Error',
        'No se pudo guardar el cumpleaños.'
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Agregar cumpleaños
      </Text>

      <Text style={styles.label}>
        Nombre
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ej. María"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <Text style={styles.label}>
        Fecha de cumpleaños
      </Text>

      <Pressable
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text
          style={
            birthDate
              ? styles.dateText
              : styles.placeholderText
          }
        >
          {birthDate
            ? formatDate(birthDate)
            : 'Seleccionar fecha'}
        </Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={birthDate || new Date()}
          mode="date"
          display={
            Platform.OS === 'android'
              ? 'calendar'
              : 'spinner'
          }
          onChange={handleDateChange}
        />
      )}

      <Pressable
        style={styles.checkboxContainer}
        onPress={() => setIncludeYear(!includeYear)}
      >
        <View
          style={[
            styles.checkbox,
            includeYear && styles.checkboxSelected,
          ]}
        >
          {includeYear && (
            <Text style={styles.checkmark}>
              ✓
            </Text>
          )}
        </View>

        <Text style={styles.checkboxText}>
          Conozco el año de nacimiento
        </Text>
      </Pressable>

      {includeYear && birthDate && (
        <Text style={styles.yearInfo}>
          Año de nacimiento:{' '}
          {birthDate.getFullYear()}
        </Text>
      )}

      <Pressable
        style={styles.button}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>
          Guardar cumpleaños
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
    marginBottom: 22,
  },

  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 15,
    marginBottom: 22,
  },

  dateText: {
    fontSize: 16,
    color: '#222',
  },

  placeholderText: {
    fontSize: 16,
    color: '#888',
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxSelected: {
    backgroundColor: '#333',
    borderColor: '#333',
  },

  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  checkboxText: {
    fontSize: 16,
  },

  yearInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 18,
  },

  button: {
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});