CREATE TABLE Annotators (
  id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  secondName VARCHAR(50) NOT NULL,
  login VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(40) NOT NULL, -- в зашифрованном (SHA1) виде
  emailToken VARCHAR(40) -- SHA1
)