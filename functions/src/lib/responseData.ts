import { _instanceWithOptions } from "firebase-functions/v1/database";

export type ResponseData = {
  channelName: string,
  uid: number,
  account: string,
  rtcIdTokenType: string,
  role: number,
  privilegeExpireTime: number,
  firebaseAuthIdToken: string,
  verifyFirebaseAuthUid: string,
  rtcIdToken: string,
};

export class ResponseDataState {
  constructor(
    private _state: ResponseData,
  ) { };
  
  get state(): ResponseData {
    return this._state;
  };
  
  setRtcIdToken(rtcIdToken: string) {
    this._state.rtcIdToken = rtcIdToken;
  };
}