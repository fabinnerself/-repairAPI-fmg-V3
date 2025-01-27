 CREATE TABLE "user"
(
    "idUser" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) UNIQUE NOT NULL,
    "password" VARCHAR(20) NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'client' CHECK ("role" IN ('client', 'employee')),
    "status" VARCHAR(20) NOT NULL DEFAULT 'available' CHECK ("status" IN ('available', 'disabled')),
);

CREATE TABLE "repair"
(
    "idRepair" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "date" DATE NOT NULL,
    "motorsNumber" INTEGER NOT NULL,
    "description" TEXT,
    "status" VARCHAR(15) NOT NULL DEFAULT 'pending' CHECK ("status" IN ('pending', 'completed', 'cancelled')),
    "idUser" UUID NOT NULL,
    PRIMARY KEY ("idRepair"),
    FOREIGN KEY ("idUser") REFERENCES "user"("idUser")
);

CREATE TABLE user
(
  id CHAR NOT NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  role VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (email)
);

CREATE TABLE repair
(
  id CHAR NOT NULL,
  date DATE NOT NULL,
  motorsNumber INT NOT NULL,
  description VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  idUser CHAR NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (idUser) REFERENCES user(id)
);
