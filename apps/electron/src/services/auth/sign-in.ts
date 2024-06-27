import { getAuthorisationURLWithQueryParamsAndSetState } from "supertokens-web-js/recipe/thirdparty";

export async function signIn(provider: string) {
  try {
    const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
      thirdPartyId: provider,

      // This is where Google should redirect the user back after login or error.
      // This URL goes on the Google's dashboard as well.
      frontendRedirectURI: `http://localhost:3000/auth/callback/${provider}`,
    });
    window.open(authUrl);
  } catch (e: any) {
    if (e.isSuperTokensGeneralError) {
      window.alert(e.message);
    } else {
      console.log(e);
    }
  }
}

export async function googleSignInClicked() {
  try {
    const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
      thirdPartyId: "google",

      // This is where Google should redirect the user back after login or error.
      // This URL goes on the Google's dashboard as well.
      frontendRedirectURI: "http://localhost:3000/auth/callback/google",
    });

    /*
        Example value of authUrl: https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&client_id=1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com&state=5a489996a28cafc83ddff&redirect_uri=https%3A%2F%2Fsupertokens.io%2Fdev%2Foauth%2Fredirect-to-app&flowName=GeneralOAuthFlow
        */

    // we redirect the user to google for auth.
    window.open(authUrl);
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
