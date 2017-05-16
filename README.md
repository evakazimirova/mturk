# Сайт для разметки видеофайлов на MTurk

## Быстрый старт

Установка зависимости (выполняется 1 раз).
```sh
npm i
```

Запуск сервера.
```sh
npm start
```

Разработка фронтенда.
```sh
ng serve
```

После установки и запуска сайт становится доступным по адресу `http://localhost:4200/`.

## Выкатка на сервер

Разрешить запускать скрипт.
```sh
chmod +x deploy
```

Выкатываем на Heroku.
```sh
./deploy heroku
```

Сайт станет доступным тут https://mturk-video.herokuapp.com/.