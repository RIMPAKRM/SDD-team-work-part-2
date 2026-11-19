# Data Model: Расписание групп и запись на пробный урок

> Синхронизировано с реализацией (2026-11-19).

## Group (статичные данные, `src/data/groups.json`)

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | string | `group-1`…`group-6` |
| `level` | string | `A1 | A2 | B1 | B2 | C1 | IELTS Prep` |
| `teacher` | string | ФИО преподавателя |
| `schedule` | array | `[{ day: "Понедельник"|…|"Воскресенье" (рус. название), time: "HH:MM" }]` — только время начала, длительность не хранится |
| `capacity` | number | Всегда 8 |

Полей `name`, `teacherRole`, `enrolled`, `durationMin` в данных **нет**: у группы нет названия и штатной занятости.

### Начальные данные (seed)

| id | level | teacher | расписание |
| --- | --- | --- | --- |
| group-1 | A1 | Анна Иванова | Пн 18:00, Чт 18:00 |
| group-2 | A2 | Борис Петров | Вт 19:00, Пт 19:00 |
| group-3 | B1 | Елена Сидорова | Ср 18:00, Сб 11:00 |
| group-4 | B2 | Дмитрий Смирнов | Пн 20:00, Чт 20:00 |
| group-5 | C1 | Ольга Кузнецова | Вт 20:00, Пт 20:00 |
| group-6 | IELTS Prep | Игорь Васильев | Ср 20:00, Сб 13:00 |

## LessonSlot (производная сущность, не хранится)

Генерируется `getUpcomingSlots(groups, startDate)` из `src/utils/dateUtils.js` — вхождения расписания групп на ближайшие 14 дней от `startDate` (включая сегодня).

| Поле | Тип | Описание |
| --- | --- | --- |
| `groupId` | string | ссылка на Group |
| `groupLevel` | string | уровень группы |
| `groupTeacher` | string | преподаватель группы |
| `groupCapacity` | number | вместимость (8) |
| `day` | string | день недели (рус., из шаблона) |
| `time` | string | время начала "HH:MM" |
| `date` | Date | конкретная дата занятия |
| `dateStr` | string | `dd.MM` для отображения |
| `dayName` | string | день недели (рус., из даты) |

## TrialSignup (localStorage, ключ `trial_signups`)

Хранится массивом записей (включая отменённые) в `src/utils/storage.js`.

| Поле | Тип | Описание | Валидация |
| --- | --- | --- | --- |
| `id` | string | `Date.now().toString()` | — |
| `name` | string | имя посетителя | обязательно, непустое (trim) |
| `phone` | string | `+7 (XXX) XXX-XX-XX` — **ключ уникальности** | обязательно, строго маска |
| `email` | string | опционально | если есть — `^[^\s@]+@[^\s@]+\.[^\s@]+$` |
| `groupId` | string | ссылка на Group | — |
| `groupLevel` | string | снимок уровня группы | — |
| `groupTeacher` | string | снимок преподавателя | — |
| `date` | string | `YYYY-MM-DD` занятия (локальная дата) | — |
| `time` | string | время начала | — |
| `status` | `'active' \| 'cancelled'` | активная или отменённая | — |

## Хранилище `src/utils/storage.js`

- `getSignups() → TrialSignup[]` — читает `trial_signups` из localStorage (при ошибке парсинга — `[]`).
- `saveSignup(signup)` — все активные записи с тем же `phone` помечает `cancelled`, затем добавляет новую со `status: 'active'` и `id = Date.now()` (одна активная запись на телефон, история сохраняется).

## Правила и переходы

- `occupied(groupId, date) = count(signup.status === 'active' && groupId && date)` — занятость слота = только пробные записи (штатной занятости нет).
- Запись блокируется при `occupied >= capacity` — и в UI (кнопка скрыта), и повторно при отправке формы.
- Повторная отправка с тем же `phone` → диалог «У вас уже есть запись» → «Да, перезаписаться» → `saveSignup` отменяет старую и активирует новую.
- Отдельного UI отмены записи нет; `cancelled` появляется только при перезаписи.
