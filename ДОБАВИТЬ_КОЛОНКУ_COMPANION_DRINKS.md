# Добавление колонки companion_drinks в Supabase

Если алкоголь второго гостя не сохраняется, выполните этот SQL в Supabase:

## SQL для выполнения в Supabase SQL Editor:

```sql
ALTER TABLE responses ADD COLUMN companion_drinks TEXT;
```

## Как выполнить:

1. Откройте Supabase Dashboard → ваш проект
2. Перейдите в **SQL Editor** (слева, иконка `</>`)
3. Нажмите **"New query"**
4. Вставьте SQL выше
5. Нажмите **"Run"** или `Ctrl+Enter`
6. Должно появиться сообщение "Success. No rows returned"

## Проверка:

После выполнения SQL проверьте, что колонка создана:

1. Перейдите в **Table Editor**
2. Выберите таблицу `responses`
3. Должна появиться колонка `companion_drinks` типа `text`

## После этого:

1. Перезапустите сервер
2. Попробуйте заполнить форму снова
3. Проверьте админку - алкоголь второго гостя должен появиться
