import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { signInAndUp } from "supertokens-web-js/recipe/thirdparty";

async function handleCallback() {
  try {
    const response = await signInAndUp();

    if (response.status === "OK") {
      console.log(response.user);
      if (
        response.createdNewRecipeUser &&
        response.user.loginMethods.length === 1
      ) {
        // sign up successful
      } else {
        // sign in successful
      }
      // window.location.assign("/home");
    } else if (response.status === "SIGN_IN_UP_NOT_ALLOWED") {
      // the reason string is a user friendly message
      // about what went wrong. It can also contain a support code which users
      // can tell you so you know why their sign in / up was not allowed.
      window.alert(response.reason);
    } else {
      // SuperTokens requires that the third party provider
      // gives an email for the user. If that's not the case, sign up / in
      // will fail.

      // As a hack to solve this, you can override the backend functions to create a fake email for the user.

      window.alert(
        "No email provided by social login. Please use another form of login",
      );
      // window.location.assign("/auth"); // redirect back to login page
    }
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      // this may be a custom error message sent from the API by you.
      window.alert(err.message);
    } else {
      console.log(err);
      window.alert("Oops! Something went wrong.");
    }
  }
}

const AuthCallback: React.FC = () => {
  const { provider } = useParams();
  
  useEffect(() => {
    console.log("Handling auth callback", { provider });
    handleCallback();
  }, []);

  return null;
};

export default observer(AuthCallback);