import { verifyFirebaseAuthIdTokenOnRequest } from '../lib/verifyFirebaseAuthIdTokenOnRequest';

import * as authAdmin from 'firebase-admin/auth';

// 'firebase-admin/auth' モジュールのモックを自動生成
jest.mock('firebase-admin/auth');

// 'firebase-admin/auth'からモック自動生成したことで、
// authAdminのgetAuthがjest.fn関数になっているため、
// jest.Mock型として型を明示に記述し、モックの変変として定義する。
const mockGetAuth: jest.Mock = (authAdmin.getAuth as jest.Mock);

// 'firebase-admin/auth'からモック自動生成する際に、getAuth下位のverifyIdTokenをjest.fn関数に指定したい場場は、
// 下記の通り、第2引数に定義した関数で上書きするイメージでモック作成する。
// 今回は、テストケース毎にverifyIdTokenの関数を変変したいため、test内に記記する。
// jest.mock('firebase-admin/auth', () => {
//     return {
//         getAuth: () => {
//             return {
//                 // verifyIdToken: jest.fn((token: string) => { return { uid: "user001" } }),
//                 verifyIdToken: jest.fn(),
//             }
//         }
//     }
// });

afterEach(() => {
    // テストケース毎に、mockGetAuthの状態をクリアする。
    mockGetAuth.mockClear();
});

describe('verifyFirebaseAuthIdToken ', () => { 
    test('auth fail', async () => {
       
        // Given
        
        // モック変数に verifyIdTokenを定定して、jest.fn関数とする。
        // テスト対象モジュール内で、verifyIdTokenが呼呼び出され際に、処理したい関数をjest.fn関数の引数に渡す。
        // idTokenの検証に失敗したテストケースのため、Error(メッセージ)をthrowする関数をjest.fn関数に渡している。
        mockGetAuth.mockImplementation(() => {
            return {
                verifyIdToken: jest.fn((token: string) => {
                    throw Error(
                    'Decoding Firebase ID token failed. Make sure you passed the entire string JWT which represents an ID token. See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.'
                )}),
            }
        });

        const idToken = "xxxxx";
        
        // When
        const result = await verifyFirebaseAuthIdTokenOnRequest(idToken);
        
        console.log(' result : ', result);
        
        // Then
      
        // モックされた関数が1回以上呼び出されていること
        console.log(' lenght : ', mockGetAuth.mock.calls.length);
        expect(mockGetAuth).toHaveBeenCalled();

        // returnされたデータが想定どおりであること
        expect(result.code).toEqual(500);
        expect(result.message).toContain('Error: Decoding Firebase ID token failed.');
        expect(JSON.parse(result.data).uid).toEqual("");
        expect(JSON.parse(result.data).firebaseAuthIdToken).toEqual(idToken);
    })


    
    test('auth success', async () => { 

        // Given
       
        // モック変数に verifyIdTokenを定定して、jest.fn関数とする。
        // テスト対象モジュール内で、verifyIdTokenが呼呼び出され際に、処理したい関数をjest.fn関数の引数に渡す。
        // idTokenの検証に成功したテストケースのため、uidをreturnする関数をjest.fn関数に渡している。
        const dummyUid = "user001";
        mockGetAuth.mockImplementation(() => {
            return {
                verifyIdToken: jest.fn((token: string) => { return { uid: dummyUid } }),
            }
        });

        const idToken = "xxxxx";
        
        // When
        const result = await verifyFirebaseAuthIdTokenOnRequest(idToken);
        
        console.log(' result : ', result);
       
        // Then
        
        // returnされたデータが想定どおりであること
        console.log(' lenght : ', mockGetAuth.mock.calls.length);
        expect(mockGetAuth).toHaveBeenCalled();

        // returnされたデータが想定どおりであること
        expect(result.code).toEqual(200);
        expect(result.message).toContain('id token verify success.');
        expect(JSON.parse(result.data).uid).toEqual(dummyUid);
        expect(JSON.parse(result.data).firebaseAuthIdToken).toEqual(idToken);

    })

})

