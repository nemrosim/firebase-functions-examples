import * as functions from 'firebase-functions';
import { Request, Response } from 'firebase-functions'
import * as admin from "firebase-admin";

export const createCustomToken = functions.https
    .onRequest(async (request: Request, response: Response) => {

        try {

            if (request.method !== "POST") {
                response.status(400).send({
                    error: 'Not POST method'
                });
                return;
            }

            const {userId} = request.body;

            if (!userId) {
                response.status(400).send({
                    error: 'No user id provided'
                });
                return;
            }

            /**
             * Result: "eyJhbGciO..."
             */
            const result = await admin
                .auth()
                .createCustomToken(userId);

            response.status(200).send({
                token: result
            });
        } catch (e) {
            response.status(400
            ).send(e)
        }
    });
