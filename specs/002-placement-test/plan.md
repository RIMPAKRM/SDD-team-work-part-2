# Implementation Plan: Тест на определение уровня

**Branch**: `002-placement-test` | **Date**: 2026-11-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-placement-test/spec.md`

## Summary

Страница `/test`: placement-тест из 15 вопросов с вариантами ответа (пошагово,
прогресс N/15), скоринг по порогам в 4 уровня (Beginner → Upper-Intermediate) и
экран результата с рекомендацией конкретной группы из `groups.json` (фича 001)
+ переходом `/?group=<id>` на страницу расписания и записи (параметр `group`
передаётся на будущее — текущая реализация 001 его не обрабатывает). Результат —
в zustand persist (`test-result`), повторный визит показывает его с кнопкой
«Пройти заново». Тест опционален — не блокирует запись; точка входа — общий
баннер `TestBanner` на странице расписания. Фича 001 уже реализована: 002 читает
только общие данные (`groups.json`, `trial_signups`) и не импортирует код её модуля.

## Technical Context

**Language/Version**: JavaScript (JSX), Node 24 / npm — сборка Vite

**Primary Dependencies**: React 19, react-router-dom, zustand, date-fns, lucide-react; dev: Vite, @vitejs/plugin-react, Tailwind CSS v4, @tailwindcss/vite (react-big-calendar/recharts здесь не нужны)

**Storage**: `localStorage` (zustand persist, ключ `test-result`) + статичные `src/data/questions.json`, `src/data/level-group-map.json`, чтение `src/data/groups.json` и `trial_signups` (localStorage, только чтение — занятость групп)

**Testing**: Ручная проверка по `quickstart.md`; unit-тесты опциональны

**Target Platform**: Современные браузеры, десктоп + мобильный (≥360px)

**Project Type**: web application (frontend-only SPA, без бэкенда)

**Performance Goals**: страница открывается < 2 с; переходы между вопросами мгновенные

**Constraints**: 15 фиксированных вопросов; прогресс сессии не сохраняется; офлайн после загрузки

**Scale/Scope**: 1 страница-модуль (`src/modules/test`), ~4 внутренних компонента, 1 общий баннер

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Принцип | Статус | Комментарий |
| --- | --- | --- |
| I. Spec-First | ✅ | spec.md + checklist созданы до кода |
| II. Module Isolation | ✅ | код в `src/modules/test/`; общее — `data/`, `store/`, `components/`; модуль 001 не импортируется — связь через URL и shared JSON |
| III. Frontend-Only | ✅ | localStorage + JSON; API/сервер отсутствуют |
| IV. Fixed Stack | ✅ | только зависимости из requirements.txt |
| V. Small Pages | ✅ | одна страница `/test`, один модуль |

**Post-design re-check**: нарушений нет; новых зависимостей не потребовалось.

## Project Structure

### Documentation (this feature)

```text
specs/002-placement-test/
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
src/
├── data/
│   ├── questions.json         # 15 вопросов (data-model.md)
│   ├── level-group-map.json   # level → groupId
│   └── groups.json            # (фича 001, читается на рекомендацию)
├── store/
│   └── testResult.js          # useTestResultStore (zustand + persist)
├── components/
│   └── TestBanner.jsx         # общий баннер «Пройди тест» → /test
├── modules/
│   └── test/
│       ├── index.js               # barrel: TestPage
│       ├── TestPage.jsx           # фазы intro | running | result
│       ├── components/
│       │   ├── QuestionCard.jsx   # вопрос + 4 варианта
│       │   ├── ProgressBar.jsx    # «Вопрос N из 15» + полоса
│       │   ├── ResultCard.jsx     # уровень + счёт + описание
│       │   └── Recommendation.jsx # рекомендованная группа + CTA
│       └── lib/
│           └── scoring.js         # scoreToLevel, levelMeta (пороги, описания)
└── App.jsx                    # + маршрут /test
```

**Structure Decision**: модуль изолирован в `src/modules/test/`; интеграция с 001 —
только через общие файлы (`groups.json`, `App.jsx` роуты, `components/TestBanner`)
и URL `/schedule?group=`. Баннер добавляется на `SchedulePage` одной строкой,
что является минимальным согласованным касанием модуля 001.

## Complexity Tracking

> Нарушений конституции нет — секция пуста.
