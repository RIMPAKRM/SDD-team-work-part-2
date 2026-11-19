import { useState, useRef } from 'react';
import { getSignups, saveSignup } from '../../utils/storage';

export default function TrialSignupForm({ slot, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [existingSignup, setExistingSignup] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const year = slot.date.getFullYear();
  const month = String(slot.date.getMonth() + 1).padStart(2, '0');
  const day = String(slot.date.getDate()).padStart(2, '0');
  const slotDateISO = `${year}-${month}-${day}`;

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
    if (isSubmittingRef.current || !validate()) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    // Проверка занятости
    const allSignups = getSignups();
    const occupied = allSignups.filter(s => 
      s.status === 'active' && 
      s.groupId === slot.groupId && 
      s.date === slotDateISO
    ).length;

    if (occupied >= slot.groupCapacity) {
      alert('К сожалению, на это время мест больше нет.');
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      return;
    }

    // Проверка на дубликат
    const duplicate = allSignups.find(s => s.status === 'active' && s.phone === formData.phone);
    
    if (duplicate && !existingSignup) {
      setExistingSignup(duplicate);
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      return;
    }

    // Сохранение
    saveSignup({
      ...formData,
      groupId: slot.groupId,
      groupLevel: slot.groupLevel,
      groupTeacher: slot.groupTeacher,
      date: slotDateISO,
      time: slot.time
    });
    setIsSuccess(true);
    isSubmittingRef.current = false;
    setIsSubmitting(false);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length === 11 && (value.startsWith('7') || value.startsWith('8'))) {
      value = value.substring(1);
    }
    value = value.substring(0, 10);
    
    let formatted = '+7 (';
    if (value.length > 0) formatted += value.substring(0, 3);
    if (value.length > 3) formatted += ') ' + value.substring(3, 6);
    if (value.length > 6) formatted += '-' + value.substring(6, 8);
    if (value.length > 8) formatted += '-' + value.substring(8, 10);
    
    setFormData({ ...formData, phone: formatted });
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl text-center">
          <h2 className="text-xl font-bold mb-4 text-green-600">Запись подтверждена!</h2>
          <p className="mb-4">Вы записаны на {slot.groupLevel} ({slot.groupTeacher}) на {slot.dateStr} в {slot.time}.</p>
          <button onClick={onSuccess} className="w-full py-2 bg-blue-600 text-white rounded-lg">Закрыть</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold mb-4">Запись на пробный урок</h2>
        
        {existingSignup ? (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-2">У вас уже есть запись:</p>
            <p className="font-bold text-sm">{existingSignup.groupLevel} на {existingSignup.date}</p>
            <p className="text-sm mt-2">Вы хотите перезаписаться на текущее занятие?</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setExistingSignup(null)} className="flex-1 py-1 border rounded" disabled={isSubmitting}>Нет</button>
              <button onClick={() => {
                if (isSubmittingRef.current) return;
                isSubmittingRef.current = true;
                setIsSubmitting(true);

                // Повторная проверка занятости перед перезаписью
                const allSignups = getSignups();
                const occupied = allSignups.filter(s => 
                  s.status === 'active' && 
                  s.groupId === slot.groupId && 
                  s.date === slotDateISO
                ).length;

                if (occupied >= slot.groupCapacity) {
                  alert('К сожалению, на это время мест больше нет.');
                  isSubmittingRef.current = false;
                  setIsSubmitting(false);
                  return;
                }

                saveSignup({ 
                  ...formData, 
                  groupId: slot.groupId, 
                  groupLevel: slot.groupLevel, 
                  groupTeacher: slot.groupTeacher, 
                  date: slotDateISO, 
                  time: slot.time 
                });
                setIsSuccess(true);
                isSubmittingRef.current = false;
                setIsSubmitting(false);
              }} className="flex-1 py-1 bg-blue-600 text-white rounded" disabled={isSubmitting}>Да, перезаписаться</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Имя</label>
              <input id="name" type="text" required className="w-full border rounded-lg p-2 mt-1" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={isSubmitting} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Телефон</label>
              <input id="phone" type="tel" required placeholder="+7 (XXX) XXX-XX-XX" className="w-full border rounded-lg p-2 mt-1" value={formData.phone} onChange={handlePhoneChange} disabled={isSubmitting} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (опционально)</label>
              <input id="email" type="email" className="w-full border rounded-lg p-2 mt-1" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={isSubmitting} />
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg hover:bg-gray-50" disabled={isSubmitting}>Отмена</button>
              <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={isSubmitting}>Записаться</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
