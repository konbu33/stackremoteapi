import { ResponseData } from '../lib/responseData';
import { createToken } from '../lib/createToken';

import * as dotenv from 'dotenv';
// import { RtcTokenBuilder } from 'agora-access-token';

let responseData: ResponseData;

// let spyBuildTokenWithAccount: jest.SpyInstance = jest.spyOn(RtcTokenBuilder, 'buildTokenWithAccount');
// let spyBuildTokenWithUid: jest.SpyInstance = jest.spyOn(RtcTokenBuilder, 'buildTokenWithUid');

// jest.mock('agora-access-token', () => {
//     return {
//         RtcTokenBuilder: {
//             buildTokenWithAccount: jest.fn(),
//             buildTokenWithUid: jest.fn(),
//         }
//     }
// })

// const mockBuildTokenWithAccount = (RtcTokenBuilder.buildTokenWithAccount as jest.Mock);
// const mockBuildTokenWithUid = (RtcTokenBuilder.buildTokenWithUid as jest.Mock);

// const mockBuildTokenWithAccount = jest.mocked(RtcTokenBuilder.buildTokenWithAccount);
// const mockBuildTokenWithUid = jest.mocked(RtcTokenBuilder.buildTokenWithUid);

beforeAll(() => {

    // Given
    responseData = {
        channelName: "channelName001",
        uid: 1,
        account: "account001",
        rtcIdTokenType: "uid",
        role: 1,
        privilegeExpireTime: 3600,
        firebaseAuthIdToken: "firebaseAuthIdToken",
        verifyFirebaseAuthUid: "verifyFirebaseAuthUid",
        rtcIdToken: "rtcIdToken",
    };
    
});

afterEach(() => { 
    // jest.restoreAllMocks();

    // spyBuildTokenWithAccount.mockClear();
    // spyBuildTokenWithUid.mockClear();

    // spyBuildTokenWithAccount.mockReset();
    // spyBuildTokenWithUid.mockReset();

    // spyBuildTokenWithAccount.mockRestore();
    // spyBuildTokenWithUid.mockRestore();
    
    // mockBuildTokenWithAccount.mockClear();
    // mockBuildTokenWithUid.mockClear();
});

describe('createToken : process.env.X', () => { 
  
    test('500 : ERROR : undefinded process.env.APP_ID', () => {

        // Given
        // dotenv.config(); 
        // process.env.APP_ID = "dummy_app_id";
        // process.env.APP_CERTIFICATE= "dummy_app_certificate";

        // When
        const result =  createToken(responseData);
        console.log('result : ', result);

        // Then
        expect(result.code).toEqual(500);
        expect(result.message).toContain('ReferenceError: APP_ID undefined');
        expect(result.data).toEqual('');
    });

    test('500 : ERROR : undefinded process.env.APP_CERTIFICATE', () => {

        // Given
        // dotenv.config(); 
        process.env.APP_ID = "dummy_app_id";
        // process.env.APP_CERTIFICATE= "dummy_app_certificate";

        // When
        const result =  createToken(responseData);
        console.log('result : ', result);

        // Then
        expect(result.code).toEqual(500);
        expect(result.message).toContain('ReferenceError: APP_CERTIFICATE undefined');
        expect(result.data).toEqual('');
      
    });

    test('200 OK', () => { 

        // Given
        dotenv.config(); 
        // process.env.APP_ID = "dummy_app_id";
        // process.env.APP_CERTIFICATE= "dummy_app_certificate";

        // When
        const result =  createToken(responseData);
        console.log('result : ', result);

        // Then
        expect(result.code).toEqual(200);
        expect(result.message).toContain('no problem');
        expect(result.data).not.toEqual('');
       
    })
})

describe('createToken : rtcIdTokenType', () => { 
 
    test('rtcIdTokenType : userAccount', () => { 
    
        // Given
        dotenv.config();
        responseData.rtcIdTokenType = 'userAccount';
        
        // When
        const result = createToken(responseData);
        console.log('result : ', result);

        // Then
        expect(result.code).toEqual(200);
        expect(result.message).toContain('userAccount is no problem');
        expect(result.data).not.toEqual('');
        
        // console.log("spyBuildTokenWithAccount call : ", spyBuildTokenWithAccount.mock.calls.length);
        // console.log("spyBuildTokenWithUid call : ", spyBuildTokenWithUid.mock.calls.length);

        // expect(spyBuildTokenWithAccount).toHaveBeenCalled();
        // expect(spyBuildTokenWithUid).not.toHaveBeenCalled();
        
        // console.log(" mockRtcTokenBuilder call : ", mockBuildTokenWithAccount.mock.calls.length);
        // console.log(" mockRtcTokenBuilder call : ", mockBuildTokenWithUid.mock.calls.length);

      
    });

    test('rtcIdTokenType : uid', () => {
        // Given
        dotenv.config();
        responseData.rtcIdTokenType = 'uid';

        // When
        // const result = { code: 200, message: "no problem", data: "x" };
        const result = createToken(responseData);
        console.log('result : ', result);

        // Then
        expect(result.code).toEqual(200);
        expect(result.message).toContain('uid is no problem');
        expect(result.data).not.toEqual('');

        // console.log("spyBuildTokenWithAccount call : ", spyBuildTokenWithAccount.mock.calls.length);
        // console.log("spyBuildTokenWithUid call : ", spyBuildTokenWithUid.mock.calls.length);

        // expect(spyBuildTokenWithAccount).not.toHaveBeenCalled();
        // expect(spyBuildTokenWithUid).toHaveBeenCalled();
        
        // console.log(" mockRtcTokenBuilder call : ", mockBuildTokenWithAccount.mock.calls.length);
        // console.log(" mockRtcTokenBuilder call : ", mockBuildTokenWithUid.mock.calls.length);
        
   
    });

    test('rtcIdTokenType : other', () => {
        // Given
        dotenv.config();
        responseData.rtcIdTokenType = 'dummyType';

        
        // When
        const result = createToken(responseData);
        console.log('result : ', result);

        // Then
        expect(result.code).toEqual(500);
        expect(result.message).toContain('is invalid');
        expect(result.data).toEqual('');
       
    });
})
