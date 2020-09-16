import { CallableContext } from "firebase-functions/lib/providers/https";

const functions = require('firebase-functions');

export const firstOnRequest = functions.https
    .onRequest((request: Request, response: Response) => {
        console.log('Request method', request.method)
    });

export const firstOnCall = functions.https
    .onCall((data: any, context: CallableContext) => {
        console.log('Handler', data)
    });
