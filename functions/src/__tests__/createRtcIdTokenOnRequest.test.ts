import { Request, Response } from "firebase-functions";
import { mockReq, mockRes } from "sinon-express-mock";

import { verifyFirebaseAuthIdTokenOnRequest } from "../lib/verifyFirebaseAuthIdTokenOnRequest";
jest.mock("../lib/verifyFirebaseAuthIdTokenOnRequest");

import { ValidateRequestData } from "../lib/validateRequestData";
// jest.mock('../lib/validateRequestData');
jest.spyOn(ValidateRequestData, "validateChannelName");
jest.spyOn(ValidateRequestData, "validateUid");

import * as createToken from "../lib/createToken";
jest.spyOn(createToken, "createToken");

import "./customMatchers";

import { createRtcIdTokenOnRequest } from "../createRtcIdTokenOnRequest";
import { Result } from "../lib/result";
import * as requestData from "../lib/requestData";
jest.spyOn(requestData, "createRequestDataObject");

let dummyUid: string;
let dummyFirebaseAuthIdToken: string;
let verifyFirebaseAuthIdTokenResult: Result<string>;
let body: {
  channelName: string;
  account: string;
  privilegeExpireTime: number;
  rtcIdTokenType: string;
  role: string;
  localUid: number;
  firebaseAuthIdToken: string;
};

