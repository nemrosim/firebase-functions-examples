import { Request, Response } from 'firebase-functions'
import * as admin from "firebase-admin";

enum AuthErrorCodes {
    TOKEN_NULL,
    DECODE_TOKEN_ERROR,
    NO_DECODED_UID,
    NO_DECODED_EMAIL,
}

interface ResponseProps {
    uid: string;
    email?: string;
}

export const verifyAndDecodeToken = (request: Request, response: Response): Promise<ResponseProps> => {
    return new Promise(async (resolve, reject) => {

            // ONLY FOR TEST CASES, NOT FOR PRODUCTION
            if (request.headers.authorization === 'some-test-value') {
                resolve({
                    uid: 'emK2v8EQkFd74PHwcxDJekTbZro2',
                    email: 'nemrosim1988@gmail.com'
                })
            }

            try {

                let token = request.headers.authorization;

                // if token is not present in the request
                if (!token) {
                    response.status(401).send({
                        code: AuthErrorCodes.TOKEN_NULL,
                        message: 'Auth token is not present in the request'
                    })
                }

                // If token is present
                if (token) {

                    token = token.replace('Bearer ', '');

                    // verify and decode token using adminSDK
                    const decodedToken = await admin.auth().verifyIdToken(token);

                    // Example of 'decodedToken' returning object
                    // @ts-ignore
                    const decodedToken_example = {
                        iss: 'https://securetoken.google.com/app-name...',
                        aud: 'app-name-...',
                        auth_time: 1572513404,
                        user_id: '...id...',
                        sub: '...id...',
                        iat: 1572513405,
                        exp: 1572517005,
                        email: 'user@email.com',
                        email_verified: false,
                        firebase: {identities: {email: [Array]}, sign_in_provider: 'password'},
                        uid: '...id...'
                    };

                    // if token not verified and not decoded
                    if (!decodedToken) {
                        response.status(401).send({
                            code: AuthErrorCodes.DECODE_TOKEN_ERROR,
                            message: 'Could not decode provided token'
                        })
                    }

                    // if token not verified and not decoded
                    if (!decodedToken.uid) {
                        response.status(401).send({
                            code: AuthErrorCodes.NO_DECODED_UID,
                            message: 'UID is not present in verified token'
                        })
                    }

                    // if token not verified and not decoded
                    if (!decodedToken.email) {
                        response.status(401).send({
                            code: AuthErrorCodes.NO_DECODED_EMAIL,
                            message: 'Email is not present in verified token'
                        })
                    }

                    resolve({
                        uid: decodedToken.uid,
                        email: decodedToken.email
                    });

                }
            } catch (e) {
                reject(e);
            }
        }
    )
}
