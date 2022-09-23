// --------------------------------------------------
//
// jestの動作確認用
//
// --------------------------------------------------

import * as admin from "firebase-admin";
jest.mock("firebase-admin");

import * as authAdmin from "firebase-admin/auth";
jest.mock("firebase-admin/auth");

import axiosx from "axios";
jest.mock("axios");

import { mock } from "jest-mock-extended";

interface PartyProvider {
  getPartyType: () => string;
  getSongs: (type: string) => string[];
  start: (type: string) => void;
}

describe("Party Tests", () => {
  test("Mock out an interface", () => {
    const mockObj = mock<PartyProvider>();
    mockObj.start("disco party");

    expect(mockObj.start).toHaveBeenCalledWith("disco party");
  });

  test("mock out a return type", () => {
    const mockObj = mock<PartyProvider>();
    mockObj.getPartyType.mockReturnValue("west coast party");

    expect(mockObj.getPartyType()).toBe("west coast party");
  });
});

describe("1", () => {
  test("1-1", () => {
    expect(1).toEqual(1);
  });

  test("1-2", () => {
    //
    const mockObject = jest.fn(() => {
      return "this mock.";
    });

    expect(mockObject()).toContain("this");
  });

  test("1-3", () => {
    //
    const mockObject = {
      calc: jest.fn(() => {
        return "this mock.";
      }),
      tost: jest.fn(() => {
        return "this tost.";
      }),
    };
    expect(mockObject.calc()).toContain("this");
    expect(mockObject.tost()).toContain("tost");

    console.log(
      " --- +++  :  ",
      mockObject.calc.mock.calls.length,
      mockObject.calc.mock.results[0].value,
      mockObject.tost.mock.calls.length,
      mockObject.tost.mock.results[0].value
    );
  });

  test("1-4", async () => {
    // jest.mock('authAdmin');

    const a = (axiosx.get as jest.Mock).mockResolvedValue({ data: "a" });

    console.log("a : ", await a());

    // authAdmin.getAuth().mockResolvedValue({ data: "xid" });
  });

  test("1-5", async () => {
    admin.initializeApp();

    const a = (authAdmin.getAuth as jest.Mock).mockResolvedValue({
      uid: "user001",
    });

    console.log("a : ", await a());

    // authAdmin.getAuth().mockResolvedValue({ data: "xid" });
  });
});
