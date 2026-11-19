# Tasks: Расписание групп и запись на пробный урок

**Input**: Design documents from `/specs/001-schedule-trial-signup/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md

**Tests**: Тестовые задачи не включены — в спеке не запрошены, проверка по quickstart.md.

**Organization**: US1 (просмотр расписания) и US2 (запись) — обе P1, но US2 зависит от календаря US1 как точки входа формы; US3 зависит от US2. Порядок — последовательный.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: параллелизуемо (другие файлы, нет зависимостей)
- **[Story]**: US1/US2/US3 — по user stories из spec.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Скелет приложения — без него модуль некуда встроить

- [ ] T001 Создать `package.json` (vite-проект, скрипты `dev`/`build`/`preview`) и установить зависимости: react, react-dom, react-router-dom, zustand, react-big-calendar, date-fns, recharts, lucide-react; dev: vite, @vitejs/plugin-react, tailwindcss, @tailwindcss/vite
- [ ] T002 [P] Создать `index.html` (root div, lang="ru", подключение /src/main.jsx)
- [ ] T003 [P] Создать `vite.config.js` (plugins: react, tailwindcss)
- [ ] T004 [P] Создать `src/index.css` (`@import "tailwindcss"` + базовые стили + CSS-переопределения для react-big-calendar: фон, бордеры, акцент)
- [ ] T005 Создать `src/main.jsx` (BrowserRouter) и `src/App.jsx` (Routes: `/` → Navigate `/schedule`, `/schedule` → SchedulePage); создать заглушку `src/modules/schedule/index.js` + `SchedulePage.jsx` (рендерит заголовок) чтобы приложение запускалось
- [ ] T006 Проверить `npm run dev` — страница открывается на http://localhost:5173/schedule

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Данные, стор и логика, нужные всем user stories

**⚠️ CRITICAL**: До завершения этой фазы работы по stories не начинать

- [ ] T007 [P] Создать `src/data/groups.json` — 6 групп точно по seed из data-model.md (g1 A1 Пн/Ср 18:00–19:30 enrolled 5; g2 A2 Вт/Чт 10:00–11:30 enrolled 8; g3 B1 Пн/Ср/Пт 12:00–13:30 enrolled 6; g4 B2 Вт/Чт 18:30–20:00 enrolled 7; g5 C1 Сб 11:00–14:00 enrolled 4; g6 IELTS Пт 18:00–20:00 enrolled 3; у каждой name/teacherName/capacity 8)
- [ ] T008 [P] Создать `src/modules/schedule/lib/schedule.js` — `nextOccurrences(group, days=14)` (даты вхождений по weekday из group.schedule), `buildEvents(groups, trialCount)` (LessonInstance: start/end Date, capacityLeft = 8 − enrolled − trialsOn), `getGroup(id)`
- [ ] T009 [P] Создать `src/store/bookings.js` — zustand-стор с persist (ключ `trial-bookings`): bookings[], addBooking (заменяет запись с тем же phone), cancelByPhone, findByPhone, trialsOn(groupId, lessonDate)
- [ ] T010 [P] Создать `src/modules/schedule/lib/validation.js` — `normalizePhone` (не-цифры удалить, 8→+7, итог 11–15 цифр) и `validateBooking({name, phone, email, lessonDate})` → `{field: message}` по правилам из ui-contracts.md

**Checkpoint**: Данные + стор + утилиты готовы — можно делать stories

---

## Phase 3: User Story 1 - Просмотр недельного расписания (Priority: P1) 🎯 MVP

**Goal**: Недельная сетка всех 6 групп с уровнем, преподавателем, днями, временем и занятостью «N из 8»

**Independent Test**: Открыть `/schedule` — видны все 6 групп в правильных днях/слотах; у g2 состояние «мест нет» (quickstart сценарии 1–2)

### Implementation for User Story 1

- [ ] T011 [P] [US1] Создать `src/modules/schedule/components/EventCard.jsx` — кастомный рендер события RBC: название+уровень группы, преподаватель, время, «занято N из 8», визуальное состояние «мест нет» при capacityLeft=0
- [ ] T012 [US1] Создать `src/modules/schedule/components/ScheduleCalendar.jsx` — react-big-calendar: `dateFnsLocalizer` с ru-локалью и русскими messages, view="week" only, навигация ограничена окном событий (`min`/`max`), диапазон времени по занятиям, выходные видны (сб есть занятия), события из `buildEvents` (T008), компонент event = EventCard (T011)
- [ ] T013 [US1] Обновить `src/modules/schedule/SchedulePage.jsx` — импорт `react-big-calendar/lib/css/react-big-calendar.css`, заголовок страницы, подключение ScheduleCalendar, передача groups.json + trialsOn из стора
- [ ] T014 [US1] Проверить в браузере: все 6 групп на месте, «мест нет» у g2, сетка читаема (quickstart 1–2)

**Checkpoint**: US1 полностью работает и тестируется независимо

---

## Phase 4: User Story 2 - Запись на бесплатный пробный урок (Priority: P1)

**Goal**: Запись на пробный урок: выбор группы → дата из ближайших занятий (14 дн.) → форма → подтверждение; блокировки по вместимости и дублю телефона

**Independent Test**: На `/schedule` кликнуть свободное занятие → форма → успешная запись с подтверждением; полная группа недоступна; дубль телефона → перезапись (quickstart 3–6)

### Implementation for User Story 2

- [ ] T015 [P] [US2] Создать `src/modules/schedule/components/BookingSummary.jsx` — карточка подтверждения: группа, уровень, преподаватель, дата, день недели и время
- [ ] T016 [US2] Создать `src/modules/schedule/components/BookingForm.jsx` — выбор даты из `nextOccurrences(group)` (даты с capacityLeft=0 отключены с подписью «мест нет»), поля имя/телефон/email, валидация через `validateBooking` при submit, ошибки у полей на русском
- [ ] T017 [US2] В `ScheduleCalendar.jsx`/EventCard сделать событие кликабельным только при capacityLeft>0: клик → открыть BookingForm для этой группы (и предвыбранной датой); при capacityLeft=0 событие неактивно
- [ ] T018 [US2] В `SchedulePage.jsx` реализовать submit-поток: `validateBooking` → `findByPhone` (если запись есть — экран «у вас уже есть запись» с кнопкой «Перезаписаться») → `addBooking` → показ BookingSummary; счётчик мест обновляется
- [ ] T019 [US2] Проверить в браузере: happy path, ошибки валидации, «мест нет», дубль телефона (quickstart 3–6)

**Checkpoint**: US1 и US2 работают; запись конверсионная цель достигнута

---

## Phase 5: User Story 3 - Просмотр своей записи (Priority: P3)

**Goal**: Вернувшийся посетитель видит свою активную запись и может её отменить

**Independent Test**: Записаться → перезагрузить страницу → блок «Вы записаны» с деталями; «Отменить» → место вернулось (quickstart 7–8)

### Implementation for User Story 3

- [ ] T020 [US3] Создать `src/modules/schedule/components/MyBooking.jsx` — блок «Вы записаны на пробный урок»: детали записи (группа, дата, время), кнопка «Отменить запись» → `cancelByPhone`
- [ ] T021 [US3] Подключить `MyBooking` на `SchedulePage.jsx` (показывается, если `findByPhone` находит запись — для MVP определить «свой» телефон через последнюю созданную запись: хранить `myPhone` в сторе при addBooking)
- [ ] T022 [US3] Проверить в браузере: персистентность после reload и отмена (quickstart 7–8)

**Checkpoint**: Все три stories работают

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T023 Адаптивность: страница читаема на 360px (quickstart сценарий 9) — проверить и поправить стили в `SchedulePage.jsx`/EventCard
- [ ] T024 Пройти все сценарии `quickstart.md` (1–9) и исправить найденные дефекты
- [ ] T025 Обновить `README.md`: добавить ссылку на страницу `/schedule` и статус первой фичи

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: без зависимостей — начать сразу
- **Foundational (Phase 2)**: после Setup — БЛОКИРУЕТ все stories
- **US1 (Phase 3)**: после Foundational
- **US2 (Phase 4)**: зависит от US1 (точка входа формы — событие календаря)
- **US3 (Phase 5)**: зависит от US2 (нужны существующие записи и стор)
- **Polish (Phase 6)**: после всех stories

### User Story Dependencies

- **US1 (P1)**: после Phase 2 — независима
- **US2 (P1)**: после US1 — использует календарь/события как точку входа; независимо тестируема
- **US3 (P3)**: после US2 — нужен стор записей и submit-поток

### Parallel Opportunities

- T002, T003, T004 — параллельно (разные файлы)
- T007, T008, T009, T010 — параллельно (json, lib, store, validation)
- T011 ∥ T015, T016 — компоненты разных stories на разных файлах (если работают 2 разработчика после US1-старт)
- US3 не стартует до T018

---

## Parallel Example: Foundational

```bash
Task: "T007 groups.json"        # данные
Task: "T008 lib/schedule.js"    # генерация занятий
Task: "T009 store/bookings.js"  # стор
Task: "T010 lib/validation.js"  # валидация
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 + Phase 2 → приложение запускается, данные/стор готовы
2. Phase 3 (US1) → **STOP и валидация**: расписание видно, «мест нет» работает — уже демо-ценность
3. Phase 4 (US2) → конверсионная цель фичи
4. Phase 5 (US3) + Polish → готово к показу

### Incremental Delivery

US1 → US2 → US3 — каждая проверяется по quickstart.md после своей фазы.

---

## Notes

- Все задачи — JSX/React, без TypeScript (конституция)
- Никакого бэкенда/API — только JSON + localStorage
- Коммит после логической группы задач рекомендуется, но не обязателен