beforeEach(() => {
  dummyUid = "dummyUid";

  dummyFirebaseAuthIdToken = "dummyFirebaseAuthIdToken ";

  verifyFirebaseAuthIdTokenResult = {
    code: 200,
    message: "SUCCESS: verifyFirebaseAuthIdToken",
    data: JSON.stringify({
      uid: dummyUid,
      firebaseAuthIdToken: dummyFirebaseAuthIdToken,
    }),
  };

  body = {
    channelName: "channelName001",
    account: "account001",
    privilegeExpireTime: 3600,
    rtcIdTokenType: "uid",
    //   rtcIdTokenType: "userAccount",
    //   rtcIdTokenType: "other",
    role: "publisher",
    //   role: "audience",
    //   role: "other",
    localUid: 1,
    firebaseAuthIdToken: "dummyFirebaseAuthIdToken",
  };
});
describe("createRtcIdToken", () => {
  test("500 ERROR : createRequestDataObject", async () => {
    // Given
    const createRequestDataObjectResult: Result<string> = {
      code: 500,
      message: "ERROR : createRequestDataObject",
      data: "",
    };

    (requestData.createRequestDataObject as jest.Mock).mockImplementationOnce(
      () => {
        return createRequestDataObjectResult;
      }
    );

    const request = {
      body: JSON.stringify(body),
    };

    // Then
    const response = {
      status: (code: number) => {
        expect(code).toEqual(500);
      },
      json: (json: Result<string>) => {
        expect(json.code).toEqual(createRequestDataObjectResult.code);
        expect(json.message).toEqual(createRequestDataObjectResult.message);
        expect(json.data).toEqual(createRequestDataObjectResult.data);
      },
    };

    const req: Request = mockReq(request);
    const res: Response = mockRes(response);

    // When
    await createRtcIdTokenOnRequest(req, res);
  });

  test("500 ERROR : verifyFirebaseAuthIdToken", async () => {
    // Given
    verifyFirebaseAuthIdTokenResult = {
      code: 500,
      message: "ERROR : verifyFirebaseAuthIdToken",
      data: JSON.stringify({
        uid: dummyUid,
        firebaseAuthIdToken: dummyFirebaseAuthIdToken,
      }),
    };

    (verifyFirebaseAuthIdTokenOnRequest as jest.Mock).mockImplementationOnce(
      () => {
        return verifyFirebaseAuthIdTokenResult;
      }
    );

    const request = {
      body: JSON.stringify(body),
    };

    // Then
    const response = {
      status: (code: number) => {
        expect(code).toEqual(500);
      },
      json: (json: Result<string>) => {
        expect(json.code).toEqual(verifyFirebaseAuthIdTokenResult.code);
        expect(json.message).toEqual(verifyFirebaseAuthIdTokenResult.message);
        expect(JSON.parse(json.data).uid).toEqual(
          JSON.parse(verifyFirebaseAuthIdTokenResult.data).uid
        );
        expect(JSON.parse(json.data).firebaseAuthIdToken).toEqual(
          JSON.parse(verifyFirebaseAuthIdTokenResult.data).firebaseAuthIdToken
        );
      },
    };

    const req: Request = mockReq(request);
    const res: Response = mockRes(response);

    // When
    await createRtcIdTokenOnRequest(req, res);
  });

  test("500 ERROR : validateResultChannelName", async () => {
    // Given

    (verifyFirebaseAuthIdTokenOnRequest as jest.Mock).mockImplementationOnce(
      () => {
        return verifyFirebaseAuthIdTokenResult;
      }
    );

    const dummyChannelName = "dummyChannelName";
    const validateChannelNameResult = {
      code: 500,
      message: "ERROR : validateChannelName",
      data: dummyChannelName,
    };

    (
      ValidateRequestData.validateChannelName as jest.Mock
    ).mockImplementationOnce(() => {
      return validateChannelNameResult;
    });

    const request = {
      body: JSON.stringify(body),
    };

    // Then
    const response = {
      status: (code: number) => {
        expect(code).toEqual(500);
      },
      json: (json: Result<string>) => {
        expect(json.code).toEqual(validateChannelNameResult.code);
        expect(json.message).toEqual(validateChannelNameResult.message);
        expect(json.data).toEqual(validateChannelNameResult.data);
      },
    };

    const req: Request = mockReq(request);
    const res: Response = mockRes(response);

    // When
    await createRtcIdTokenOnRequest(req, res);
  });

  test("500 ERROR : validateUid", async () => {
    // Given

    (verifyFirebaseAuthIdTokenOnRequest as jest.Mock).mockImplementationOnce(
      () => {
        return verifyFirebaseAuthIdTokenResult;
      }
    );

    const dummyUid = 99;
    const validateUidResult = {
      code: 500,
      message: "ERROR : validateUid",
      data: dummyUid,
    };

    (ValidateRequestData.validateUid as jest.Mock).mockImplementationOnce(
      () => {
        return validateUidResult;
      }
    );

    const request = {
      body: JSON.stringify(body),
    };

    // Then
    const response = {
      status: (code: number) => {
        expect(code).toEqual(500);
      },
      json: (json: Result<number>) => {
        expect(json.code).toEqual(validateUidResult.code);
        expect(json.message).toEqual(validateUidResult.message);
        expect(json.data).toEqual(validateUidResult.data);
      },
    };

    const req: Request = mockReq(request);
    const res: Response = mockRes(response);

    // When
    await createRtcIdTokenOnRequest(req, res);
  });

  test("500 ERROR : createToken", async () => {
    // Given

    (verifyFirebaseAuthIdTokenOnRequest as jest.Mock).mockImplementationOnce(
      () => {
        return verifyFirebaseAuthIdTokenResult;
      }
    );

    const dummyToken = "dummyToken";
    const createTokenResult = {
      code: 500,
      message: "ERROR : createToken",
      data: dummyToken,
    };

    (createToken.createToken as jest.Mock).mockImplementationOnce(() => {
      return createTokenResult;
    });

    const request = {
      body: JSON.stringify(body),
    };

    // Then
    const response = {
      status: (code: number) => {
        expect(code).toEqual(500);
      },
      json: (json: Result<string>) => {
        expect(json.code).toEqual(createTokenResult.code);
        expect(json.message).toEqual(createTokenResult.message);
        expect(json.data).toEqual(createTokenResult.data);
      },
    };

    const req: Request = mockReq(request);
    const res: Response = mockRes(response);

    // When
    await createRtcIdTokenOnRequest(req, res);
  });

  test("200 OK", async () => {
    // Given

    (verifyFirebaseAuthIdTokenOnRequest as jest.Mock).mockImplementationOnce(
      () => {
        return verifyFirebaseAuthIdTokenResult;
      }
    );

    const request = {
      body: JSON.stringify(body),
    };

    // Then
    const response = {
      status: (code: number) => {
        expect(code).toEqual(200);
      },
      json: (json: Result<string>) => {
        expect(JSON.parse(json.data).channelName).toEqual(body.channelName);
        expect(JSON.parse(json.data).uid).toEqual(body.localUid);
        expect(JSON.parse(json.data).account).toEqual(body.account);

        expect(JSON.parse(json.data).rtcIdTokenType).toEqual(
          body.rtcIdTokenType
        );
        const expectRole =
          body.role === "publisher"
            ? 1
            : body.role === "audience"
            ? 2
            : undefined;
        expect(JSON.parse(json.data).role).toEqual(expectRole);
        const aboutPrivilegeExpireTime =
          ValidateRequestData.calcPrivilegeExpireTime(body.privilegeExpireTime);
        expect(JSON.parse(json.data).privilegeExpireTime).toBeWithinRange(
          aboutPrivilegeExpireTime - 5000,
          aboutPrivilegeExpireTime + 500
        );

        expect(JSON.parse(json.data).firebaseAuthIdToken).toEqual(
          body.firebaseAuthIdToken
        );
        expect(JSON.parse(json.data).verifyFirebaseAuthUid).toEqual(
          JSON.parse(verifyFirebaseAuthIdTokenResult.data).uid
        );
        expect(JSON.parse(json.data).rtcIdToken).not.toEqual(
          JSON.parse(verifyFirebaseAuthIdTokenResult.data).rtcIdToken
        );
      },
    };

    const req: Request = mockReq(request);
    const res: Response = mockRes(response);

    // When
    await createRtcIdTokenOnRequest(req, res);

    console.log("body : ", body);
  });
});
