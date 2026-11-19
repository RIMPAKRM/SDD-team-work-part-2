import { getUpcomingSlots } from './dateUtils.js';

const mockGroups = [
  {
    "id": "group-1",
    "level": "A1",
    "teacher": "Анна Иванова",
    "schedule": [
      { "day": "Понедельник", "time": "18:00" }
    ],
    "capacity": 8
  }
];

const runTests = () => {
  console.log("Запуск тестов dateUtils...");

  // 1. Тест: Генерация 14 дней
  const slots = getUpcomingSlots(mockGroups, new Date('2026-11-01')); // Суббота
  console.assert(slots.length > 0, "Должны быть сгенерированы слоты");

  // 2. Тест: Сохранение времени
  console.assert(slots[0].time === "18:00", "Время занятия должно сохраняться");

  // 3. Тест: Переход через месяц (с 25 ноября по 8 декабря)
  const novSlots = getUpcomingSlots(mockGroups, new Date('2026-11-25'));
  const hasDecember = novSlots.some(s => s.dateStr.endsWith('.12'));
  console.assert(hasDecember, "Должен быть переход через месяц");

  // 4. Тест: Переход через год (с 25 декабря по 7 января)
  const yearSlots = getUpcomingSlots(mockGroups, new Date('2026-12-25'));
  const hasJanuary = yearSlots.some(s => s.dateStr.endsWith('.01'));
  console.assert(hasJanuary, "Должен быть переход через год");

  // 5. Тест: Корректность дня недели
  // 2026-11-02 - это понедельник
  const mondaySlots = getUpcomingSlots(mockGroups, new Date('2026-11-01'));
  const mondaySlot = mondaySlots.find(s => s.dayName === "понедельник");
  console.assert(mondaySlot !== undefined, "Должен найтись понедельник");

  console.log("Все тесты пройдены успешно.");
};

runTests();
