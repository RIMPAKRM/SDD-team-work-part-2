# UI Contracts: модуль `schedule`

Внешних API нет (frontend-only). Контракты — публичный интерфейс модуля: маршруты,
экспорты компонентов, форма данных.

## Routes

| Путь | Компонент | Поведение |
| --- | --- | --- |
| `/schedule` | `SchedulePage` | Страница расписания + запись |
| `/` | — | `Navigate` → `/schedule` |

## Экспорты модуля `src/modules/schedule/`

```jsx
// index.js (barrel) — только эти два имени считаются публичными
export { default as SchedulePage } from './SchedulePage.jsx';
```

Остальные компоненты (`ScheduleCalendar`, `BookingForm`, `BookingSummary`,
`MyBooking`, `EventCard`) — внутренние, импортируются только внутри модуля.

## Контракт данных `src/data/groups.json`

```json
[
  {
    "id": "g1",
    "name": "Start",
    "level": "A1",
    "teacherName": "Анна Смирнова",
    "teacherRole": "Преподаватель",
    "capacity": 8,
    "enrolled": 5,
    "schedule": [
      { "weekday": 1, "startTime": "18:00", "durationMin": 90 },
      { "weekday": 3, "startTime": "18:00", "durationMin": 90 }
    ]
  }
]
```

## Контракт формы `BookingForm`

Вход: `group` (Group), `onSuccess(booking)`, `onCancel()`.

Поля и ошибки (рус.):

| Поле | Правило | Сообщение при ошибке |
| --- | --- | --- |
| `date` | дата из ближайших занятий группы, `capacityLeft > 0` | «Выберите дату занятия» / «На эту дату мест нет» |
| `name` | обязательно, ≥ 2 симв | «Введите имя (мин. 2 символа)» |
| `phone` | обязательно, 11–15 цифр после нормализации | «Введите корректный телефон» |
| `email` | опционально, формат email | «Некорректный email» |

Выход (submit, валидация пройдена): `TrialBooking` (см. data-model.md).

## Контракт стора `useBookingsStore`

```js
bookings: TrialBooking[]
myPhone: string | null        // телефон «своей» записи: ставится в addBooking, сбрасывается при её отмене
addBooking({ name, phone, email, groupId, lessonDate }) → booking   // заменяет запись с тем же phone
cancelByPhone(phone) → void
findByPhone(phone) → TrialBooking | undefined
trialsOn(groupId, lessonDate) → number
```

## Поведенческие контракты

- Клик по событию в календаре с `capacityLeft > 0` → открывается `BookingForm` для группы; с `capacityLeft = 0` → форма не открывается, событие помечено «мест нет».
- Успешная запись → показ `BookingSummary` + toast/блок «Вы записаны»; `MyBooking` отображается при следующем открытии страницы, если `findByPhone(myPhone)` возвращает активную запись.
- «Отменить запись» в `MyBooking` → место возвращается, блок пропадает.
