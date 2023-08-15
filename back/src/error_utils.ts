import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

const errorTemplate = (error: string, status: number) => {
    throw new HttpException({
        status,
        error
    }, status);
}

export namespace error {
    export const notFound = (error: string) => errorTemplate(error, HttpStatus.NOT_FOUND);
    export const hasConflict = (error: string) => errorTemplate(error, HttpStatus.NOT_FOUND);
}