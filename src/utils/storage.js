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
  // Удаляем старую запись с таким же телефоном, если она есть (перезапись)
  const filtered = signups.filter(s => s.phone !== signup.phone);
  filtered.push({ ...signup, id: Date.now().toString(), status: 'active' });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
