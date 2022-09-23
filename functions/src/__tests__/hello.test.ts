import { mockReq, mockRes } from "sinon-express-mock";
import {
  helloWorld,
  helloWorldSecureOnRequest,
  helloWorldSecureOnCall,
} from "../index";

import { Result } from "../lib/result";

import { verifyFirebaseAuthIdTokenOnRequest } from "../lib/verifyFirebaseAuthIdTokenOnRequest";
// verifyFirebaseAuthIdToken のモックを自動生成
jest.mock("../lib/verifyFirebaseAuthIdTokenOnRequest");
// 明示的に型を指定し、変変定義する
const mockVerifyFirebaseAuthIdToken: jest.Mock =
  verifyFirebaseAuthIdTokenOnRequest as jest.Mock;

// テスト対象の関関とFirebaseのProjectとを紐付けるために、testConfigを読み込み。
import { testConfig } from "./setup";

afterEach(() => {
  // テストケース毎に、モックの状状をクリアする。
  mockVerifyFirebaseAuthIdToken.mockClear();
});

// --------------------------------------------------
//
// helloWorld
//
// --------------------------------------------------
describe("helloWorld", () => {
  test("pattern : 200 OK", async () => {
    // Given
    const request = {};

    // Then
    // onRequestはreturnがvoidなので、expectをresponseで渡して、テストする。
    // 未確認だが、responseをspyすることで？responseの状態を記録して、テストする方法がありそう。
    const response = {
      status: (code: number) => {
        expect(code).toEqual(200);
      },
      send: (jsonData: Record<string, unknown>) => {
        expect(jsonData).toEqual({ name: "Hello world" });
      },
    };

    const req = mockReq(request);
    const res = mockRes(response);

    // When
    await helloWorld(req, res);
  });
});

// --------------------------------------------------
//
// helloWorldSecureOnRequest
//
// --------------------------------------------------
describe("helloWorldSecureOnRequest", () => {
  test("pattern : 500 ERROR", async () => {
    // Given
    const result: Result<string> = {
      code: 500,
      message: "fail",
      data: "",
    };

    // Token検証が失敗したresultを返すようにモックを定義
    mockVerifyFirebaseAuthIdToken.mockReturnValueOnce(result);

    const request = {};

    // Then
    const response = {
      status: (code: number) => {
        expect(code).toEqual(500);
      },
    };

    const req = mockReq(request);
    const res = mockRes(response);

    // When
    await helloWorldSecureOnRequest(req, res);

    // Then
    // モックした関数が1回以上呼ばれたこと
    expect(mockVerifyFirebaseAuthIdToken).toBeCalled();

    console.log(" 500 : ", mockVerifyFirebaseAuthIdToken.mock.results[0]);
    console.log(" 500 : ", mockVerifyFirebaseAuthIdToken.mock.calls.length);
  });

  test("pattern : 200 OK", async () => {
    // Given
    const result: Result<string> = {
      code: 200,
      message: "success",
      data: "id token",
    };

    // Token検証が成功したresultを返すようにモックを定義
    mockVerifyFirebaseAuthIdToken.mockReturnValueOnce(result);

    const request = {};

    // Then
    // onRequestはreturnがvoidなので、expectをresponseで渡して、テストする。
    // 未確認だが、responseをspyすることで？responseの状態を記録して、テストする方法がありそう。
    const response = {
      status: (code: number) => {
        expect(code).toEqual(200);
      },
    };

    const req = mockReq(request);
    const res = mockRes(response);

    // When
    await helloWorldSecureOnRequest(req, res);

    // Then
    // モックした関数が1回以上呼ばれたこと
    expect(mockVerifyFirebaseAuthIdToken).toBeCalled();

    console.log(" 200 : ", mockVerifyFirebaseAuthIdToken.mock.results[0]);
    console.log(" 200 : ", mockVerifyFirebaseAuthIdToken.mock.calls.length);
  });
});

// --------------------------------------------------
//
// helloWorldSecureOnCall
//
// --------------------------------------------------
describe("helloWorldSecureOnCall", () => {
  type ResponseData = {
    data: {
      id: number;
      name: string;
    };
    context: { auth: boolean };
    message: string;
  };

  test("pattern : auth success", async () => {
    // Given
    // onRequestではなく、onCallの関数の場場、テスト対象をwrapすることで、
    // テスト対象の関数とFrebaseのProjectを紐付けるイメージ。
    const wrapped = testConfig.wrap(helloWorldSecureOnCall);

    const data = { id: 1234, name: "take" };
    const context = { auth: "something token" };

    // When
    const res: ResponseData = await wrapped(data, context);

    // Then
    expect(res.data.id).toBe(data.id + 1);
    expect(res.data.name).toEqual(data.name);
    expect(res.context.auth).toEqual(!context.auth);
    expect(res.message).toContain("success");
  });

  test("pattern : auth fail", async () => {
    // Given
    // onRequestではなく、onCallの関数の場場、テスト対象をwrapすることで、
    // テスト対象の関数とFrebaseのProjectを紐付けるイメージ。
    const wrapped = testConfig.wrap(helloWorldSecureOnCall);

    const data = { id: 1234, name: "take" };
    const context = { auth: "" };

    // When
    const res: ResponseData = await wrapped(data, context);

    // Then
    expect(res.data.id).toBe(data.id - 1);
    expect(res.data.name).toEqual(data.name);
    expect(res.context.auth).toEqual(!context.auth);
    expect(res.message).toContain("fail");
  });
});
