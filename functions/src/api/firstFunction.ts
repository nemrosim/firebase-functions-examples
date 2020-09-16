import * as functions from 'firebase-functions';

export const firstFunction = functions.https
    .onRequest((request, response) => {
        functions.logger.info("Hello logs!", {structuredData: true});
        response.send("Hello from Firebase!");
    });
