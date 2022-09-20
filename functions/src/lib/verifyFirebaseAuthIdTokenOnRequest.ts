import * as admin from 'firebase-admin';
import * as authAdmin from 'firebase-admin/auth';
import { Result } from './result';

export async function verifyFirebaseAuthIdTokenOnRequest(firebaseAuthIdToken: string) {
    
  // firebase authentication admin インスタンス初期化
  if (admin.apps.length === 0) {
    admin.initializeApp();
  }

  // firebase authentication id token 検証
  try {
    const decodedToken = await authAdmin
      .getAuth()
      .verifyIdToken(firebaseAuthIdToken);

    const uid = decodedToken.uid;

    const result: Result<string> = { 
      code: 200,
      message: "firebase authentication id token verify success.",
      data: JSON.stringify({ "uid" : uid, "firebaseAuthIdToken" : firebaseAuthIdToken}),
    };

    return result;

  } catch(error) {

    const result: Result<string> = {
      code: 500,
      message: String(error),
      data: JSON.stringify({ "uid" : "", "firebaseAuthIdToken" : firebaseAuthIdToken}),
    };

    return result;

  };
}

