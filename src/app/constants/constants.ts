import { environment } from '../../environments/environment';

export const APP_PROTOCOL = environment.production ? 'https://' : 'http://';
export const APP_HOST = window.location.hostname + ':';
export const APP_PORT = window.location.port;
export const APP_API = '/api/v1';
export const APP_NAME = APP_PROTOCOL + APP_HOST + APP_PORT + APP_API;

export const API_DATE_FORMAT = 'yyyy-MM-DD';
export const API_DATE_TIME_FORMAT = 'yyyy-MM-DD[T]HH:mm:ss';
export const CHIPS_DATE_FORMAT = 'DD/MM/yyyy';

export const CRON_EXPRESSION_STANDARD = '0 0 0 * * ? * ';

export const APP_VERSION = '1.2.1';
export const APP_API_ONLY = 'api/';

//API pathes
export const COMPANIES_API = environment.backendApi + APP_API + '/companies';
export const USER_API = environment.backendApi + APP_API + '/users';
export const ATTACHMENT_API = environment.backendApi + APP_API + '/attachments';
export const VISITOR_API = environment.backendApi + APP_API + '/visitors';

export const ERROR_CODE = {
    formatError: 'Incorrect time format',
    'java.lang.Exception': 'Validation error',
};

export enum SigningActions {
    CREATE = 'create',
    START = 'start',
    STARTSIGN = 'startsign',
    CANCEL = 'cancel',
    EDIT = "edit",
}
