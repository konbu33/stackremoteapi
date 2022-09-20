import { testConfig } from './setup';

import { verifyFirebaseAuthIdTokenOnCall } from '../lib/verifyFirebaseAuthIdTokenOnCall';
jest.mock('../lib/verifyfirebaseauthidtokenOnCall');

import { ValidateRequestData }  from '../lib/validateRequestData';
// jest.mock('../lib/validateRequestData');
jest.spyOn(ValidateRequestData, 'validateChannelName');
jest.spyOn(ValidateRequestData, 'validateUid');

import * as createToken from '../lib/createToken';
jest.spyOn(createToken, 'createToken');

import './customMatchers';

import { createRtcIdToken }  from '../createRtcIdToken';
import { Result } from '../lib/result';
import { WrappedFunction } from 'firebase-functions-test/lib/main';
import { HttpsFunction, Runnable } from 'firebase-functions/v1';

let wrapped: WrappedFunction<any, HttpsFunction & Runnable<any>> ;
let dummyUid: string;
let dummyFirebaseAuthIdToken: string;
let verifyFirebaseAuthIdTokenResult: Result<string>;

let data: {
    channelName: string,
    account: string,
    privilegeExpireTime: number,
    rtcIdTokenType: string,
    role: string,
    localUid: number,
    firebaseAuthIdToken: string,
};

let context: {
    auth: {
        uid: string,
        token: string,
    },
}

beforeAll(() => {
    wrapped = testConfig.wrap(createRtcIdToken);

});

beforeEach(() => {
    dummyUid = "dummyUid";

    dummyFirebaseAuthIdToken = "dummyFirebaseAuthIdToken"; 

    verifyFirebaseAuthIdTokenResult  = {
        code: 200,
        message: "SUCCESS: verifyFirebaseAuthIdToken",
        data: JSON.stringify({ uid : dummyUid, firebaseAuthIdToken: dummyFirebaseAuthIdToken }),
    };

    data = {
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
    }

    context = {
        auth: {
            uid: dummyUid,
            token: dummyFirebaseAuthIdToken,
        },
    };

});

describe('createRtcIdToken', () => { 
    test('500 ERROR : verifyFirebaseAuthIdToken', async () => {

        // Given
        verifyFirebaseAuthIdTokenResult  = {
            code: 500,
            message: "ERROR : verifyFirebaseAuthIdToken",
            data: JSON.stringify({ uid : dummyUid, firebaseAuthIdToken: dummyFirebaseAuthIdToken }),
        };

        (verifyFirebaseAuthIdTokenOnCall as jest.Mock).mockImplementationOnce(
            () => { return verifyFirebaseAuthIdTokenResult; }
        );

        // When
        const result: Result<string> = await wrapped(data, context);

        // Then
        expect(result.code).toEqual(verifyFirebaseAuthIdTokenResult.code);
        expect(result.message).toEqual(verifyFirebaseAuthIdTokenResult.message);
        expect(JSON.parse(result.data).uid).toEqual(JSON.parse(verifyFirebaseAuthIdTokenResult.data).uid);
        expect(JSON.parse(result.data).firebaseAuthIdToken).toEqual(JSON.parse(verifyFirebaseAuthIdTokenResult.data).firebaseAuthIdToken);

    })
    
    test('500 ERROR : validateResultChannelName', async () => {

        // Given
        (verifyFirebaseAuthIdTokenOnCall as jest.Mock).mockImplementationOnce(
            () => { return verifyFirebaseAuthIdTokenResult; }
        );

        const dummyChannelName = "dummyChannelName";
        const validateChannelNameResult  = {
            code: 500,
            message: "ERROR : validateChannelName",
            data: dummyChannelName,
        };

        (ValidateRequestData.validateChannelName as jest.Mock).mockImplementationOnce(
            () => { return validateChannelNameResult; }
        );


        // When
        const result: Result<string> = await wrapped(data, context);

        // Then
        expect(result.code).toEqual(validateChannelNameResult.code);
        expect(result.message).toEqual(validateChannelNameResult.message);
        expect(result.data).toEqual(validateChannelNameResult.data);

    })

    test('500 ERROR : validateUid', async () => {
        // Given

        (verifyFirebaseAuthIdTokenOnCall as jest.Mock).mockImplementationOnce(
            () => { return verifyFirebaseAuthIdTokenResult; }
        );

        const dummyUid: number = 99;
        const validateUidResult  = {
            code: 500,
            message: "ERROR : validateUid",
            data: dummyUid,
        };

        (ValidateRequestData.validateUid as jest.Mock).mockImplementationOnce(
            () => { return validateUidResult; }
        );

        // When
        const result = await wrapped(data, context);

        // Then
        expect(result.code).toEqual(validateUidResult.code);
        expect(result.message).toEqual(validateUidResult.message);
        expect(result.data).toEqual(validateUidResult.data);

    })

    test('500 ERROR : createToken', async () => {
        // Given

        (verifyFirebaseAuthIdTokenOnCall as jest.Mock).mockImplementationOnce(
            () => { return verifyFirebaseAuthIdTokenResult; }
        );

        const dummyToken = "dummyToken";
        const createTokenResult  = {
            code: 500,
            message: "ERROR : createToken",
            data: dummyToken,
        };

        (createToken.createToken as jest.Mock).mockImplementationOnce(
            () => { return createTokenResult; }
        );

        // When
        const result = await wrapped(data, context);
        
        // Then
        expect(result.code).toEqual(createTokenResult.code);
        expect(result.message).toEqual(createTokenResult.message);
        expect(result.data).toEqual(createTokenResult.data);
 
    })

    test('200 OK', async () => {
        // Given

        (verifyFirebaseAuthIdTokenOnCall as jest.Mock).mockImplementationOnce(
            () => { return verifyFirebaseAuthIdTokenResult; }
        );

        // When
        const result = await wrapped(data, context);

         // Then
        expect(JSON.parse(result.data).channelName).toEqual(data.channelName);
        expect(JSON.parse(result.data).uid).toEqual(data.localUid);
        expect(JSON.parse(result.data).account).toEqual(data.account);

        expect(JSON.parse(result.data).rtcIdTokenType).toEqual(data.rtcIdTokenType);
        const expectRole = data.role === "publisher" ? 1 : data.role === "audience" ? 2 : undefined;
        expect(JSON.parse(result.data).role).toEqual(expectRole);
        const aboutPrivilegeExpireTime = ValidateRequestData.calcPrivilegeExpireTime(data.privilegeExpireTime)
        expect(JSON.parse(result.data).privilegeExpireTime).toBeWithinRange(aboutPrivilegeExpireTime - 5000, aboutPrivilegeExpireTime + 500);

        expect(JSON.parse(result.data).firebaseAuthIdToken).toEqual(data.firebaseAuthIdToken);
        expect(JSON.parse(result.data).verifyFirebaseAuthUid).toEqual(JSON.parse(verifyFirebaseAuthIdTokenResult.data).uid);
        expect(JSON.parse(result.data).rtcIdToken).not.toEqual(JSON.parse(verifyFirebaseAuthIdTokenResult.data).rtcIdToken);
        
    })


})
