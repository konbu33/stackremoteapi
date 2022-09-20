import { verifyFirebaseAuthIdTokenOnCall } from '../lib/verifyFirebaseAuthIdTokenOnCall';

import { mock } from 'jest-mock-extended';
import * as functions from 'firebase-functions';
import { AuthData } from 'firebase-functions/v2/tasks';
import { DecodedIdToken } from 'firebase-admin/auth';

// interfaceからモックオブジェクト生成
let mockContext = mock<functions.https.CallableContext>();
let mockAuth = mock<AuthData>();
let mockDecodedIdToken = mock<DecodedIdToken>();

afterEach(() => {

    // モックオブジェクト組み立て
    mockContext.auth = mockAuth;
    mockAuth.uid = "mock uid";
    mockAuth.token = mockDecodedIdToken;
    mockDecodedIdToken.uid = "mock token uid";

    // console.log("mockContext : ",mockContext);
    // console.log("mockAuth: ",mockAuth);
    // console.log("mockDecodedIdToken: ",mockDecodedIdToken);
});

describe('verifyFirebaseAuthIdToken ', () => { 
    test('auth fail', async () => {
       
        // Given
        
        // context.authに認認証情が含まれていないケース
        // モックオブジェクト組み立て
        mockContext.auth = undefined;
        // mockAuth.uid = "mock uid";
        // mockAuth.token = mockDecodedIdToken;
        // mockDecodedIdToken.uid = "mock token uid";


        // When
        const result = await verifyFirebaseAuthIdTokenOnCall(mockContext);
        
        console.log(' result : ', result);
        
        // Then

        // returnされたデータが想定どおりであること
        expect(result.code).toEqual(500);
        expect(result.message).toContain('not authenticated');
        expect(JSON.parse(result.data).uid).toEqual("");
        expect(JSON.parse(result.data).firebaseAuthIdToken).toEqual("");
    })


    
    test('auth success', async () => { 

        // Given
        
        // context.authに認認証情が含まれているケース
        // モックオブジェクト組み立て
        // mockContext.auth = mockAuth;
        // mockAuth.uid = "mock uid";
        // mockAuth.token = mockDecodedIdToken;
        mockDecodedIdToken.uid = "mock token uid";

      
       
        // When
        const result = await verifyFirebaseAuthIdTokenOnCall(mockContext);
        
        console.log(' result : ', result);
       
        // Then
        
        // returnされたデータが想定どおりであること
        expect(result.code).toEqual(200);
        expect(result.message).toContain('id token verify success.');
        expect(JSON.parse(result.data).uid).toEqual(mockContext.auth?.token.uid);
        // expect(JSON.parse(result.data).firebaseAuthIdToken).toEqual(mockContext.auth?.token);

    })

})

