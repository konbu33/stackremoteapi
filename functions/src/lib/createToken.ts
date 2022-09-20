import { RtcTokenBuilder } from "agora-access-token";
import { ResponseData } from "./responseData";
import { Result } from "./result";

// RTC ID Token 生成
export function createToken(responseData: ResponseData) : Result<string> {

  let result: Result<string>;

  try {
    if (process.env.APP_ID === undefined) throw ReferenceError("APP_ID undefined");
    if (process.env.APP_CERTIFICATE === undefined) throw ReferenceError("APP_CERTIFICATE undefined");
  } catch (e) {
    result = {
      code: 500,
      message: String(e),
      data: "",
    };

    return result;
  };

  const APP_ID: string = process.env.APP_ID;
  const APP_CERTIFICATE: string = process.env.APP_CERTIFICATE;

  let rtcIdToken: string = "";

  switch (responseData.rtcIdTokenType) {
    case 'userAccount':
      rtcIdToken = RtcTokenBuilder.buildTokenWithAccount(
        APP_ID,
        APP_CERTIFICATE,
        responseData.channelName,
        responseData.account,
        responseData.role,
        responseData.privilegeExpireTime,
      );
      
      break;

    case 'uid':
      rtcIdToken = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        responseData.channelName,
        responseData.uid,
        responseData.role,
        responseData.privilegeExpireTime,
      );

      break;
    
    default:
    
      result = {
        code: 500,
        message: 'token type is invalid',
        data: rtcIdToken,
      };
      return result;

  }

  result = {
    code: 200,
    message: 'token type : ' + responseData.rtcIdTokenType + ' is no problem',
    data: rtcIdToken,
   
  };


  return result;
};