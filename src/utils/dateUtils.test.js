import { getUpcomingSlots } from './dateUtils.js';
import { addDays, getDay } from 'date-fns';

const DAY_MAP = {
  "Воскресенье": 0,
  "Понедельник": 1,
  "Вторник": 2,
  "Среда": 3,
  "Четверг": 4,
  "Пятница": 5,
  "Суббота": 6
};

const mockGroups = [
  {
    "id": "group-1",
    "level": "A1",
    "teacher": "Анна Иванова",
    "schedule": [
      { "day": "Понедельник", "time": "18:00" },
      { "day": "Четверг", "time": "18:00" }
    ],
    "capacity": 8
  }
];

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`Test Failed: ${message}. Expected "${expected}", got "${actual}"`);
  }
}

function runTests() {
  console.log("Запуск тестов dateUtils...");

  // 1. Тест: Диапазон 14 дней
  const startDate = new Date(2026, 10, 1); // 1 ноября 2026
  const endDate = addDays(startDate, 13);
  const slots = getUpcomingSlots(mockGroups, startDate);
  
  slots.forEach(slot => {
    if (slot.date < startDate || slot.date > endDate) {
      throw new Error(`Ошибка: Дата ${slot.date} вне диапазона 14 дней`);
    }
  });
  console.log("✓ Тест диапазона 14 дней пройден");

  // 2. Тест: Переход через год (с 25 декабря 2026 по 7 января 2027)
  const yearStart = new Date(2026, 11, 25);
  const yearSlots = getUpcomingSlots(mockGroups, yearStart);
  const hasJanuary = yearSlots.some(s => s.date.getFullYear() === 2027);
  if (!hasJanuary) {
    throw new Error("Ошибка: Не обнаружен переход через год (январь 2027)");
  }
  console.log("✓ Тест перехода через год пройден");

  // 3. Тест: Корректность слотов и количество
  const allSlots = getUpcomingSlots(mockGroups, new Date(2026, 10, 1));
  
  // Проверка количества занятий (4 занятия за 14 дней для mockGroups)
  assertEquals(allSlots.length, 4, "Количество занятий за 14 дней");

  allSlots.forEach(slot => {
    // Проверка соответствия исходному расписанию группы
    const group = mockGroups.find(g => g.id === slot.groupId);
    const scheduleEntry = group.schedule.find(s => s.day === slot.day && s.time === slot.time);

    if (!scheduleEntry) {
      throw new Error(`Ошибка: Слот ${slot.dayName} ${slot.time} не найден в расписании группы ${slot.groupId}`);
    }

    // Проверка дня недели по объекту date
    const expectedDayIndex = DAY_MAP[slot.day];
    const actualDayIndex = getDay(slot.date);
    
    if (expectedDayIndex !== actualDayIndex) {
      throw new Error(`Ошибка: День недели ${slot.dayName} не совпадает с датой ${slot.date}`);
    }

    // Проверка времени
    if (slot.time !== "18:00") {
      throw new Error(`Ошибка: Время занятия ${slot.time} не совпадает с ожидаемым 18:00`);
    }
  });
  console.log("✓ Тест корректности слотов и количества пройден");

  console.log("Все тесты пройдены успешно.");
}

try {
  runTests();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
