# Школа английского языка

Сайт-продукт для вымышленной школы английского языка. Собирается **модулями**:
каждый модуль — отдельная спека в `specs/` и свой кусок кода в `src/modules/`.

Бэкенда нет: данные лежат в локальных JSON-файлах (`src/data/`) и в `localStorage`
браузера. Всё статическое, запускается локально одной командой.

## Технологии

- React 19 + JSX (без TypeScript)
- Vite — сборка и dev-сервер
- Tailwind CSS v4 — стили
- react-router-dom — страницы
- zustand — состояние и сохранение в localStorage
- react-big-calendar + date-fns — расписание занятий
- recharts — графики (статистика школы, прогресс и т.п.)
- lucide-react — иконки

Полный список — в `requirements.txt`.

## Быстрый старт

```bash
npm install     # установить зависимости
npm run dev     # запустить → http://localhost:5173
```

Или одной строкой из `requirements.txt`:

```bash
# Git Bash
npm install $(grep -v '^#' requirements.txt | grep -v '^\s*$' | xargs)

# PowerShell
npm install (Get-Content requirements.txt | Where-Object { $_ -notmatch '^\s*(#|$)' })
```

## Структура

```
specs/          спеки модулей (spec.md, plan.md, tasks.md на каждую фичу)
src/
  modules/      модули продукта — один модуль = одна папка
  pages/        страницы сайта
  components/   общие компоненты
  data/         JSON-данные (студенты, группы, расписание...)
  store/        zustand-сторы
.specify/       Spec Kit: шаблоны, скрипты, конституция проекта
```

## Как добавляется новый модуль

Проект ведётся через Spec Kit (spec-driven development). Порядок в чате агента:

1. `/speckit-specify` — что за фича и зачем
2. `/speckit-plan` — как реализуем
3. `/speckit-tasks` — разбивка на задачи
4. `/speckit-implement` — реализация
5. `/speckit-converge` — доводка до готовности

Правила для ИИ-агентов — в `AGENTS.md`, принципы продукта — в
`.specify/memory/constitution.md`.
