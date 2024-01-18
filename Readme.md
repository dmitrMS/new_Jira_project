# jira_task
## Задача
Данный сервер- сервис для трекинга часов работы. Суть работы серсиса: пользователь заходит на сайт, нажимает кнопку "Начало работы", данные о начале работы сохраняются в базу данных. Аналогично, пользователь заявлет о том, что работа закончена. 
## Prisma
В задаче была использована ОРМ Prisma- инструмент, позволяющий работать с реляционными и нереляционной (MongoDB) базами данных с помощью JavaScript. При помощи данного инструмента к проекту была подключена реляционная база данных PostgreSQL.
### Команды для управления базой
Интерфейс командной строки Prisma предоставляет следующие основные команды:

init — создает шаблон Prisma-проекта:
--datasource-provider — провайдер для работы с БД: sqlite, postgresql, mysql, sqlserver или mongodb (перезаписывает datasource из schema.prisma);
--url — адрес БД (перезаписывает DATABASE_URL)
```
npx prisma init --datasource-provider postgresql --url postgresql://user:password@localhost:3306/mydb
```
db pull — генерирует модели на основе существующей схемы БД
```
npx prisma db pull
```
migrate
dev — выполняет миграцию для разработки:
--name — название миграции
```
npx prisma migrate dev --name init
```