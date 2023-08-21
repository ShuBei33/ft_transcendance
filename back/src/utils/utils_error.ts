import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

const errorTemplate = (error: string, status: number) => {
    throw new HttpException({
        status,
        error
    }, status);
}

export namespace error {
    export const notFound = (error: string) => errorTemplate(error, HttpStatus.NOT_FOUND);
    export const notAuthorized = (error: string) => errorTemplate(error, HttpStatus.FORBIDDEN);
    export const hasConflict = (error: string) => errorTemplate(error, HttpStatus.CONFLICT);
    export const unexpected = (error: string) => errorTemplate(error, HttpStatus.I_AM_A_TEAPOT);
}