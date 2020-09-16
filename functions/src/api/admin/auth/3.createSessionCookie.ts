import * as functions from 'firebase-functions';
import { Request, Response, RuntimeOptions } from 'firebase-functions'
import * as admin from "firebase-admin";

const runtimeOpts: RuntimeOptions = {
    timeoutSeconds: 1, // Timeout for the function in seconds, possible values are 0 to 540.
    memory: '1GB' // VALID_MEMORY_OPTIONS: ["128MB", "256MB", "512MB", "1GB", "2GB"];
}

/**
 * Creates a new Firebase session cookie with the specified options. The created
 * JWT string can be set as a server-side session cookie with a custom cookie
 * policy, and be used for session management. The session cookie JWT will have
 * the same payload claims as the provided ID token.
 */
export const createSessionCookie = functions.runWith(runtimeOpts).https
    .onRequest(async (request: Request, response: Response) => {
        try {
            /**
             * The Firebase ID token to exchange for a session cookie.
             */
            const {idToken} = request.body;

            if (!idToken) {
                response.status(400).send({
                    error: 'No user id provided'
                });
                return;
            }

            // verify ID token:
            const isVerified = await admin.auth().verifyIdToken(idToken);

            console.log('isVerified', isVerified)

            console.log('ID TOKEN', idToken)

            const sessionCookieOptions = {
                /**
                 * The session cookie custom expiration in milliseconds. The minimum allowed is
                 * 5 minutes and the maxium allowed is 2 weeks.
                 */
                expiresIn: 6000 * 60 * 5, // 1 minute
            } as admin.auth.SessionCookieOptions;

            const createdSessionCookie = await admin
                .auth()
                .createSessionCookie(idToken, sessionCookieOptions);

            response.status(200).send({
                cookie: createdSessionCookie
            });
        } catch (e) {
            response.status(400).send(e);
        }
    });
