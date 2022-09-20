import { Request } from 'firebase-functions';
import { mockReq } from 'sinon-express-mock';


import { ValidateRequestData } from '../lib/validateRequestData';
import { createRequestDataObject, RequestData } from '../lib/requestData';

let requestDataObject: RequestData;

import './customMatchers';
import { Result } from '../lib/result';

beforeEach(() => {
    
    const body = {
        channelName: "channel001",
        localUid: 1,
        account: "account001",
        rtcIdTokenType: "uid",
        role: "publisher",
        privilegeExpireTime: 4000,
    };

    const request = {
        body: JSON.stringify(body),
    };

    const req: Request = mockReq(request);
    const result: Result<string> = createRequestDataObject(req);
    requestDataObject = JSON.parse(result.data);

});

// --------------------------------------------------
// 
// validateChannelName 
//
// --------------------------------------------------

describe('validateChannelName', () => {

    test('500 ERROR', () => {
        // Given
        requestDataObject.channelName = "";

        // When
        const result = ValidateRequestData.validateChannelName(requestDataObject);
        console.log("result : ", result);
        
        // Then
        // result :  { code: 500, message: 'channel is required', data: '' }
        expect(result.code).toEqual(500);
        expect(result.message).toContain('required');
        expect(result.data).toEqual('');
    });

    test('200 OK', () => {
        // Given
        // requestDataObject.channelName = "";

        // When
        const result = ValidateRequestData.validateChannelName(requestDataObject);
        console.log("result : ", result);
        
        // Then
        // result :  { code: 200, message: 'channel is no problem', data: 'channel001' }
        expect(result.code).toEqual(200);
        expect(result.message).toContain('no problem');
        expect(result.data).toEqual(requestDataObject.channelName);

    });

});

// --------------------------------------------------
// 
// validateUid 
//
// --------------------------------------------------

describe('validateUid', () => {

    test('500 ERROR', () => {
        // Given
        requestDataObject.localUid = -1;

        // When
        const result = ValidateRequestData.validateUid(requestDataObject);
        console.log("result : ", result);
        
        // Then
        // result :  { code: 500, message: 'channel is required', data: '' }
        expect(result.code).toEqual(500);
        expect(result.message).toContain('required');
        expect(result.data).toEqual(requestDataObject.localUid);
    });

    test('200 OK', () => {
        // Given
        requestDataObject.localUid = 0;

        // When
        const result = ValidateRequestData.validateUid(requestDataObject);
        console.log("result : ", result);
        
        // Then
        // result :  { code: 200, message: 'channel is no problem', data: 'channel001' }
        expect(result.code).toEqual(200);
        expect(result.message).toContain('no problem');
        expect(result.data).toEqual(requestDataObject.localUid);

    });

});

// --------------------------------------------------
// 
// validateRole 
//
// --------------------------------------------------

describe('validateRole', () => {

    test('500 ERROR', () => {
        // Given
        requestDataObject.role = "defineRole";

        // When
        const result = ValidateRequestData.validateRole(requestDataObject);
        console.log("result : ", result);
        
        // Then
        // result :  { code: 500, message: 'channel is required', data: '' }
        expect(result.code).toEqual(500);
        expect(result.message).toContain('required');
        expect(result.data).toEqual(99);
    });

    test('200 publisher', () => {
        // Given
        requestDataObject.role= "publisher";
        // requestDataObject.role= "audience";

        // When
        const result = ValidateRequestData.validateRole(requestDataObject);
        console.log("result : ", result);
        
        // Then
        // result :  { code: 200, message: 'channel is no problem', data: 'channel001' }
        expect(result.code).toEqual(200);
        expect(result.message).toContain('no problem');
        expect(result.data).toEqual(1);

    });

    test('200 audience', () => {
        // Given
        // requestDataObject.role= "publisher";
        requestDataObject.role= "audience";

        // When
        const result = ValidateRequestData.validateRole(requestDataObject);
        console.log("result : ", result);
        
        // Then
        // result :  { code: 200, message: 'channel is no problem', data: 'channel001' }
        expect(result.code).toEqual(200);
        expect(result.message).toContain('no problem');
        expect(result.data).toEqual(2);

    });

});

// --------------------------------------------------
// 
// validatePrivilegeExpireTime 
//
// --------------------------------------------------

describe('validatePrivilegeExpireTime', () => {

    test('200 OK default expire', () => {
        // Given
        requestDataObject.privilegeExpireTime = -1;

        // When
        const result = ValidateRequestData.validatePrivilegeExpireTime(requestDataObject);
        const expectPrivilegeExpireTime = ValidateRequestData.calcPrivilegeExpireTime(3600);
        console.log("result : ", result);
        
        // Then
        // result :  { code: 500, message: 'channel is required', data: '' }
        expect(result.code).toEqual(200);
        expect(result.message).toContain('no problem');
        expect(result.data).toBeWithinRange(expectPrivilegeExpireTime - 5000, expectPrivilegeExpireTime + 5000);
    });

    test('200 OK', () => {
        // Given
        requestDataObject.privilegeExpireTime = 0;

        // When
        const result = ValidateRequestData.validatePrivilegeExpireTime(requestDataObject);
        const expectPrivilegeExpireTime = ValidateRequestData.calcPrivilegeExpireTime(requestDataObject.privilegeExpireTime);
        console.log("result : ", result);
        
        // Then
        // result :  { code: 200, message: 'channel is no problem', data: 'channel001' }
        expect(result.code).toEqual(200);
        expect(result.message).toContain('no problem');
        expect(result.data).toBeWithinRange(expectPrivilegeExpireTime - 5000, expectPrivilegeExpireTime + 5000);

    });

});

