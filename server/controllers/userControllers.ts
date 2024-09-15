import { Request, Response } from 'express';
import { query } from  '../utils/db';
import { createUserTable } from '../helpers/create-user-table';
import { uploadFile } from '../helpers/upload-file';

interface User {
    id: number;
    fullname: string;
    image: string | null;
    token_id: number | null;
    username: string;
    email: string;
    date: string;
    terms: boolean;
}



export const saveUser = async (req: Request, res: Response) => {
    try {
        await createUserTable();
        let imageUrl = null;

        const { fullname, username, email, password, terms } = req.body;
        if (req.file) {
            console.log('Received file:', req.file.originalname, req.file.mimetype, req.file.size);
            try {
                imageUrl = await uploadFile(req.file);
                console.log('File uploaded successfully:', imageUrl);
            } catch (error) {
                console.error(error);
            }
        }

        const selectedUser = await query('SELECT * FROM users WHERE email = $1', [email]);
        const selectedUsername = await query('SELECT * FROM users WHERE username = $1', [username]);
        if (selectedUser.rowCount !== 0 || selectedUsername.rowCount !== 0) {
            return res.status(400).json({ error: 'Bu kullanıcı adı ya da e-posta adresi zaten kayıtlı.'});
        }

        const hashedPassword = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
        const passwordHash = Array.from(new Uint8Array(hashedPassword));
        const passwordHashString = passwordHash.join(',');

        console.log('Hashed password:', passwordHash, hashedPassword);

        const result = await query(
            'INSERT INTO users (fullname, username, email, password, terms) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [fullname, username, email, passwordHashString, terms]
        );
        const newUser: User = result.rows[0];
        console.log('User created:', newUser);
        res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi', 'success': true });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}