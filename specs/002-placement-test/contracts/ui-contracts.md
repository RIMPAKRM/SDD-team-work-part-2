# UI Contracts: модуль `test`

## Routes

| Путь | Компонент | Поведение |
| --- | --- | --- |
| `/test` | `TestPage` | Тест на уровень: intro → 15 вопросов → результат + рекомендация |

## Экспорты модуля `src/modules/test/`

```jsx
// index.js — публичный интерфейс модуля
export { default as TestPage } from './TestPage.jsx';
```

Внутренние компоненты (`QuestionCard`, `ProgressBar`, `ResultCard`, `Recommendation`) — только внутри модуля.

## Общий компонент `src/components/TestBanner.jsx`

```jsx
<TestBanner />        // баннер «Пройди тест на уровень» со ссылкой на /test
```

Размещается на `SchedulePage` (фича 001) и других страницах по необходимости. Если у пользователя сохранён результат — баннер может показывать его кратко.

## Контракт данных `src/data/questions.json`

```json
[
  {
    "id": "q1",
    "text": "She ___ a student.",
    "options": ["is", "are", "am", "be"],
    "correctIndex": 0
  }
]
```

Требования: ровно 15 записей, `options` ровно 4 элемента, `correctIndex` ∈ [0,3].

## Контракт данных `src/data/level-group-map.json`

```json
{ "Beginner": "group-1", "Elementary": "group-2", "Intermediate": "group-3", "Upper-Intermediate": "group-4" }
```

## Контракт стора `useTestResultStore`

```js
result: { score: number, level: string, completedAt: string } | null
setResult(result) → void      // перезаписывает
clearResult() → void
```

## Межмодульный контракт (с фичей 001)

| Направление | Контракт |
| --- | --- |
| test → schedule | Переход на `/?group=<groupId>` — страница расписания живёт на `/` (фича 001). ⚠️ Текущая реализация 001 параметр `group` не обрабатывает — передаётся для будущей подсветки/предвыбора |
| schedule → test | `TestBanner` на странице расписания (`/`) ссылается на `/test` |
| test ← shared | Читает `src/data/groups.json` (только чтение) для рекомендации и `trial_signups` из localStorage для занятости |

## Поведенческие контракты

- Тест стартует на фазе `intro` («Пройти тест»), либо сразу на `result`, если результат сохранён.
- На `result` показываются: уровень, счёт «X из 15», описание, рекомендованная группа (данные из `groups.json`), кнопка «Записаться на пробный» → `/?group=<id>`, кнопка «Пройти заново».
- Когда у рекомендованной группы нет свободных мест на ближайшие занятия (`occupied >= 8` по `trial_signups` на всех слотах) — пометка «мест нет» + список альтернативных групп.
