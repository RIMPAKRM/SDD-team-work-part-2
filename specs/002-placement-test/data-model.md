# Data Model: Тест на определение уровня

## Question (статичные данные, `src/data/questions.json`)

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | string | `q1`…`q15` |
| `text` | string | формулировка вопроса (англ./рус. контекст) |
| `options` | string[4] | ровно 4 варианта ответа |
| `correctIndex` | number | 0–3, ровно один правильный |

Требования к набору: ровно 15 вопросов, сложность нарастает (q1–q5 базовые, q6–q10 средние, q11–q15 продвинутые). Грамматика + лексика + короткое чтение.

## Level (перечисление + метаданные)

| Значение | Порог (правильных) | Рекомендуемая группа | Краткое описание |
| --- | --- | --- | --- |
| `Beginner` | 0–4 | `group-1` (A1) | «Начинающий — базовые фразы и правила» |
| `Elementary` | 5–8 | `group-2` (A2) | «Базовое общение на простые темы» |
| `Intermediate` | 9–12 | `group-3` (B1) | «Уверенное общение, средняя грамматика» |
| `Upper-Intermediate` | 13–15 | `group-4` (B2) | «Свободное общение на сложные темы» |

## TestResult (localStorage через zustand persist, ключ `test-result`)

| Поле | Тип | Описание |
| --- | --- | --- |
| `score` | number | 0–15 правильных ответов |
| `level` | string | `Beginner | Elementary | Intermediate | Upper-Intermediate` |
| `completedAt` | string | ISO-датавремя завершения |

## LevelGroupMap (`src/data/level-group-map.json`)

```json
{
  "Beginner": "group-1",
  "Elementary": "group-2",
  "Intermediate": "group-3",
  "Upper-Intermediate": "group-4"
}
```

## TestSession (в памяти, не хранится)

| Поле | Тип | Описание |
| --- | --- | --- |
| `phase` | `'intro' | 'running' | 'result'` | фаза экрана |
| `answers` | (number\|null)[15] | выбранный вариант на вопрос |
| `index` | number | текущий вопрос 0–14 |

## Стор `useTestResultStore` (persist key: `test-result`)

- `result: TestResult | null`
- `setResult(r)` — сохранить результат (перезаписывает предыдущий)
- `clearResult()` — сбросить (опционально, для отладки)

## Правила

- Уровень определяется только по счёту (пороги из таблицы Level) — функция `scoreToLevel(score)`.
- Завершение возможно при `answers` без `null` (все 15 отвечены).
- Рекомендация строится: `level → levelGroupMap → groups.json → Group`. Поля `enrolled` в данных нет — занятость считается по активным записям `trial_signups` в localStorage (общий ключ фичи 001): `occupied(groupId, date) = count(active записей на groupId+date)`.
- «Мест нет» у рекомендованной группы — когда на всех её занятиях в окне 14 дней `occupied >= 8`; тогда показываются альтернативные группы ближайших уровней со свободными местами.
