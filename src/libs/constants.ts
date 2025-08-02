export const appConst = {
    HEADER: {
      CONTENT_TYPE: 'application/json'
    },
    ERROR: {
      CLIENT_ERROR: {
        SUCCESS_REQUEST: 200,
        SUCCESS_SAVED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        ALREADY_EXIST: 409,
        SESSION_EXPIRED: 440
      },
      SERVER_ERROR: {
        INTERNAL_SERVER_ERROR: 500
      },
      CODE: 500,
      MSG: 'error'
    },
    SUCCESS: {
      CODE: 200,
      MSG: 'ok'
    }
  };
  
  export const ERROR_CODES = {
    mobileNumber: '4222',
    email: '4226',
    staffId: '4223',
    studentId: '1150',
    name: '4224',
    keyName: '4225'
  };

  export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
  };

  export const VALIDATE_USER = {
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
  }