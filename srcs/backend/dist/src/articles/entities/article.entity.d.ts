import { Article } from '@prisma/client';
export declare class ArticleEntity implements Article {
    id: number;
    title: string;
    description: string | null;
    body: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}
