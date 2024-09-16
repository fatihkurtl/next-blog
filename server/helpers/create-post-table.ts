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


    const columnExists = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='posts' AND column_name='user_id'
    `);

    if (columnExists.rowCount === 0) {
      await query(`
        ALTER TABLE posts 
        ADD COLUMN user_id INTEGER,
        ADD CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id)
      `);
      console.log("user_id column added to posts table");
    }

  } catch (error) {
    console.error(error);
  }
};
