import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import {
  Birthday,
  getBirthdays,
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

export default function HomeScreen() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadBirthdays() {
    try {
      setLoading(true);

      const data = await getBirthdays();

      setBirthdays(data);
    } catch (error) {
      console.error(
        'Error cargando cumpleaños:',
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadBirthdays();
    }, [])
  );

  function getNextBirthdayDate(birthday: Birthday) {
    const today = new Date();

    let nextBirthday = new Date(
      today.getFullYear(),
      birthday.month - 1,
      birthday.day
    );

    if (nextBirthday < today) {
      nextBirthday = new Date(
        today.getFullYear() + 1,
        birthday.month - 1,
        birthday.day
      );
    }

    return nextBirthday;
  }

  function getUpcomingBirthdays() {
    return [...birthdays]
      .sort((a, b) => {
        const dateA =
          getNextBirthdayDate(a).getTime();

        const dateB =
          getNextBirthdayDate(b).getTime();

        return dateA - dateB;
      })
      .slice(0, 3);
  }

  function calculateUpcomingAge(
    birthday: Birthday
  ) {
    if (!birthday.year) {
      return null;
    }

    const nextBirthday =
      getNextBirthdayDate(birthday);

    return (
      nextBirthday.getFullYear() -
      birthday.year
    );
  }

  function openBirthday(
    birthday: Birthday
  ) {
    router.push({
      pathname: '/editar',
      params: {
        id: String(birthday.id),
        name: birthday.name,
        day: String(birthday.day),
        month: String(birthday.month),
        year: birthday.year
          ? String(birthday.year)
          : '',
      },
    });
  }

  const upcomingBirthdays =
    getUpcomingBirthdays();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Cargando cumpleaños...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Próximos cumpleaños
      </Text>

      {upcomingBirthdays.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Aún no tienes cumpleaños
            registrados.
          </Text>
        </View>
      ) : (
        <View style={styles.birthdaysContainer}>
          {upcomingBirthdays.map((birthday) => {
            const upcomingAge =
              calculateUpcomingAge(birthday);

            const nextBirthday =
              getNextBirthdayDate(birthday);

            return (
              <Pressable
                key={birthday.id}
                style={styles.birthdayCard}
                onPress={() =>
                  openBirthday(birthday)
                }
              >
                <View style={styles.birthdayInfo}>
                  <Text
                    style={styles.birthdayName}
                  >
                    {birthday.name}
                  </Text>

                  <Text
                    style={styles.birthdayDate}
                  >
                    {birthday.day} de{' '}
                    {MONTHS[birthday.month - 1]}{' '}
                    de{' '}
                    {nextBirthday.getFullYear()}
                  </Text>

                  {upcomingAge !== null && (
                    <Text style={styles.ageText}>
                      Cumple {upcomingAge} años
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <Pressable
          style={styles.button}
          onPress={() =>
            router.push('/agregar')
          }
        >
          <Text style={styles.buttonText}>
            Agregar cumpleaños
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() =>
            router.push('/calendario')
          }
        >
          <Text
            style={styles.secondaryButtonText}
          >
            Ver calendario
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },

  emoji: {
    fontSize: 52,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 14,
  },

  birthdaysContainer: {
    marginBottom: 20,
  },

  birthdayCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  birthdayInfo: {
    flex: 1,
  },

  birthdayName: {
    fontSize: 17,
    fontWeight: '700',
  },

  birthdayDate: {
    marginTop: 4,
    color: '#666',
    fontSize: 15,
  },

  ageText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
  },

  emptyContainer: {
    paddingVertical: 20,
    marginBottom: 20,
  },

  emptyText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
  },

  buttonsContainer: {
    marginTop: 'auto',
  },

  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#222',
    alignItems: 'center',
    marginBottom: 12,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});