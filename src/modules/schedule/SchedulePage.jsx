import groups from '../../data/groups.json';

export default function SchedulePage() {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Расписание занятий</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div 
            key={group.id} 
            className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-blue-600">{group.level}</h2>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {group.capacity === 8 ? "Мест нет" : "Есть места"}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">Преподаватель: <span className="font-medium">{group.teacher}</span></p>
            
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Расписание</h3>
              {group.schedule.map((slot, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{slot.day}</span>
                  <span className="font-semibold text-gray-900">{slot.time}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="text-sm font-bold text-gray-800">
                {group.capacity === 8 
                  ? <span className="text-red-500">Мест нет</span> 
                  : `Занято 0 из ${group.capacity}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
