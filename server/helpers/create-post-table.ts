import { query } from "../utils/db";

export const createPostTable = async () => {
  try {
    await query(`
            CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            subTitle VARCHAR(255),
            category VARCHAR(255) NOT NULL,
            imageUrl VARCHAR(255),
            content TEXT NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            author VARCHAR(255)
            )
        `);

    console.log("Post table created/exists");
  } catch (error) {
    console.error(error);
  }
};
