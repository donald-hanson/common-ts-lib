import { HttpRequestConfig, HttpResponse, IHttpDriver } from "./httpDriver";
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export class AxiosHttpDriver implements IHttpDriver 
{
    async post<TRequest, TResult>(url: string, request: TRequest, config: HttpRequestConfig): Promise<HttpResponse<TResult>> {
        const axiosConfig:AxiosRequestConfig = {
            ...config, 
            validateStatus: null
        };
        return await axios.post(url, request, axiosConfig);
    }
}