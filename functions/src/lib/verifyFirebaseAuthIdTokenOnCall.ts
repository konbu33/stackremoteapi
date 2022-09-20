import * as functions from 'firebase-functions';
import { Result } from './result';

export async function verifyFirebaseAuthIdTokenOnCall( context: functions.https.CallableContext ) {

  try {
    if (!context.auth) throw Error("not authenticated");

  } catch (e) {
    const result: Result<string> = {
      code: 500,
      message: String(e),
      data: JSON.stringify({ "uid" : "", "firebaseAuthIdToken": "" }),
    };

    return result;
  }

  const result: Result<string> = { 
    code: 200,
    message: "firebase authentication id token verify success.",
    data: JSON.stringify({ "uid" : context.auth.token.uid, "firebaseAuthIdToken": context.auth.token}),
  };

  return result;

}

