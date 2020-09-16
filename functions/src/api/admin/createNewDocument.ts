import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

export const createNewDocument = functions.https
    .onRequest(async (request, response) => {

        const result = await admin
            .firestore()
            .collection('delete')
            .doc('emK2v8EQkFd74PHwcxDJekTbZro2')
            .set({value: 'some value'});

        response.status(200).send(result);
    });
