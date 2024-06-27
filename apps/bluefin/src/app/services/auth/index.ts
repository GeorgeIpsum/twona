import supertokens from "supertokens-node";
import Dashboard from "supertokens-node/recipe/dashboard";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import ThirdParty from "supertokens-node/recipe/thirdparty";

import db from "../db";

export const initAuth = () => {
  supertokens.init({
    framework: "express",
    supertokens: {
      connectionURI: "http://localhost:3567",
      // apiKey: <API_KEY(if configured)>,
    },
    appInfo: {
      // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
      appName: "Twona",
      apiDomain: "http://localhost:3000",
      websiteDomain: "http://localhost:3",
      apiBasePath: "/auth",
      websiteBasePath: "/",
    },
    recipeList: [
      EmailPassword.init({
        emailDelivery: {},
      }),
      ThirdParty.init({
        signInAndUpFeature: {
          providers: [
            {
              config: {
                thirdPartyId: "google",
                clients: [
                  {
                    clientId:
                      "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                    clientSecret: "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",
                  },
                ],
              },
            },
            {
              config: {
                thirdPartyId: "github",
                clients: [
                  {
                    clientId: "467101b197249757c71f",
                    clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
                  },
                ],
              },
            },
            {
              config: {
                thirdPartyId: "apple",
                clients: [
                  {
                    clientId: "4398792-io.supertokens.example.service",
                    additionalConfig: {
                      keyId: "7M48Y4RYDL",
                      privateKey:
                        "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                      teamId: "YWQCXGJRJL",
                    },
                  },
                ],
              },
            },
            {
              config: {
                name: "Discord",
                thirdPartyId: "discord",
                clients: [
                  {
                    clientId: "",
                    clientSecret: "",
                  },
                ],
              },
            },
            {
              config: {
                name: "Twitch",
                thirdPartyId: "twitch",
              },
            },
            {
              config: {
                name: "Spotify",
                thirdPartyId: "spotify",
              },
            },
          ],
        },
      }),
      Session.init({}), // initializes session features
      Dashboard.init({
        admins: ["georgeipsum@gmail.com"],
      }),
    ],
    telemetry: false,
  });
};
