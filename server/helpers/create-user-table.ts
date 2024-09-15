import { query } from "../utils/db";

export const createUserTable = async () => {
  try {

    await query(
        `CREATE TABLE IF NOT EXISTS tokens (
            id SERIAL PRIMARY KEY,
            token VARCHAR(255) NOT NULL UNIQUE            
        )`
    );


    await query(
      `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                fullname VARCHAR(255) NOT NULL,
                imageurl VARCHAR(255),
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                terms BOOLEAN NOT NULL DEFAULT false,
                token_id INTEGER REFERENCES tokens (id),
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (token_id) REFERENCES tokens (id)
            )`
    );

    console.log("User table created/exists");
  } catch (error) {
    console.error(error);
  }
};
