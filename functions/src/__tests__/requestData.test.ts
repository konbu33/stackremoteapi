import { Request } from "firebase-functions";
import { mockReq } from "sinon-express-mock";

import { createRequestDataObject, RequestData } from "../lib/requestData";
import { Result } from "../lib/result";

describe("requestData", () => {
  test("500 : ERROR : createRequestDataObject", () => {
    // Given
    const body = {
      // channelName: "channel001",
      // localUid: 1,
      // account: "account001",
      // rtcIdTokenType: "uid",
      // role: "publisher",
      // privilegeExpireTime: 4000,
    };

    const request = { body: JSON.stringify(body) };
    const req: Request = mockReq(request);

    // When
    const result: Result<string> = createRequestDataObject(req);
    // const requestData: RequestData = JSON.parse(result.data);
    console.log("request data : ", result);

    // Then
    expect(result.code).toEqual(500);
    expect(result.message).toContain("invalid");
    expect(result.data).toContain("");
    // expect(requestData).toContain("");
  });

  test("200 : OK : createRequestDataObject", () => {
    // Given
    const body = {
      channelName: "channel001",
      localUid: 1,
      account: "account001",
      rtcIdTokenType: "uid",
      role: "publisher",
      privilegeExpireTime: 4000,
    };

    const request = { body: JSON.stringify(body) };
    const req: Request = mockReq(request);

    // When
    const result: Result<string> = createRequestDataObject(req);
    const requestData: RequestData = JSON.parse(result.data);
    console.log("request data : ", result);

    // Then
    expect(result.code).toEqual(200);
    expect(result.message).toContain("no problem");

    expect(requestData.channelName).toEqual(body.channelName);
    expect(requestData.localUid).toEqual(body.localUid);
    expect(requestData.account).toEqual(body.account);
    expect(requestData.rtcIdTokenType).toEqual(body.rtcIdTokenType);
    expect(requestData.role).toEqual(body.role);
    expect(requestData.privilegeExpireTime).toEqual(body.privilegeExpireTime);
  });
});
