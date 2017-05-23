-- Список зарегистрированных аннотаторов. Read/Write
CREATE TABLE Annotators (
  id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  secondName VARCHAR(50) NOT NULL,
  login VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(40) NOT NULL, -- в зашифрованном (SHA1) виде
  emailToken VARCHAR(40), -- SHA1
  registered BIT DEFAULT ((0))
)

-- Таблица содержит URI необработанных видеозаписей и некоторые характеристики видео. Read Only
CREATE TABLE RAWVideo (
  id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  uri VARCHAR(255) NOT NULL
)

-- Список заданий разметки. Read only.
-- Под Ei подразумевается множество столбцов с именами E1...EN типа bool, где N=20.
-- Значение true говорит о том что данную эмоцию необходимо оценивать.
CREATE TABLE TasksMarkUP (
  TID int NOT NULL IDENTITY(1,1) PRIMARY KEY,
  CID int NOT NULL,
  E1 bit DEFAULT ((0)),
  E2 bit DEFAULT ((0)),
  E3 bit DEFAULT ((0)),
  E4 bit DEFAULT ((0)),
  E5 bit DEFAULT ((0)),
  E6 bit DEFAULT ((0)),
  E7 bit DEFAULT ((0)),
  E8 bit DEFAULT ((0)),
  E9 bit DEFAULT ((0)),
  E10 bit DEFAULT ((0)),
  E11 bit DEFAULT ((0)),
  E12 bit DEFAULT ((0)),
  E13 bit DEFAULT ((0)),
  E14 bit DEFAULT ((0)),
  E15 bit DEFAULT ((0)),
  E16 bit DEFAULT ((0)),
  E17 bit DEFAULT ((0)),
  E18 bit DEFAULT ((0)),
  E19 bit DEFAULT ((0)),
  E20 bit DEFAULT ((0))
)

-- Список заданий нарезки. Read only.
-- EventList содержит список событий которые надо выделить.
CREATE TABLE TasksEventSelection (
  TID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  VID INT NOT NULL,
  EventList VARCHAR(50) NOT NULL
)

-- Таблица содержит URI файлов с разметкой и связывает их с соответствующей видеозаписью через VID. Read/write
-- Поля CID VID индентификаторы разметки и видео соответственно. CID создается при добавлении записи в таблицу. CURI - URI файла с разметкой.
-- PersonName - имя размечаемого объекта.
-- PersonImage - Его изображение.
CREATE TABLE PersonSelection (
  TID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  VID INT NOT NULL,
  CURI VARCHAR(50) NOT NULL,
  PersonName VARCHAR(50) NOT NULL,
  PersonImage bit DEFAULT ((0))
)

-- Результаты разметки. Read/write
-- Под Ei подразумевается множество столбцов с именами E1...EN, типа Integer где N=20.
CREATE TABLE MarkUPResults (
  TID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  AID INT NOT NULL,
  E1 INT DEFAULT ((-1)),
  E2 INT DEFAULT ((-1)),
  E3 INT DEFAULT ((-1)),
  E4 INT DEFAULT ((-1)),
  E5 INT DEFAULT ((-1)),
  E6 INT DEFAULT ((-1)),
  E7 INT DEFAULT ((-1)),
  E8 INT DEFAULT ((-1)),
  E9 INT DEFAULT ((-1)),
  E10 INT DEFAULT ((-1)),
  E11 INT DEFAULT ((-1)),
  E12 INT DEFAULT ((-1)),
  E13 INT DEFAULT ((-1)),
  E14 INT DEFAULT ((-1)),
  E15 INT DEFAULT ((-1)),
  E16 INT DEFAULT ((-1)),
  E17 INT DEFAULT ((-1)),
  E18 INT DEFAULT ((-1)),
  E19 INT DEFAULT ((-1)),
  E20 INT DEFAULT ((-1))
)

-- Информация по проектам. Read only
CREATE TABLE Projects (
  PID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  ProjectName VARCHAR(50) NOT NULL,
  PricePerTask float(6) NOT NULL,
  AnnoPerTask	INT NOT NULL
)

-- Список заданий выполняемых / выполненных аннотатором. Read/Write
-- Изменяется при принятии пользователем задания.
-- В зависимости от типа задания поля TID_M и TID_E принимают соответствующие значения.
-- M - из таблицы TaskMarkUP
-- E - из таблицы TaskEventSelection
-- Неиспользуемый ID равный null.
CREATE TABLE AnnotatorTasks (
  AID INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  TID_M INT NOT NULL,
  TID_E INT NOT NULL,
  Status INT NOT NULL,
  Price float(6) NOT NULL
)

-- Содержит расшифровку столбцов Ei в таблице TasksMarkUP. Read only
-- Пример:
-- E1 EmotionOne
-- E2 EmotionTwo
-- ...
-- E10 EmotionThree
CREATE TABLE EmotionInfo (
  ShortName VARCHAR(50) NOT NULL,
  LongName VARCHAR(50) NOT NULL
)

-- Содержит расшифровку записей в столбце EmotionList в таблице TasksEventSelection. Read only
-- Используется при формировании заголовков колонок в выходном файле с оценками.
-- Для EventInfo:
-- Ev1 Речь 1
-- Ev2 Речь 2
-- ...
-- Ev6 реклама
CREATE TABLE EventInfo (
  ShortName VARCHAR(50) NOT NULL,
  LongName VARCHAR(50) NOT NULL
)