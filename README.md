# Электронный журнал (Gradebook)

Веб-приложение для учета расписания, посещаемости, оценок и лабораторных работ с ролевой моделью доступа.

## Стек

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + TypeScript + Express + TypeORM
- Database: SQLite
- Auth: JWT access token + refresh token (cookie)
- Хранение файлов: локально в `server/uploads`

## Реализованные роли

- Студент
  - Главная с расписанием на сегодня
  - Личный журнал (оценки + посещаемость)
  - Предметы и детализация по предмету
  - Лабораторные: загрузка решения, просмотр оценки и комментария
- Преподаватель
  - Главная с парами на сегодня
  - Журнал: группы/предметы, добавление уроков, выставление оценок/посещаемости
  - Программа предмета (шаблон занятий с дедлайнами/материалами)
  - Проверка лабораторных: список сдач, выставление оценки и комментария
- Администратор (дополнительно)
  - Управление группами, студентами, предметами, расписанием

## Оценка выполнения основного ТЗ

Текущая оценка: **95%**.

### Что закрыто

- Используется БД SQLite для пользователей, расписания, оценок, лаб, файлов и связанных сущностей
- Разделение frontend/backend, REST API
- Роли и разграничение доступа реализованы (student/teacher/admin)
- Локальное файловое хранилище для лабораторных
- Отображение и проверка лабораторных между студентом и преподавателем
- Комментарии и оценки по лабораторным
- UI: адаптивные страницы, всплывающие окна, подсветка в журнале

### Что закрыто частично / осталось

- Серверная валидация покрыта в ключевых сценариях, но не вынесена в единый общий слой (DTO/schemas) для всех роутов
- Настройка команд для лабораторных добавлена на стороне преподавателя, но расширенные сценарии (несколько команд на одну лабораторную) не реализованы
- Для строгого production-уровня желательно добавить автотесты API и UI-сценариев

## Быстрый старт

### 1) Установка зависимостей

Выполнить в корне проекта:

```bash
npm install
```

И отдельно в подпроектах:

```bash
cd server && npm install
cd ../client && npm install
```

### 2) Переменные окружения (server/.env)

Создать файл `server/.env`:

```env
JWT_SECRET=super_secret_access
JWT_REFRESH_SECRET=super_secret_refresh
```

### 3) Запуск backend

```bash
cd server
npm run dev
```

Сервер стартует на `http://localhost:5000`.

### 4) (Опционально) заполнить тестовыми данными

```bash
cd server
npm run seed
```

### 5) Запуск frontend

```bash
cd client
npm run dev
```

Frontend стартует на `http://localhost:5173`.

## Тестовые аккаунты (после seed)

- Админ: `admin / admin123`
- Преподаватели: `teacher1 / teacher1`, `teacher2 / teacher2`, `teacher3 / teacher3`
- Студенты: `student1 / student1` ... `student50 / student50`

## Основные API-модули

- `POST /auth/login`, `POST /auth/register`, `GET /auth/me`
- `GET /schedule` (фильтрация по роли)
- `GET /journal`, `POST /journal/lesson`, `POST /journal/grade`, `POST /journal/attendance`
- `GET /student-grades/:id/grades`
- `GET /labs`, `GET /labs/:id`, `POST /labs/upload`
- `GET /lab-submissions/my`, `GET /lab-submissions`, `POST /lab-submissions`, `PATCH /lab-submissions/:id`

## Структура проекта

- `client/` - frontend (React + Vite)
- `server/` - backend (Express + TypeORM)
- `server/src/entities/` - модели БД
- `server/uploads/` - загруженные файлы лабораторных

