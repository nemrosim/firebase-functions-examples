import * as triggers from "./triggers";
import * as api from "./api";
import * as admin from "firebase-admin";

require('dotenv').config();

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.CLIENT_EMAIL,
    }),
    databaseURL: process.env.DATABASE_URL
});

module.exports = {
    app: {
        admin: {
            createNewDocument: api.createNewDocument,
            deleteDocument: api.deleteDocument,
            auth : {
                createCustomToken: api.createCustomToken,
                createProviderConfig: api.createProviderConfig,
                createSessionCookie: api.createSessionCookie,
                getUserByEmail: api.getUserByEmail,
                getUserByUID: api.getUserByUID,
            },
        },
        v1: {
            firstFunction: api.firstFunction,
        },
    },
    triggers: {
        firstOnRequest: triggers.firstOnRequest,
        firstOnCall: triggers.firstOnCall
    }
}
