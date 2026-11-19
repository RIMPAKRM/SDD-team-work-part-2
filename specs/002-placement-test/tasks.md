# Tasks: Тест на определение уровня (placement test)

**Input**: Design documents from `/specs/002-placement-test/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contracts.md

**Tests**: Тестовые задачи не включены — в спеке не запрошены, проверка по quickstart.md.

**Organization**: US1 (тест + уровень) и US2 (рекомендация) — обе P1; US2 зависит от результата US1. US3 (P3) зависит от экрана результата. Порядок — последовательный.

**Примечание**: фича 001 уже реализована — расписание живёт на маршруте `/`, данные групп в `src/data/groups.json` (id `group-1`…`group-6`, без `enrolled`), пробные записи — в localStorage `trial_signups` (занятость = только пробные). Эта фича читает общие данные и `src/App.jsx`, код модуля 001 не импортирует.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: параллелизуемо (другие файлы, нет зависимостей)
- **[Story]**: US1/US2/US3 — по user stories из spec.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: База приложения + скелет модуля

- [ ] T001 Убедиться, что скелет приложения на месте (`package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css` — создан фичей 001) и зависимости установлены (`npm install`)
- [ ] T002 Создать `src/modules/test/index.js` + заглушку `src/modules/test/TestPage.jsx` (рендерит заголовок «Тест на уровень») и добавить маршрут `/test` → TestPage в `src/App.jsx`
- [ ] T003 Проверить `npm run dev` — `http://localhost:5173/test` открывается без ошибок

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Данные, стор и скоринг — нужны всем stories

**⚠️ CRITICAL**: До завершения этой фазы работы по stories не начинать

- [ ] T004 [P] Создать `src/data/questions.json` — ровно 15 вопросов по схеме из data-model.md (`id` q1–q15, `text`, `options` ровно 4 варианта, `correctIndex` 0–3 ровно один правильный); нарастающая сложность: q1–q5 базовая грамматика (to be, a/an, формы глаголов), q6–q10 средняя (Present Perfect vs Past Simple, предлоги, фразовые), q11–q15 продвинутая (conditionals, passive, reported speech, лексика уровня B2); часть вопросов — мини-чтение/диалог
- [ ] T005 [P] Создать `src/data/level-group-map.json` — `{ "Beginner": "group-1", "Elementary": "group-2", "Intermediate": "group-3", "Upper-Intermediate": "group-4" }` по data-model.md
- [ ] T006 [P] Создать `src/store/testResult.js` — `useTestResultStore` (zustand + persist, ключ `test-result`): `result: {score, level, completedAt} | null`, `setResult`, `clearResult`
- [ ] T007 [P] Создать `src/modules/test/lib/scoring.js` — `scoreToLevel(score)` по порогам: 0–4→Beginner, 5–8→Elementary, 9–12→Intermediate, 13–15→Upper-Intermediate; `LEVEL_META` — название и короткое описание на русском для каждого из четырёх уровней (тексты из таблицы Level в data-model.md)

**Checkpoint**: Данные + стор + скоринг готовы

---

## Phase 3: User Story 1 - Прохождение теста и получение уровня (Priority: P1) 🎯 MVP

**Goal**: 15 вопросов пошагово с прогрессом → экран результата с уровнем и счётом «X из 15»

**Independent Test**: Открыть `/test` → ответить на все вопросы → уровень и счёт корректны (quickstart 1–5)

### Implementation for User Story 1

- [ ] T008 [P] [US1] Создать `src/modules/test/components/ProgressBar.jsx` — «Вопрос N из 15» + заполняемая полоса прогресса
- [ ] T009 [P] [US1] Создать `src/modules/test/components/QuestionCard.jsx` — текст вопроса + 4 варианта как radio-группа (выбор одного), выбранный вариант подсвечен
- [ ] T010 [P] [US1] Создать `src/modules/test/components/ResultCard.jsx` — отображение `level` (крупно), счёт «X из 15», описание из `LEVEL_META`
- [ ] T011 [US1] Реализовать `src/modules/test/TestPage.jsx` — фазы `intro` (приветствие + «Пройти тест») → `running` (QuestionCard + ProgressBar + кнопки «Назад»/«Далее»; «Далее» disabled без ответа; на вопросе 15 — «Узнать результат», активна при answers без null) → подсчёт score по questions.json → `setResult` → фаза `result` с ResultCard
- [ ] T012 [US1] Проверить в браузере: прогон quickstart сценарии 1–5 (прогресс, блокировка «Далее», возврат с сохранённым ответом, результат)

**Checkpoint**: US1 работает — тест проходится, уровень корректный

---

## Phase 4: User Story 2 - Рекомендация группы по результату (Priority: P1)

**Goal**: На экране результата — рекомендованная группа по уровню и переход к записи на пробный урок

