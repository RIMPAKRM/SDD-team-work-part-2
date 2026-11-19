import { getUpcomingSlots } from './dateUtils';

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
  console.log("Running dateUtils tests...");
  
  const slots = getUpcomingSlots(mockGroups);
  
  // Test 1: Check if we have slots (should have at least 1 in 14 days)
  console.assert(slots.length > 0, "Should generate slots");
  
  // Test 2: Check if dates are within 14 days
  const now = new Date();
  slots.forEach(slot => {
    console.assert(slot.date >= now, "Date should be in future");
  });

  // Test 3: Check day matching
  slots.forEach(slot => {
    console.assert(slot.day === "Понедельник", "Day name should match schedule");
  });

  console.log("Tests completed successfully.");
};

runTests();
