# AGENTS.md — правила работы ИИ-агента

Проект: **«Школа английского языка»** — сайт-продукт, собираемый модулями.
Каждый модуль — отдельная фича, которая проходит через Spec Kit (spec → plan → tasks → implement → converge).

## Стек (фиксированный, не менять без согласования с пользователем)

| Слой | Технология |
| --- | --- |
| UI | React 19, JSX (`.jsx`/`.js`, **без TypeScript**) |
| Сборка | Vite |
| Стили | Tailwind CSS v4 (только utility-классы, без CSS-модулей) |
| Роутинг | react-router-dom (отдельные страницы) |
| Состояние | zustand + persist в localStorage |
| Расписание | react-big-calendar + date-fns |
| Графики | recharts |
| Иконки | lucide-react |

Бэкенда нет. Данные — JSON-файлы в `src/data/` и/или localStorage браузера.

## Структура проекта

```
├── specs/                  # спеки модулей: specs/NNN-<feature>/{spec,plan,tasks}.md
├── src/
│   ├── main.jsx
│   ├── App.jsx             # роутер и layout
│   ├── pages/              # маленькие страницы сайта
│   ├── modules/            # модули продукта, один модуль = одна папка
│   │   └── <module>/       #   pages/, components/, data — внутри модуля
│   ├── components/         # общие UI-компоненты
│   ├── data/               # JSON-данные (студенты, преподаватели, расписание...)
│   └── store/              # zustand-сторы
├── public/
├── index.html
├── package.json
├── vite.config.js
├── requirements.txt        # все зависимости одним файлом
├── AGENTS.md               # этот файл
├── README.md               # описание для людей
└── .specify/               # Spec Kit: шаблоны, скрипты, конституция
```

## Рабочий процесс — обязательно

Код модуля **нельзя** писать без спеки. Порядок для каждой фичи:

1. `/speckit-specify <описание фичи>` — создаёт `specs/NNN-<slug>/spec.md`
2. `/speckit-clarify` — опционально, если спека неоднозначна
3. `/speckit-plan` — `plan.md` + дизайн-артефакты
4. `/speckit-tasks` — `tasks.md`
5. `/speckit-analyze` — опционально, проверка согласованности
6. `/speckit-implement` — реализация по задачам
7. `/speckit-converge` — проверка кодовой базы; повторять implement+converge до статуса `Converged`

## Правила кода

- Только JSX. TypeScript, `.ts`/`.tsx` — запрещены.
- Стили — только Tailwind-классы. Отдельные `.css` — только глобальные (`index.css`).
- Один модуль = одна папка `src/modules/<name>/`. Модули не импортируют друг друга напрямую — общий код выносится в `components/`, `data/`, `store/`.
- Сервер, API, fetch к бэкенду — запрещены. Всё локально: JSON + localStorage.
- Имена файлов/компонентов — PascalCase для компонентов, camelCase для остального.
- Не добавлять зависимости, которых нет в `requirements.txt`, без согласования.
- Не редактировать `.specify/templates/` и `.specify/scripts/` — это шаблоны Spec Kit.

## Команды

```bash
npm install          # установка зависимостей (список также в requirements.txt)
npm run dev          # запуск dev-сервера → http://localhost:5173
npm run build        # production-сборка
npm run preview      # предпросмотр сборки
```

Установка из `requirements.txt`:

```bash
# bash / Git Bash
npm install $(grep -v '^#' requirements.txt | grep -v '^\s*$' | xargs)

# PowerShell
npm install (Get-Content requirements.txt | Where-Object { $_ -notmatch '^\s*(#|$)' })
```

## Git

- `.devin/` — в `.gitignore`, **не коммитить** (там скиллы агента и возможные локальные данные).
- `.specify/` и `specs/` — коммитим, это часть процесса.
- Делать осмысленные коммиты; не коммитить `node_modules/`, `dist/`.

## Конституция

Базовые принципы продукта — в `.specify/memory/constitution.md`. При конфликте правил приоритет у конституции.

**Версия**: 1.0 | **Создано**: 2026-11-19