import { getUpcomingSlots } from './dateUtils.js';
import { addDays, getDay } from 'date-fns';

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

  // 3. Тест: Корректность дня недели и сохранение времени
  const mondayStart = new Date(2026, 10, 1); // 1 ноября 2026 (воскресенье)
  const mondaySlots = getUpcomingSlots(mockGroups, mondayStart);
  
  mondaySlots.forEach(slot => {
    const dayOfWeek = getDay(slot.date);
    // Проверяем, что день недели слота соответствует дню недели в расписании
    const expectedDayIndex = { "Понедельник": 1, "Четверг": 4 }[slot.day];
    if (dayOfWeek !== expectedDayIndex) {
      throw new Error(`Ошибка: День недели ${slot.day} не совпадает с датой ${slot.date}`);
    }
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
