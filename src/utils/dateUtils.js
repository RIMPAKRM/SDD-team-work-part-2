import { addDays, format, getDay, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';

const DAY_MAP = {
  "Воскресенье": 0,
  "Понедельник": 1,
  "Вторник": 2,
  "Среда": 3,
  "Четверг": 4,
  "Пятница": 5,
  "Суббота": 6
};

/**
 * Генерирует список слотов занятий на ближайшие 14 дней
 * @param {Array} groups - Список групп
 * @returns {Array} - Список объектов { date, dateStr, dayName, ...groupData }
 */
export const getUpcomingSlots = (groups) => {
  const today = startOfDay(new Date());
  const slots = [];

  for (let i = 0; i < 14; i++) {
    const date = addDays(today, i);
    const dayIndex = getDay(date);
    const dateStr = format(date, 'dd.MM', { locale: ru });
    const dayName = format(date, 'EEEE', { locale: ru });

    groups.forEach(group => {
      group.schedule.forEach(s => {
        if (DAY_MAP[s.day] === dayIndex) {
          slots.push({
            ...s,
            date: date,
            dateStr: dateStr,
            dayName: dayName,
            groupId: group.id,
            groupLevel: group.level,
            groupTeacher: group.teacher,
            groupCapacity: group.capacity
          });
        }
      });
    });
  }
  return slots;
};
