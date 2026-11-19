# Data Model: Расписание групп и запись на пробный урок

## Group (статичные данные, `src/data/groups.json`)

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | string | `g1`…`g6` |
| `name` | string | Название группы («Start», «Intermediate»…) |
| `level` | string | `A1 | A2 | B1 | B2 | C1 | IELTS` |
| `teacherName` | string | ФИО преподавателя |
| `teacherRole` | string | Короткая роль («сертифицированный преподаватель»…) — опционально |
| `schedule` | array | `[{ weekday: 0–6 (0=Вс,1=Пн…), startTime: "HH:MM", durationMin: int }]` |
| `capacity` | number | Всегда 8 |
| `enrolled` | number | Штатно записанных студентов (0–8) |

### Начальные данные (seed)

| id | name | level | teacher | расписание | enrolled |
| --- | --- | --- | --- | --- | --- |
| g1 | Start | A1 | Анна Смирнова | Пн 18:00–19:30, Ср 18:00–19:30 | 5 |
| g2 | Foundation | A2 | Дмитрий Козлов | Вт 10:00–11:30, Чт 10:00–11:30 | **8 (мест нет)** |
| g3 | Intermediate | B1 | Елена Морозова | Пн/Ср/Пт 12:00–13:30 | 6 |
| g4 | Upper-Intermediate | B2 | James Carter | Вт 18:30–20:00, Чт 18:30–20:00 | 7 |
| g5 | Advanced | C1 | Ольга Ветрова | Сб 11:00–14:00 | 4 |
| g6 | IELTS Prep | IELTS | Михаил Громов | Пт 18:00–20:00 | 3 |

## LessonInstance (производная сущность, не хранится)

Генерируется из `Group.schedule` на окно дат.

| Поле | Тип | Описание |
| --- | --- | --- |
| `groupId` | string | ссылка на Group |
| `date` | string | `YYYY-MM-DD` конкретного занятия |
| `start` / `end` | Date | начало и конец (date + startTime + durationMin) |
| `trialCount` | number | активных пробных записей на эту дату |
| `capacityLeft` | number | `capacity − enrolled − trialCount` |

## TrialBooking (localStorage через zustand persist)

| Поле | Тип | Описание | Валидация |
| --- | --- | --- | --- |
| `id` | string | uuid/`Date.now()` | — |
| `phone` | string | **ключ уникальности**, нормализованный `+7…` (11–15 цифр) | обязательно |
| `name` | string | имя посетителя | обязательно, ≥ 2 символов |
| `email` | string\|null | опционально | если есть — `^[^@\s]+@[^@\s]+\.[^@\s]+$` |
| `groupId` | string | ссылка на Group | обязательно, существующая группа |
| `lessonDate` | string | `YYYY-MM-DD` выбранного занятия | вхождение расписания группы в окне 14 дней; на дату `capacityLeft > 0` |
| `createdAt` | string | ISO-датавремя | auto |
| `status` | `'active'` | запись активна | — |

## Стор `useBookingsStore` (persist key: `trial-bookings`)

- `bookings: TrialBooking[]` — только активные; отмена = удаление.
- `myPhone: string | null` — телефон «своей» записи: ставится в `addBooking`, сбрасывается при `cancelByPhone(myPhone)`; по нему `MyBooking` определяет, какую запись показывать.
- `addBooking(b) → id` — если `phone` уже есть: старая запись заменяется новой (одна активная на телефон); `myPhone = b.phone`.
- `cancelByPhone(phone)` — удалить запись (место возвращается); если `phone === myPhone`, сбросить `myPhone`.
- `findByPhone(phone)` — найти активную запись.
- `trialsOn(groupId, date) → number` — число пробных на занятие.

## Правила и переходы

- `capacityLeft > 0` — обязательное условие создания записи (иначе «мест нет»).
- Повторная запись с тем же `phone` → `addBooking` удаляет старую и ставит новую.
- `cancelByPhone` → запись удаляется, `capacityLeft` на её дату увеличивается на 1.