**Independent Test**: Получить результат → видна рекомендованная группа с описанием; «Записаться на пробный» → `/schedule?group=<id>`; у полной группы — «мест нет» + альтернативы (quickstart 6–7)

### Implementation for User Story 2

- [ ] T013 [P] [US2] Создать `src/modules/test/components/Recommendation.jsx` — props `level`; строит рекомендацию: `level → level-group-map.json → groups.json → Group` (чтение, без импорта модуля 001); показывает уровень, преподавателя, расписание группы и занятость «N из 8» (занятость — по активным записям `trial_signups` из localStorage, `enrolled` в данных нет); если на всех ближайших занятиях группы `occupied >= 8` — пометка «мест нет» + альтернативные группы ближайших уровней со свободными местами
- [ ] T014 [US2] Подключить `Recommendation` на фазу `result` в `src/modules/test/TestPage.jsx`; кнопка «Записаться на пробный» → `navigate('/?group=' + groupId)` (react-router-dom `useNavigate`; страница расписания живёт на `/`, параметр `group` передаётся на будущее — 001 его пока не обрабатывает); кнопка «Пройти заново» → сброс сессии в `intro`
- [ ] T015 [US2] Проверить в браузере: quickstart 6–7 + сценарий «мест нет» при результате Elementary (`group-2`) — создать 8 пробных записей в `trial_signups` на её ближайшие занятия (через DevTools Console) → рекомендация помечена и альтернативы показаны

**Checkpoint**: US1+US2 работают — от теста к записи в рекомендованную группу

---

## Phase 5: User Story 3 - Сохранение результата и повторное прохождение (Priority: P3)

**Goal**: Вернувшийся посетитель видит сохранённый результат и может перепройти тест

**Independent Test**: Пройти тест → перезагрузить `/test` → результат на месте; «Пройти заново» → новый результат заменяет старый (quickstart 8–9)

### Implementation for User Story 3

- [ ] T016 [US3] В `src/modules/test/TestPage.jsx` при mount: если `useTestResultStore.result` существует — стартовать с фазы `result` (ResultCard + Recommendation) вместо `intro`; «Пройти заново» очищает только сессию (result перезапишется при новом завершении)
- [ ] T017 [US3] Проверить в браузере: quickstart 8–9 (персистентность, замена результата)

**Checkpoint**: Все три stories работают

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T018 Создать `src/components/TestBanner.jsx` — баннер «Пройди тест на уровень» со ссылкой на `/test` (при наличии сохранённого результата — краткая строка «Ваш уровень: X»); добавить на `src/modules/schedule/SchedulePage.jsx` (файл фичи 001, существует) одной строкой — интеграция по ui-contracts.md
- [ ] T019 Адаптивность: тест и результат читаемы на 360px (quickstart 10)
- [ ] T020 Пройти все сценарии `quickstart.md` (1–10) и исправить дефекты
- [ ] T021 Обновить `README.md`: страница `/test`, статус фичи

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: без зависимостей (T001 условна — если скелет из 001 уже есть, задача тривиальна)
- **Foundational (Phase 2)**: после Setup — БЛОКИРУЕТ все stories
- **US1 (Phase 3)**: после Foundational
- **US2 (Phase 4)**: зависит от US1 (экран result + вычисленный level)
- **US3 (Phase 5)**: зависит от US1+US2 (состав экрана result)
- **Polish (Phase 6)**: после stories

### User Story Dependencies

- **US1 (P1)**: после Phase 2 — независима
- **US2 (P1)**: после US1 — строится на фазе `result`; независимо тестируема
- **US3 (P3)**: после US2 — меняет стартовую фазу TestPage

### Parallel Opportunities

- T004, T005, T006, T007 — параллельно (json, json, store, lib)
- T008, T009, T010 — параллельно (три разных компонента)
- T013 ∥ T011/T012 — Recommendation можно писать параллельно с доделкой TestPage

---

## Parallel Example: Foundational

```bash
Task: "T004 questions.json"          # банк вопросов
Task: "T005 level-group-map.json"    # маппинг
Task: "T006 store/testResult.js"     # стор
Task: "T007 lib/scoring.js"          # скоринг
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 + Phase 2 → `/test` открывается, данные/стор/скоринг готовы
2. Phase 3 (US1) → **STOP и валидация**: тест проходится, уровень считается — уже демо-ценность
3. Phase 4 (US2) → конверсия: рекомендация + переход к записи
4. Phase 5 (US3) + Polish → персистентность, интеграция с расписанием

### Incremental Delivery

US1 → US2 → US3 — каждая проверяется по quickstart.md после своей фазы.

---

## Notes

- Все задачи — JSX/React, без TypeScript (конституция)
- Никакого бэкенда/API — только JSON + localStorage
- Модуль 001 не импортируется; связь — через `/?group=` и общие данные `src/data/groups.json` + `trial_signups` (localStorage, только чтение)
- Коммит после логической группы задач рекомендуется, но не обязателен
