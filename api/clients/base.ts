import { AxiosHttpDriver, HttpRequestConfig, HttpResponse, IHttpDriver } from '../http';

export type ApiError = {
	error: true
	statusCode: number
	data: any
};

export type RowsResult<T> = {
	row_data:T[]
    row_count?: number;
}

export function IsApiError<T>(response:T|ApiError): response is ApiError {
	return (response as ApiError).error === true;
}

export enum ApiEndpoint {
	Identity
}

export class BaseApi {

	private static baseUrlMap:Record<ApiEndpoint,string> = {
		[ApiEndpoint.Identity]: "http://localhost:5000",
	};

	private static accessToken:string|null = null;
	private static httpDriver:IHttpDriver = new AxiosHttpDriver();

	public static setAccessToken(accessToken:string|null):void {
		BaseApi.accessToken = accessToken;
	}

	public static setApiEndpoints(map:Record<ApiEndpoint, string>):void {
		BaseApi.baseUrlMap = {...map};
	}

	public static setHttpDriver(httpDriver:IHttpDriver):void {
		BaseApi.httpDriver = httpDriver;
	}

	protected static transformResponse<T>(response:HttpResponse<T>):T|ApiError {
		if (response.status >= 200 && response.status < 300)
			return response.data;
		return {
			error: true,
			statusCode: response.status,
			data: response.data
		};
	}

	protected static async getDefaultConfig(apiEndpoint:ApiEndpoint):Promise<HttpRequestConfig> {
		let headers:any = {
			'Content-Type': 'application/json'
		};

		const accessToken = BaseApi.accessToken;

		if (accessToken) {
			headers['Authorization'] = 'Bearer ' + accessToken;
		}

		return {
			baseURL: BaseApi.baseUrlMap[apiEndpoint],
			headers: headers
		};
	}

	protected static async post<TRequest = any,TResult = any>(url:string, request:TRequest, config:HttpRequestConfig):Promise<HttpResponse<TResult>> {
		return await BaseApi.httpDriver.post(url, request,config);
	}
}
