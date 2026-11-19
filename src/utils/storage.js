const STORAGE_KEY = 'trial_signups';

export const getSignups = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

export const saveSignup = (signup) => {
  const signups = getSignups();
  
  // Помечаем старую активную запись этого пользователя как отмененную
  const updatedSignups = signups.map(s => 
    s.phone === signup.phone && s.status === 'active' 
      ? { ...s, status: 'cancelled' } 
      : s
  );

  // Добавляем новую запись
  updatedSignups.push({ 
    ...signup, 
    id: Date.now().toString(), 
    status: 'active' 
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSignups));
};
