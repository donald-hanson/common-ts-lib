import { BaseApi, ApiError, ApiEndpoint } from "./base"

export type LoginUsernamePasswordRequest = {
    client_id:string
    username:string
    password:string
    scope:string
}

export type LoginUsernamePasswordResponse = {
    access_token: string
    expires_in: number
    token_token: string
    refresh_token: string
    scope: string
}

export type UserInfoResponse = {
    tid: string
    name: string
    family_name: string
    given_name: string
    email: string
    email_verified: string
    sub: string
}

export class IdentityApi extends BaseApi {
	public static async loginUsernamePassword(request:LoginUsernamePasswordRequest): Promise<LoginUsernamePasswordResponse|ApiError> {
        const defaultConfig = await this.getDefaultConfig(ApiEndpoint.Identity);
        const config = { 
            ...defaultConfig,
        };
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		const response = await this.post('connect/token', {...request, grant_type:'password'}, config);
		return this.transformResponse(response);
	}

	public static async getUserInfo(): Promise<UserInfoResponse|ApiError> {
        const defaultConfig = await this.getDefaultConfig(ApiEndpoint.Identity);
        const config = { 
            ...defaultConfig,
        };
		const response = await this.post('connect/userinfo', {}, config);
		return this.transformResponse(response);
	}        
}