export interface HttpRequestConfig
{
	baseURL: string
	headers: any
}

export interface HttpResponse<T = any> {
	data: T
	status: number
}

export interface IHttpDriver
{
    post<TRequest,TResult>(url:string, request:TRequest, config:HttpRequestConfig):Promise<HttpResponse<TResult>>
}