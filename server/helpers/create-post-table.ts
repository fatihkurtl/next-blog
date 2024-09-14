import { query } from "../utils/db";

export const createPostTable = async () => {
  try {
    await query(
      `CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE
            )`
    );

    console.log("Category table created/exists");

    await query(`
            CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            subTitle VARCHAR(255),
            category_id INTEGER NOT NULL,
            imageUrl VARCHAR(255),
            content TEXT NOT NULL,
            author VARCHAR(255),
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
            )`);

    console.log("Post table created/exists");
  } catch (error) {
    console.error(error);
  }
};
