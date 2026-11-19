import { getUpcomingSlots } from './dateUtils.js';
import { addDays, getDay } from 'date-fns';

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`Test Failed: ${message}. Expected "${expected}", got "${actual}"`);
  }
}

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

const runTests = () => {
  console.log("Запуск тестов dateUtils...");

  // 1. Тест: Генерация ровно 14 дней (диапазон)
  const startDate = new Date(2026, 10, 1); // 1 ноября 2026
  const endDate = addDays(startDate, 13);
  const slots = getUpcomingSlots(mockGroups, startDate);
  
  slots.forEach(slot => {
    if (slot.date < startDate || slot.date > endDate) {
      throw new Error(`Test Failed: Дата ${slot.date} вне диапазона 14 дней`);
    }
  });
  console.log("✓ Тест диапазона 14 дней пройден");

  // 2. Тест: Переход через год (с 25 декабря 2026 по 7 января 2027)
  const yearStart = new Date(2026, 11, 25);
  const yearSlots = getUpcomingSlots(mockGroups, yearStart);
  const hasJanuary = yearSlots.some(s => s.date.getFullYear() === 2027);
  if (!hasJanuary) {
    throw new Error("Test Failed: Не обнаружен переход через год (январь 2027)");
  }
  console.log("✓ Тест перехода через год пройден");

  // 3. Тест: Корректность дня недели
  // 2026-11-02 (ноябрь - индекс 10) - это понедельник
  const mondayStart = new Date(2026, 10, 1);
  const mondaySlots = getUpcomingSlots(mockGroups, mondayStart);
  const mondaySlot = mondaySlots.find(s => s.day === "Понедельник");
  
  if (mondaySlot) {
    const dayOfWeek = getDay(mondaySlot.date);
    assertEquals(dayOfWeek, 1, "День недели должен быть понедельником (индекс 1)");
  } else {
    throw new Error("Test Failed: Не найден слот для понедельника");
  }
  console.log("✓ Тест корректности дня недели пройден");

  // 4. Тест: Сохранение времени
  assertEquals(mondaySlot.time, "18:00", "Время занятия должно сохраняться");
  console.log("✓ Тест сохранения времени пройден");

  console.log("Все тесты пройдены успешно.");
};

try {
  runTests();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
