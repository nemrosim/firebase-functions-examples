import * as functions from 'firebase-functions';
import { Request, Response, RuntimeOptions } from 'firebase-functions'
import * as admin from "firebase-admin";

const runtimeOpts: RuntimeOptions = {
    timeoutSeconds: 60, // Timeout for the function in seconds, possible values are 0 to 540.
    memory: '128MB' // VALID_MEMORY_OPTIONS: ["128MB", "256MB", "512MB", "1GB", "2GB"];
}

export const getUserByUID = functions.runWith(runtimeOpts).https
    .onRequest(async (request: Request, response: Response) => {
        try {
            const {uid} = request.body;

            if (!uid) {
                response.status(400).send({
                    error: 'No user id provided'
                });
                return;
            }

            const userRecord = await admin
                .auth()
                .getUser(uid);

            response.status(200).send({
                userRecord
            });
        } catch (e) {
            response.status(400).send(e);
        }
    });
