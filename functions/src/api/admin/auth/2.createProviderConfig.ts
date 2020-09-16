import * as functions from 'firebase-functions';
import { Request, Response } from 'firebase-functions'
import * as admin from "firebase-admin";

/**
 * ???
 */
export const createProviderConfig = functions.https
    .onRequest(async (request: Request, response: Response) => {
        try {
            if (request.method !== "POST") {
                response.status(400).send({
                    error: 'Not POST method'
                });
                return;
            }

            const {providerId, displayName, isEnabled} = request.body;

            const authProviderConfig = {
                /**
                 * The provider ID defined by the developer.
                 * For a SAML provider, this is always prefixed by `saml.`.
                 * For an OIDC provider, this is always prefixed by `oidc.`.
                 *
                 * Possible values:
                 * EmailAuthProviderID: password
                 * PhoneAuthProviderID: phone
                 * GoogleAuthProviderID: google.com
                 * FacebookAuthProviderID: facebook.com
                 * TwitterAuthProviderID: twitter.com
                 * GitHubAuthProviderID: github.com
                 * AppleAuthProviderID: apple.com
                 * YahooAuthProviderID: yahoo.com
                 * MicrosoftAuthProviderID: hotmail.com
                 */
                providerId, // examples: google.com

                /**
                 * The user-friendly display name to the current configuration. This name is
                 * also used as the provider label in the Cloud Console.
                 */
                displayName,

                /**
                 * Whether the provider configuration is enabled or disabled. A user
                 * cannot sign in using a disabled provider.
                 */
                enabled: isEnabled,
            } as admin.auth.AuthProviderConfig;

            console.log(authProviderConfig)

            const result = await admin
                .auth()
                .createProviderConfig(authProviderConfig);

            response.status(200).send({
                token: result
            });
        } catch (e) {
            response.status(400).send(e);
        }
    });
