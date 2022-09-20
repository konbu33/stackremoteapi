import * as functions from "firebase-functions";
import { Result } from "./lib/result";
import { verifyFirebaseAuthIdTokenOnRequest} from "./lib/verifyFirebaseAuthIdTokenOnRequest";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("helloWorld logs!", {structuredData: true});
  response.status(200);
  response.send({ name: "Hello world" });
});

export const helloWorldSecureOnRequest = functions.https.onRequest(async (request, response) => {
  functions.logger.info("helloWorldSecure logs start -------------------------------------------------- ", {structuredData: true});
  
  // Firebase Authentication で認証状況確認
  const firebaseAuthIdToken: string = String(request.query.token);
  const verifyFirebaseAuthIdTokenResult: Result<string> = await verifyFirebaseAuthIdTokenOnRequest(firebaseAuthIdToken);

  functions.logger.info(verifyFirebaseAuthIdTokenResult , {structuredData: true});

  const code = verifyFirebaseAuthIdTokenResult.code;
  if (code === 500) {
    response.status(code);
    response.json({
      name: "Hello World Secure",
      data: JSON.stringify(verifyFirebaseAuthIdTokenResult),
    });
    return; 
  }

  response.status(200);
  response.json({
    name: "Hello World Secure",
    data: JSON.stringify(verifyFirebaseAuthIdTokenResult),
  });

  functions.logger.info("helloWorldSecure logs end -------------------------------------------------- ", {structuredData: true});
});

export const helloWorldSecureOnCall = functions.https.onCall(async (data, context) => {
  functions.logger.info("helloWorldSecureOnCall logs start -------------------------------------------------- ", {structuredData: true});
  
  // Firebase Authentication で認証状況確認
  let result;
  if (context.auth) {
    result = { data: { ...data, id: data.id + 1 }, context: { ...context, auth: !context.auth }, message: "auth success" };
  } else {
    result = { data: { ...data, id: data.id - 1 }, context: { ...context, auth: !context.auth }, message: "auth fail" };
  };
  
  functions.logger.info('helloWorldSecureOnCall auth end', {structuredData: true});

  return result;

  functions.logger.info("helloWorldSecureOnCall logs end -------------------------------------------------- ", {structuredData: true});
});


