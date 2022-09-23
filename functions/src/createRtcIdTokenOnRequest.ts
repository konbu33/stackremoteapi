import * as dotenv from "dotenv";
dotenv.config();

import * as functions from "firebase-functions";

import { verifyFirebaseAuthIdTokenOnRequest } from "./lib/verifyFirebaseAuthIdTokenOnRequest";
import { ValidateRequestData } from "./lib/validateRequestData";
import { ResponseData, ResponseDataState } from "./lib/responseData";
import { createToken } from "./lib/createToken";
import { createRequestDataObject, RequestData } from "./lib/requestData";
import { Result } from "./lib/result";

export const createRtcIdTokenOnRequest = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info(
      "start : createRtcIdToken -------------------------------------------------- ",
      { structuredData: true }
    );

    let code: number;

    // --------------------------------------------------
    //
    // Requestデータのオブジェクト生成
    //
    // --------------------------------------------------
    const requestDataResult: Result<string> = createRequestDataObject(request);

    code = requestDataResult.code;
    if (code === 500) {
      response.status(code);
      response.json(requestDataResult);

      console.log("requestDataResult: ", requestDataResult);
      return;
    }

    const requestData: RequestData = JSON.parse(requestDataResult.data);
    functions.logger.info("end : createRequestDataObject", {
      structuredData: true,
    });

    // --------------------------------------------------
    //
    // Firebase Authentication で認証状況確認
    //
    // --------------------------------------------------
    const firebaseAuthIdToken: string = requestData.firebaseAuthIdToken;
    const verifyFirebaseAuthIdTokenResult: Result<string> =
      await verifyFirebaseAuthIdTokenOnRequest(firebaseAuthIdToken);
    const verifyFirebaseAuthUid: string = JSON.parse(
      verifyFirebaseAuthIdTokenResult.data
    ).uid;

    code = verifyFirebaseAuthIdTokenResult.code;
    if (code === 500) {
      response.status(code);
      response.json(verifyFirebaseAuthIdTokenResult);

      console.log(
        "verifyFirebaseAuthIdTokenResult : ",
        verifyFirebaseAuthIdTokenResult
      );
      return;
    }

    functions.logger.info("end : verifyFirebaseAuthIdToken", {
      structuredData: true,
    });

    // --------------------------------------------------
    //
    // Requestのデータのバリデーション
    //
    // --------------------------------------------------

    // channelName 検証
    const validateResultChannelNameResult: Result<string> =
      ValidateRequestData.validateChannelName(requestData);
    const channelName = validateResultChannelNameResult.data;

    code = validateResultChannelNameResult.code;
    if (code === 500) {
      response.status(code);
      response.json(validateResultChannelNameResult);

      console.log(
        "validateResultChannelNameResult : ",
        validateResultChannelNameResult
      );
      return;
    }

    functions.logger.info("end : validateChannelName", {
      structuredData: true,
    });

    // uid 検証
    const validateResultUidResult: Result<number> =
      ValidateRequestData.validateUid(requestData);
    const uid = validateResultUidResult.data;

    code = validateResultUidResult.code;
    if (code === 500) {
      response.status(code);
      response.json(validateResultUidResult);

      console.log("validateResultUidResult : ", validateResultUidResult);
      return;
    }

    functions.logger.info("end : validateUid", { structuredData: true });

    // role 検証
    const validateResultRoleResult: Result<number> =
      ValidateRequestData.validateRole(requestData);
    const role = validateResultRoleResult.data;

    functions.logger.info("end : validateRole", { structuredData: true });

    // privilegeExpireTime 検証
    const validateResultPrivilegeExpireTimeResult: Result<number> =
      ValidateRequestData.validatePrivilegeExpireTime(requestData);
    const privilegeExpireTime = validateResultPrivilegeExpireTimeResult.data;

    functions.logger.info("end : validatePrivilegeExpireTime", {
      structuredData: true,
    });
    // --------------------------------------------------
    //
    // Responseデータのオブジェクト生成
    //
    // --------------------------------------------------

    // requestのbodyに含まれている想定のjsonを基に、RtcIdTokenを生成する情情をまとめたデータインスタンス生成
    const responseDataObject: ResponseData = {
      channelName: channelName,
      uid: uid,
      account: requestData.account,
      rtcIdTokenType: requestData.rtcIdTokenType,
      role: role,
      privilegeExpireTime: privilegeExpireTime,
      firebaseAuthIdToken: firebaseAuthIdToken,
      verifyFirebaseAuthUid: verifyFirebaseAuthUid,
      rtcIdToken: "undefined",
    };

    const responseDataState: ResponseDataState = new ResponseDataState(
      responseDataObject
    );

    // Token生成し、ResponseDataへ追加
    const rtcIdTokenResult: Result<string> = createToken(responseDataObject);
    const rtcIdToken: string = rtcIdTokenResult.data;
    responseDataState.setRtcIdToken(rtcIdToken);

    code = rtcIdTokenResult.code;
    if (code === 500) {
      response.status(code);
      response.json(rtcIdTokenResult);

      console.log("rtcIdTokenResult : ", rtcIdTokenResult);
      return;
    }

    functions.logger.info("end : responseData and createToken", {
      structuredData: true,
    });

    // --------------------------------------------------
    //
    // Responseデータ応答
    //
    // --------------------------------------------------
    const responseData: ResponseData = responseDataState.state;
    response.status(200);
    response.json({ data: JSON.stringify(responseData) });

    functions.logger.info("end : responseData ", { structuredData: true });
    functions.logger.info(
      "end : createRtcIdToken -------------------------------------------------- ",
      { structuredData: true }
    );

    console.log("responseData : ", responseData);
    return;
  }
);
