import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import { verifyAndDecodeToken } from "./verifyAndDecodeToken";

export const deleteDocument = functions.https
    .onRequest(async (request, response) => {

        const uidAndEmail = await verifyAndDecodeToken(request, response);

        const result = await admin
            .firestore()
            .collection('delete')
            .doc(uidAndEmail.uid)
            .delete();

        response.status(200).send(result);
    });
