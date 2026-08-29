import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

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
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    today.getMonth()
  );

  const [currentYear, setCurrentYear] = useState(
    today.getFullYear()
  );

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
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function goToNextMonth() {
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

    // JavaScript: domingo = 0
    // Nuestro calendario: lunes = 0
    return day === 0 ? 6 : day - 1;
  }

  function hasBirthday(day: number) {
    return birthdays.some(
      (birthday) =>
        birthday.day === day &&
        birthday.month === currentMonth + 1
    );
  }

  function getBirthdaysForDay(day: number) {
    return birthdays.filter(
      (birthday) =>
        birthday.day === day &&
        birthday.month === currentMonth + 1
    );
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

  // Espacios antes del día 1
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthBirthdays = birthdays.filter(
    (birthday) =>
      birthday.month === currentMonth + 1
  );

  return (
    <ScrollView style={styles.container}>
      {/* ENCABEZADO DEL MES */}
      <View style={styles.monthHeader}>
        <Pressable
          style={styles.arrowButton}
          onPress={goToPreviousMonth}
        >
          <Text style={styles.arrow}>
            ‹
          </Text>
        </Pressable>

        <Text style={styles.monthTitle}>
          {MONTHS[currentMonth]} {currentYear}
        </Text>

        <Pressable
          style={styles.arrowButton}
          onPress={goToNextMonth}
        >
          <Text style={styles.arrow}>
            ›
          </Text>
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

          const birthdaysForDay =
            getBirthdaysForDay(day);

          return (
            <View
              key={day}
              style={[
                styles.dayCell,
                birthdayExists &&
                  styles.birthdayDay,
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
            </View>
          );
        })}
      </View>

      {/* CUMPLEAÑOS DEL MES */}
      <Text style={styles.sectionTitle}>
        Cumpleaños de {MONTHS[currentMonth]}
      </Text>

      {monthBirthdays.length === 0 ? (
        <Text style={styles.emptyText}>
          No hay cumpleaños registrados este mes.
        </Text>
      ) : (
        monthBirthdays.map((birthday) => {
          const age = birthday.year
            ? currentYear - birthday.year
            : null;

          return (
            <View
              key={birthday.id}
              style={styles.birthdayCard}
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
            </View>
          );
        })
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
  },

  birthdayDayText: {
    fontWeight: 'bold',
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