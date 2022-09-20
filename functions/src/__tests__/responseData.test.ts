import { ResponseData, ResponseDataState } from '../lib/responseData';

let responseData: ResponseData;

beforeAll(() => {
    // Given
    responseData = {
        channelName: "channel001",
        uid: 9,
        account: "account001",
        rtcIdTokenType: "uid",
        role: 1,
        privilegeExpireTime: 4000,
        firebaseAuthIdToken: "token001",
        verifyFirebaseAuthUid: "firebaseAuthUid001",
        rtcIdToken: "rtcIdToken001",
    };

});

describe('responseData', () => { 
    test('create ResponseDataState, and state getter', () => { 
        // Given
        const _responseData: ResponseData = {
            channelName: "channel001",
            uid: 9,
            account: "account001",
            rtcIdTokenType: "uid",
            role: 1,
            privilegeExpireTime: 4000,
            firebaseAuthIdToken: "token001",
            verifyFirebaseAuthUid: "firebaseAuthUid001",
            rtcIdToken: "rtcIdToken001",
        };

        // When 
        const responseDataState: ResponseDataState = new ResponseDataState(_responseData);
        
        // Then
        expect(responseDataState.state.channelName).toEqual(_responseData.channelName);
        expect(responseDataState.state.uid).toEqual(_responseData.uid);
        expect(responseDataState.state.account).toEqual(_responseData.account);

        expect(responseDataState.state.rtcIdTokenType).toEqual(_responseData.rtcIdTokenType);
        expect(responseDataState.state.role).toEqual(_responseData.role);
        expect(responseDataState.state.privilegeExpireTime).toEqual(_responseData.privilegeExpireTime);

        expect(responseDataState.state.firebaseAuthIdToken).toEqual(_responseData.firebaseAuthIdToken);
        expect(responseDataState.state.verifyFirebaseAuthUid).toEqual(_responseData.verifyFirebaseAuthUid);
        expect(responseDataState.state.rtcIdToken).toEqual(_responseData.rtcIdToken);

    })

    test('setRtcIdToken', () => { 
    
        // Given 
        const responseDataState: ResponseDataState = new ResponseDataState(responseData);
        console.log(" responseDataState : ", responseDataState.state);
        expect(responseDataState.state.rtcIdToken).toEqual(responseData.rtcIdToken);
       
        // When
        const newRtcIdToken: string = "newRtcIdToken002";
        responseDataState.setRtcIdToken(newRtcIdToken);
        
        // Then
        console.log(" responseDataState : ", responseDataState.state);
        expect(responseDataState.state.rtcIdToken).toEqual(newRtcIdToken);

    })

})
