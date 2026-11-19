# Implementation Plan: Расписание групп и запись на пробный урок

**Branch**: `001-schedule-trial-signup` | **Date**: 2026-11-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-schedule-trial-signup/spec.md`

## Summary

Страница `/schedule`: недельная сетка расписания 6 групп на react-big-calendar
(события генерируются из шаблона «день недели + время» на окно текущей недели +2, навигация ограничена этим окном),
плюс запись на бесплатный пробный урок: выбор группы → дата ближайшего занятия →
форма (имя/телефон/email) → подтверждение. Записи — в zustand persist
(localStorage), лимит 8 человек на занятие с учётом пробных. Фича первая, поэтому
вместе с модулем поднимается скелет приложения (Vite + Tailwind v4 + роутер).

## Technical Context

**Language/Version**: JavaScript (JSX), Node 24 / npm — сборка Vite

**Primary Dependencies**: React 19, react-router-dom, zustand, react-big-calendar, date-fns, lucide-react; dev: Vite, @vitejs/plugin-react, Tailwind CSS v4, @tailwindcss/vite

**Storage**: `localStorage` (zustand persist, ключ `trial-bookings`) + статичный `src/data/groups.json`

**Testing**: Ручная проверка по `quickstart.md`; unit-тесты опциональны (vitest не в requirements.txt)

**Target Platform**: Современные браузеры, десктоп + мобильный (≥360px)

**Project Type**: web application (frontend-only SPA, без бэкенда)

**Performance Goals**: страница открывается < 2 с; расписание интерактивно без задержек

**Constraints**: офлайн-работа после загрузки; данные вымышленные и статичные; окно выбора даты — 14 дней

**Scale/Scope**: 1 страница-модуль (`src/modules/schedule`), 6 групп, ~9 слотов занятий в неделю

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Принцип | Статус | Комментарий |
| --- | --- | --- |
| I. Spec-First | ✅ | spec.md, checklist, plan — созданы до кода |
| II. Module Isolation | ✅ | код фичи в `src/modules/schedule/`; общее — `data/`, `store/` |
| III. Frontend-Only | ✅ | localStorage + JSON; API/сервер отсутствуют |
| IV. Fixed Stack | ✅ | только зависимости из requirements.txt |
| V. Small Pages | ✅ | одна страница `/schedule`, один модуль |

**Post-design re-check**: нарушений нет; новых зависимостей не потребовалось.

## Project Structure

### Documentation (this feature)

```text
specs/001-schedule-trial-signup/
├── plan.md              # этот файл
├── spec.md              # спека
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── ui-contracts.md  # Phase 1
└── checklists/
    └── requirements.md  # чеклист качества спеки
```

### Source Code (repository root)

```text
├── index.html
├── package.json
├── vite.config.js
├── requirements.txt        # уже есть — список зависимостей
└── src/
    ├── main.jsx            # entry, роутер
    ├── App.jsx             # layout + Routes (/schedule, / → redirect)
    ├── index.css           # @import "tailwindcss" + токены для rbc
    ├── data/
    │   └── groups.json     # 6 групп (см. data-model.md)
    ├── store/
    │   └── bookings.js     # useBookingsStore (zustand + persist)
    └── modules/
        └── schedule/
            ├── index.js              # barrel: SchedulePage
            ├── SchedulePage.jsx      # страница: календарь + MyBooking + форма
            ├── components/
            │   ├── ScheduleCalendar.jsx
            │   ├── EventCard.jsx     # событие RBC: уровень, преподаватель, N/8
            │   ├── BookingForm.jsx
            │   ├── BookingSummary.jsx
            │   └── MyBooking.jsx
            └── lib/
                ├── schedule.js       # генерация LessonInstance из шаблона, окно 14 дней
                └── validation.js     # нормализация телефона, validateBooking
```

**Structure Decision**: одно npm-приложение в корне (конституция: монорепо-репозиторий,
`npm run dev` в корне). Код фичи изолирован в `src/modules/schedule/`, что
удовлетворяет принципу Module Isolation без workspaces-церемонии.

## Complexity Tracking

> Нарушений конституции нет — секция пуста.
