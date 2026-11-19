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

  // 3. Тест: Корректность дня недели и времени для всех слотов
  // Проверяем каждый слот индивидуально
  const allSlots = getUpcomingSlots(mockGroups, new Date(2026, 10, 1));
  
  if (allSlots.length === 0) {
    throw new Error("Ошибка: Не сгенерировано ни одного занятия");
  }

  allSlots.forEach(slot => {
    // Проверяем день недели непосредственно по объекту date
    const expectedDayIndex = DAY_MAP[slot.day];
    const actualDayIndex = getDay(slot.date);
    
    if (expectedDayIndex === undefined) {
      throw new Error(`Ошибка: Неизвестный день недели в расписании: ${slot.day}`);
    }

    if (expectedDayIndex !== actualDayIndex) {
      throw new Error(`Ошибка: День недели ${slot.day} не совпадает с датой ${slot.date}`);
    }

    // Проверяем сохранение времени
    if (slot.time !== "18:00") {
      throw new Error(`Ошибка: Время занятия ${slot.time} не совпадает с ожидаемым 18:00`);
    }
  });
  console.log("✓ Тест корректности дня недели и времени пройден");

  console.log("Все тесты пройдены успешно.");
}

try {
  runTests();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
