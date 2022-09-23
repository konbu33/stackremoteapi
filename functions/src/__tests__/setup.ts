import * as functionsTest from "firebase-functions-test";

import * as dotenv from "dotenv";
dotenv.config();

let projectId = "";
let setUpJson = "";

try {
  setUpJson = process.env.SETUP_JSON as string;
  projectId = process.env.PROJECT_ID as string;
} catch (e) {
  console.log(" setup error : ", String(e));
}

// テスト対象の関関とFirebaseのProjectとを紐付けるために、testConfigを定義する。
// 利利するFirebaseのサービスによって、引数は変わる。
export const testConfig = functionsTest(
  {
    projectId: projectId,
  },
  setUpJson
);
