import { useState } from 'react';
import groups from '../../data/groups.json';
import { getUpcomingSlots } from '../../utils/dateUtils';
import TrialSignupForm from './TrialSignupForm';

export default function SchedulePage() {
  const upcomingSlots = getUpcomingSlots(groups);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const slotsByDate = upcomingSlots.reduce((acc, slot) => {
    const dateKey = slot.dateStr;
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: slot.date,
        dateStr: slot.dateStr,
        dayName: slot.dayName,
        items: []
      };
    }
    acc[dateKey].items.push(slot);
    return acc;
  }, {});

  const sortedDates = Object.values(slotsByDate).sort((a, b) => a.date - b.date);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Расписание занятий на 14 дней</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDates.length === 0 ? (
          <p className="text-gray-500">Нет доступных занятий на ближайшие 14 дней.</p>
        ) : (
          sortedDates.map((dateGroup) => (
            <div key={dateGroup.dateStr} className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                {dateGroup.dayName.charAt(0).toUpperCase() + dateGroup.dayName.slice(1)} ({dateGroup.dateStr})
              </h2>
              
              <div className="space-y-4">
                {dateGroup.items.map((slot) => {
                  const occupied = 0; 
                  const isFull = occupied >= slot.groupCapacity;

                  return (
                    <div 
                      key={`${slot.groupId}-${slot.dateStr}-${slot.time}`} 
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-blue-600">{slot.groupLevel}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {isFull ? "Мест нет" : "Есть свободные места"}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">Преподаватель: <span className="font-medium text-gray-900">{slot.groupTeacher}</span></p>
                      <p className="text-sm text-gray-600 mb-3">Время: <span className="font-medium text-gray-900">{slot.time}</span></p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-xs font-bold text-gray-500">
                          Занято {occupied} из {slot.groupCapacity}
                        </div>
                        {!isFull && (
                          <button 
                            onClick={() => setSelectedSlot(slot)}
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                          >
                            Записаться
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedSlot && (
        <TrialSignupForm 
          slot={selectedSlot} 
          onClose={() => setSelectedSlot(null)}
          onSubmit={(data) => {
            console.log('Form submitted:', data, selectedSlot);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
}
