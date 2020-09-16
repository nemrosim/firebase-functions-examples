import * as functions from 'firebase-functions';
import { Request, Response, RuntimeOptions } from 'firebase-functions'
import * as admin from "firebase-admin";

const runtimeOpts: RuntimeOptions = {
    timeoutSeconds: 60, // Timeout for the function in seconds, possible values are 0 to 540.
    memory: '128MB' // VALID_MEMORY_OPTIONS: ["128MB", "256MB", "512MB", "1GB", "2GB"];
}

export const getUserByEmail = functions.runWith(runtimeOpts).https
    .onRequest(async (request: Request, response: Response) => {
        try {

            const {email} = request.body;

            const userRecord = await admin
                .auth()
                .getUserByEmail(email);

            response.status(200).send({
                userRecord
            });
        } catch (e) {
            response.status(400).send(e);
        }
    });
