import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return true;
  }

  const { status } =
    await Notifications.requestPermissionsAsync();

  return status === 'granted';
}

export async function cancelBirthdayNotifications(
  birthdayId: number
) {
  const scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  const notifications = scheduled.filter(
    (notification) =>
      notification.content.data?.birthdayId ===
      birthdayId
  );

  for (const notification of notifications) {
    await Notifications.cancelScheduledNotificationAsync(
      notification.identifier
    );
  }
}

export async function scheduleBirthdayNotifications(
  birthdayId: number,
  name: string,
  day: number,
  month: number
) {
  const hasPermission =
    await requestNotificationPermissions();

  if (!hasPermission) {
    return;
  }

  await cancelBirthdayNotifications(birthdayId);

  const today = new Date();

  let birthdayYear = today.getFullYear();

  let birthdayDate = new Date(
    birthdayYear,
    month - 1,
    day,
    9,
    0,
    0
  );

  if (birthdayDate <= today) {
    birthdayYear += 1;

    birthdayDate = new Date(
      birthdayYear,
      month - 1,
      day,
      9,
      0,
      0
    );
  }

  const dayBefore = new Date(birthdayDate);
  dayBefore.setDate(dayBefore.getDate() - 1);

  if (dayBefore > today) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎂 Cumpleaños mañana',
        body: `Mañana es el cumpleaños de ${name}.`,
        data: {
          birthdayId,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: dayBefore,
      },
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎉 ¡Hoy es su cumpleaños!',
      body: `Hoy es el cumpleaños de ${name}.`,
      data: {
        birthdayId,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: birthdayDate,
    },
  });
}