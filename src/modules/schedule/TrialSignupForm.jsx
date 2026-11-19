import { useState } from 'react';

export default function TrialSignupForm({ slot, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Имя обязательно';
    
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Неверный формат: +7 (XXX) XXX-XX-XX';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Проверка на заполненность группы (на текущем этапе всегда 0, но логика готова)
    const occupied = 0; 
    if (occupied >= slot.groupCapacity) {
      alert('К сожалению, в этой группе больше нет мест.');
      return;
    }

    if (validate()) {
      onSubmit(formData);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Обработка префиксов 8 или 7
    if (value.startsWith('8') && value.length > 1) {
      value = value.substring(1);
    } else if (value.startsWith('7') && value.length > 10) {
      value = value.substring(1);
    }

    // Ограничение до 10 цифр
    value = value.substring(0, 10);
    
    let formatted = '+7 (';
    if (value.length > 0) formatted += value.substring(0, 3);
    if (value.length > 3) formatted += ') ' + value.substring(3, 6);
    if (value.length > 6) formatted += '-' + value.substring(6, 8);
    if (value.length > 8) formatted += '-' + value.substring(8, 10);
    
    setFormData({ ...formData, phone: formatted });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4">Запись на пробный урок</h2>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
          <p className="font-semibold">{slot.groupLevel} — {slot.groupTeacher}</p>
          <p className="text-gray-600">{slot.dayName}, {slot.dateStr} в {slot.time}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Имя</label>
            <input
              id="name"
              type="text"
              required
              className="w-full border rounded-lg p-2 mt-1"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Телефон</label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="+7 (XXX) XXX-XX-XX"
              className="w-full border rounded-lg p-2 mt-1"
              value={formData.phone}
              onChange={handlePhoneChange}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (опционально)</label>
            <input
              id="email"
              type="email"
              className="w-full border rounded-lg p-2 mt-1"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Записаться
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
