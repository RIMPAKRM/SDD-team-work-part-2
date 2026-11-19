import groups from '../../data/groups.json';

export default function SchedulePage() {
  const daysOfWeek = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье"
  ];

  // Функция для получения групп, у которых есть занятия в конкретный день
  const getGroupsForDay = (day) => {
    return groups.filter((group) => 
      group.schedule.some((slot) => slot.day === day)
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Расписание занятий</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map((day) => {
          const dayGroups = getGroupsForDay(day);
          
          // Если в этот день нет занятий, пропускаем его или показываем как пустой
          if (dayGroups.length === 0) return null;

          return (
            <div key={day} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                {day}
              </h2>
              
              <div className="space-y-4">
                {dayGroups.map((group) => {
                  const slot = group.schedule.find((s) => s.day === day);
                  const occupied = 0; // Пока нет логики записей, всегда 0
                  const isFull = occupied >= group.capacity;

                  return (
                    <div 
                      key={`${group.id}-${day}`} 
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-blue-600">{group.level}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {isFull ? "Мест нет" : "Есть свободные места"}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">Преподаватель: <span className="font-medium text-gray-900">{group.teacher}</span></p>
                      <p className="text-sm text-gray-600 mb-3">Время: <span className="font-medium text-gray-900">{slot.time}</span></p>
                      
                      <div className="text-xs font-bold text-gray-500">
                        Занято {occupied} из {group.capacity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
