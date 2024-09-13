import { Request, Response } from 'express';

const POSTS = [
    {
        id: 1,
        title: 'Hello World',
        content: 'This is my first post'
    },
    {
        id: 2,
        title: 'Hello World 2',
        content: 'This is my second post'
    },
    {
        id: 3,
        title: 'Hello World 3',
        content: 'This is my third post'
    },
    {
        id: 4,
        title: 'Hello World 4',
        content: 'This is my fourth post'
    }
];


export const getPosts = (req: Request, res: Response) => {
    res.status(200).json({ message: POSTS });
};

// module.exports = { getPosts };