import { Request } from 'firebase-functions';
import { Result } from './result';

export type RequestData = {
  channelName: string,
  localUid: number,
  account: string,
  rtcIdTokenType: string,
  role: string,
  privilegeExpireTime: number,
  firebaseAuthIdToken: string,
};

// requestデータからオブジェクト生成　
export function createRequestDataObject(request: Request) : Result<string>{
   
  let jsonDataObject;

  try {
    jsonDataObject = JSON.parse(request.body);
    if (Object.keys(jsonDataObject).length === 0) throw Error("invalid request data");

  } catch (e) {
    const result: Result<string> = {
      code: 500,
      message: String(e),
      data: "",
    }
    return result;
  }

  const requestDataObject: RequestData = {
    channelName: jsonDataObject.channelName,
    localUid: jsonDataObject.localUid,
    account: jsonDataObject.account,
    rtcIdTokenType: jsonDataObject.rtcIdTokenType,
    role: jsonDataObject.role,
    privilegeExpireTime: jsonDataObject.privilegeExpireTime,
    firebaseAuthIdToken: jsonDataObject.firebaseAuthIdToken,
  };
  

  const result: Result<string> = {
    code: 200,
    message: "request data is no problem",
    data: JSON.stringify(requestDataObject),
  };

  return result;

};
