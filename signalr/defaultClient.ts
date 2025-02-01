import * as signalR from '@microsoft/signalr';

export default class DefaultClient {
    
    private _basePath:string;
    private _path:string;
    private _connection:signalR.HubConnection;

    constructor(basePath:string, path:string) {
        this._basePath = basePath;
        this._path = path;

        const connection:signalR.HubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this._basePath + this._path, { 
                logMessageContent: true,
                transport: signalR.HttpTransportType.WebSockets,
                skipNegotiation: true
            })
            .configureLogging(signalR.LogLevel.None)
            .build();        

        connection.onclose(() => {
            setTimeout(() => {
                this._startConnection(startError => {
                    if (startError) {
                        console.error(startError);
                    }
                });
            }, this._getRandomInterval(4000, 8000));
        });            

        this._connection = connection;
    }

    public onMessage<T>(methodName:string, newMethod:(event:T) => void ): void {
        this._connection.on(methodName, (e) => {
            newMethod(e);
        });
    }

    public startAsync(maxAttempts?:number, delay?:number): Promise<string> {
        return new Promise((resolve, reject) => {
            this._startConnection(error => {
                resolve(error);
            }, maxAttempts, delay);
        });
    }

    private  _getRandomInterval(min:number, max:number):number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    private _exponentialBackoff(promiseToTry:() => Promise<void>, maxAttempts:number, delay: number, callback:(error: string|null|undefined)=>void ): void {
        promiseToTry()
            .then(() => {
                callback(null);
            })
            .catch((reason) => {
                if (maxAttempts > 0) {
                    setTimeout(() => {
                        this._exponentialBackoff(promiseToTry, --maxAttempts, delay * 2, callback);
                    }, delay);                
                } else {
                    callback(reason);
                }
            });
    };

    private _startConnection(callback:(error:string) => void, maxAttempts?:number, delay?:number):void {
        maxAttempts = maxAttempts || 2;
        delay = delay || 500;
        
        this._exponentialBackoff(() => this._connection.start(), maxAttempts!, delay!, error => {
            if (error) {
                var extra = {
                    maxAttempts: maxAttempts,
                    delay: delay,
                    path: this._path
                };
                console.log('Failed to connect to Hub', extra);
                callback(error);
                return;
            }
        });
    };
}