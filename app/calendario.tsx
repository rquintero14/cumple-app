import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

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

const WEEK_DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default function Calendario() {
  const params = useLocalSearchParams();

  const today = new Date();

  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(
    today.getDate()
  );

  const [currentMonth, setCurrentMonth] = useState(
    today.getMonth()
  );

  const [currentYear, setCurrentYear] = useState(
    today.getFullYear()
  );

    useEffect(() => {
    if (params.today) {
      const now = new Date();

      setCurrentMonth(now.getMonth());
      setCurrentYear(now.getFullYear());
      setSelectedDay(now.getDate());
    }
  }, [params.today]);

  async function loadBirthdays() {
    try {
      setLoading(true);

      const data = await getBirthdays();

      setBirthdays(data);
    } catch (error) {
      console.error('Error cargando cumpleaños:', error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadBirthdays();
    }, [])
  );

  function goToPreviousMonth() {
    setSelectedDay(null);

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function goToNextMonth() {
    setSelectedDay(null);

    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function getDaysInMonth() {
    return new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();
  }

  function getFirstDayOfMonth() {
    const day = new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();

    return day === 0 ? 6 : day - 1;
  }

  function hasBirthday(day: number) {
    return birthdays.some(
      (birthday) =>
        birthday.day === day &&
        birthday.month === currentMonth + 1
    );
  }

  function getSelectedDayBirthdays() {
    if (selectedDay === null) {
      return [];
    }

    return birthdays.filter(
      (birthday) =>
        birthday.day === selectedDay &&
        birthday.month === currentMonth + 1
    );
  }

  function calculateAge(
    birthDay: number,
    birthMonth: number,
    birthYear: number
  ) {
    const today = new Date();

    let age = today.getFullYear() - birthYear;

    const birthdayThisYear = new Date(
      today.getFullYear(),
      birthMonth - 1,
      birthDay
    );

    if (today < birthdayThisYear) {
      age--;
    }

    return age;
  }

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

  const daysInMonth = getDaysInMonth();
  const firstDay = getFirstDayOfMonth();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const selectedBirthdays = getSelectedDayBirthdays();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* ENCABEZADO DEL MES */}

      <View style={styles.monthHeader}>
        <Pressable
          style={styles.arrowButton}
          onPress={goToPreviousMonth}
        >
          <Text style={styles.arrow}>‹</Text>
        </Pressable>

        <Text style={styles.monthTitle}>
          {MONTHS[currentMonth]} {currentYear}
        </Text>

        <Pressable
          style={styles.arrowButton}
          onPress={goToNextMonth}
        >
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      {/* DÍAS DE LA SEMANA */}

      <View style={styles.weekRow}>
        {WEEK_DAYS.map((day) => (
          <View
            key={day}
            style={styles.weekDay}
          >
            <Text style={styles.weekDayText}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* CALENDARIO */}

      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => {
          if (day === null) {
            return (
              <View
                key={`empty-${index}`}
                style={styles.dayCell}
              />
            );
          }

          const birthdayExists = hasBirthday(day);

          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          return (
            <Pressable
              key={day}
              onPress={() => setSelectedDay(day)}
              style={[
                styles.dayCell,
                birthdayExists && styles.birthdayDay,
                isToday && styles.today,
                selectedDay === day &&
                  styles.selectedDay,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  birthdayExists &&
                    styles.birthdayDayText,
                ]}
              >
                {day}
              </Text>

              {birthdayExists && (
                <Text style={styles.birthdayIcon}>
                  🎂
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* CUMPLEAÑOS DEL DÍA SELECCIONADO */}

      {selectedDay !== null && (
        <>
          <Text style={styles.sectionTitle}>
            Cumpleaños del {selectedDay} de{' '}
            {MONTHS[currentMonth]}
          </Text>

          {selectedBirthdays.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay cumpleaños este día.
            </Text>
          ) : (
            selectedBirthdays.map((birthday) => {
              const age = birthday.year
                ? calculateAge(
                    birthday.day,
                    birthday.month,
                    birthday.year
                  )
                : null;

              return (
                <Pressable
                  key={birthday.id}
                  style={styles.birthdayCard}
                  onPress={() =>
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
                    })
                  }
                >
                  <View>
                    <Text style={styles.birthdayName}>
                      {birthday.name}
                    </Text>

                    <Text style={styles.birthdayDate}>
                      {birthday.day} de{' '}
                      {MONTHS[currentMonth]}
                    </Text>
                  </View>

                  {age !== null && (
                    <Text style={styles.age}>
                      {age} años
                    </Text>
                  )}
                </Pressable>
              );
            })
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  contentContainer: {
    paddingBottom: 60,
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

  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  arrowButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrow: {
    fontSize: 36,
    lineHeight: 40,
  },

  weekRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },

  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },

  weekDayText: {
    fontWeight: 'bold',
    color: '#666',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
  },

  dayCell: {
    width: '14.2857%',
    minHeight: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 4,
  },

  dayText: {
    fontSize: 16,
  },

  birthdayDay: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },

  birthdayDayText: {
    fontWeight: 'bold',
  },

  selectedDay: {
    borderWidth: 2,
    borderColor: '#5856b3',
    backgroundColor: '#e8e8e8',
  },

  today: {
    borderWidth: 2,
    borderColor: '#000000',
  },

  birthdayIcon: {
    fontSize: 12,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  emptyText: {
    color: '#666',
    fontSize: 15,
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

  birthdayName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  birthdayDate: {
    marginTop: 4,
    color: '#666',
  },

  age: {
    fontWeight: 'bold',
  },
});