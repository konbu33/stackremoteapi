import { RtcRole } from 'agora-access-token';
import { RequestData } from "./requestData";
import { Result } from "./result";

export class ValidateRequestData {
  
  static validateChannelName(requestDataObject: RequestData ) : Result<string>{
    const channelName = requestDataObject.channelName;

    // channel 未指定の場場、エラー応答
    if (!channelName) {
      const result: Result<string> = {
        code: 500,
        message: 'channel is required',
        data: channelName,
      };

      return result;
    };

    const result: Result<string> = {
      code: 200,
      message: 'channel is no problem',
      data: channelName,
    };
    return result;
 
  }
  
  static validateUid(requestDataObject: RequestData) : Result<number> {
    let uid = requestDataObject.localUid;

    // uid 未指定の場場、エラー応答
    if ( uid < 0 ) {
      const result: Result<number> = {
        code: 500,
        message: 'uid is required',
        data: uid,
      };

      return result;
    }
    
    const result: Result<number> = {
      code: 200,
      message: 'uid is no problem',
      data: uid,
    };
  
    return result;
  }

  static validateRole(requestDataObject: RequestData) : Result<number>{
    let roleName = requestDataObject.role;
    let roleId: number = 99; 

    let result: Result<number>;

    switch (roleName) {
      case 'publisher':
        roleId = RtcRole.PUBLISHER;
        break;
    
      case 'audience':
        roleId = RtcRole.SUBSCRIBER
        break;

      default:
        result = {
          code: 500,
          message: 'role is required',
          data: roleId,
        };
 
        return result;
    };

    result  = {
      code: 200,
      message: 'role is no problem',
      data: roleId,
    };
    
    return result;
  }

  static validatePrivilegeExpireTime(requestDataObject: RequestData): Result<number> {
    // 権限期限切れ時間を計算
    let expireTime = requestDataObject.privilegeExpireTime;
    let expireTimeInt: number = 3600;

    if (expireTime < 0) expireTimeInt = 3600;

    expireTimeInt = expireTime;


    const privilegeExpireTime = this.calcPrivilegeExpireTime(expireTimeInt);

    const result: Result<number> = {
      code: 200,
      message: 'privilegeExpireTime is no problem',
      data: privilegeExpireTime,
    };
    
    return result;

  }

  static  calcPrivilegeExpireTime(expireTimeInt: number) { 
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTimeInt;
    return privilegeExpireTime;
  }

}
