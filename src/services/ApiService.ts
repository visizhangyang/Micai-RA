import APP_CONFIG from 'APP_CONFIG'
import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/toPromise'

const USER_TOKEN = 'USER_TOKEN'

var user_token = null

export const UnauthorizationSubject = new Subject()

export const OfflineSubject = new Subject()

@Injectable()
export class ApiService {

    constructor(private http: Http) { }

    public static setUserToken(token: string) {
        user_token = 'token ' + token
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(USER_TOKEN, user_token)
        }
    }

    public static clearUserToken() {
        localStorage.removeItem(USER_TOKEN)
        user_token = null;
    }

    public static getUserToken() {
        if (user_token) return user_token

        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem(USER_TOKEN)
            if (token) user_token = token
            return token
        }
        return null
    }

    private static getUrl(path: string) {
        function appendPath(path: string) {
            if (path && path.length > 0 && path[path.length - 1] !== '/') {
                path += '/'
            }
            return path;
        }

        let queryIndex = -1;
        if (path) {
            queryIndex = path.indexOf('?');
        }

        if (queryIndex > -1) {
            path = appendPath(path.substr(0, queryIndex)) + path.substr(queryIndex);
        }
        else {
            path = appendPath(path);
        }

        return APP_CONFIG.api_url + path
    }

    private static handleError(res: Response | any) {

        let error_code = 'app_unknown'
        let error_fields = {}

        if (res instanceof Response) {
            if (res.status === 0) {
                // no network
                error_code = 'app_no_network'
                OfflineSubject.next()
            } else if (res.status === 401) {
                // Unauthorization
                ApiService.clearUserToken()
                UnauthorizationSubject.next(res)
            }
            else if (res.status === 500) {
                // server unhandled error
                error_code = 'app_service_error'
            }

            const contentType = res.headers.get('content-type')
            if (contentType === 'application/json') {
                const result = res.json()
                if (result.error_code) {
                    error_code = result.error_code
                }
                if (result.err_fields) {
                    error_fields = result.err_fields
                }
            }

        }



        return Promise.reject({
            http_status: res.status,
            error_code,
            error_fields,
        })
    }

    get(path: string): Promise<Response> {
        const url = ApiService.getUrl(path)
        const token = ApiService.getUserToken()

        let headers = new Headers();
        headers.append('Authorization', token);
        let options = new RequestOptions({ headers: headers })

        return this.http.get(url, options).toPromise().catch(ApiService.handleError)
    }

    getJSON(path: string): Promise<any> {
        return this.get(path).then((res) => res.json())
    }

    post(path: string, body: any, headers?: any): Promise<Response> {

        const url = ApiService.getUrl(path)

        let httpHeaders = {}

        headers && Object.assign(httpHeaders, headers)

        const token = ApiService.getUserToken()

        token && Object.assign(httpHeaders, { 'Authorization': token })

        let options = new RequestOptions({ headers: new Headers(httpHeaders) })

        return this.http.post(url, body, options).toPromise().catch(ApiService.handleError)
    }

    postJSON(path: string, body: any): Promise<any> {
        const headers = {
            'Content-Type': 'application/json',
        }

        function parseJSON(res: Response) {
            const text = res.text()
            const hasText = text != null && text.length > 0
            return hasText ? res.json() : {}
        }

        function logError(res) {
            console.error(res)
            return Promise.reject(res)
        }

        return this.post(path, body, headers).then(parseJSON, logError)
    }

}