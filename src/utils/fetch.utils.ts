import Cookies from 'js-cookie';

export type RequestMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type FetchFunction = (input: RequestInfo | URL, init?: RequestInit | undefined) => {};

export interface Request<T = any> {
    url: string;
    method: RequestMethods;
    body: T | null;
    headers: object;
}

export interface Response<Data = any> {
    error: HttpException | null;
    data: Data;
    abort: AbortController;
}

export class HttpException implements Error {
    name: string;
    message: string;
    stack?: string | undefined;
    cause?: Error | undefined;
    response: globalThis.Response;

    constructor(response: globalThis.Response) {
        this.name = 'HttpException';
        this.message = response.statusText;
        this.response = response;
    }
}

export class RequestBuilder<BodyInterface = any> {
    _request: Request<BodyInterface> | null = null;
    _response: Response | null = null;

    _getBaseHeaders(): object {
        const baseHeaders = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${Cookies.get('Authorization')}`,
        };
        return baseHeaders;
    }

    get(url: string, headers: object = {}): Promise<Response> {
        this._request = {
            url: url,
            body: null,
            method: 'GET',
            headers: { ...this._getBaseHeaders(), ...headers },
        };

        return this.send();
    }

    post(url: string, body: BodyInterface | null = null, headers: object = {}): Promise<Response> {
        this._request = {
            url: url,
            body: body,
            method: 'POST',
            headers: { ...this._getBaseHeaders(), ...headers },
        };
        return this.send();
    }

    patch(url: string, body: BodyInterface | null = null, headers: object = {}): Promise<Response> {
        this._request = {
            url: url,
            body: body,
            method: 'PATCH',
            headers: { ...this._getBaseHeaders(), ...headers },
        };
        return this.send();
    }

    put(url: string, body: BodyInterface | null = null, headers: object = {}): Promise<Response> {
        this._request = {
            url: url,
            body: body,
            method: 'PUT',
            headers: { ...this._getBaseHeaders(), ...headers },
        };
        return this.send();
    }

    delete(url: string, body: BodyInterface | null = null, headers: object = {}): Promise<Response> {
        this._request = {
            url: url,
            body: body,
            method: 'DELETE',
            headers: { ...this._getBaseHeaders(), ...headers },
        };

        return this.send();
    }

    addHeader(header: object): void {
        this._request!.headers = { ...this._request!.headers, ...header };
    }

    initializeResponse() {
        this._response = {
            data: null,
            error: null,
            abort: new AbortController(),
        };
    }

    async send(): Promise<Response> {
        this.initializeResponse();

        try {
            const response = await fetch(`http://localhost:8000/api${this._request!.url}`, {
                method: this._request!.method,
                body: this._request!.body === null ? null : JSON.stringify(this._request!.body),
                headers: new Headers({ ...this._request!.headers }),
                signal: this._response!.abort.signal,
            });

            if (!response.ok) {
                const text = await response.json();

                console.log(response.status);

                if (response.status === 401 || response.status === 419) {
                    if (Cookies.get('Authorization')) {
                        Cookies.remove('Authorization');
                        window.location.replace('/');
                    }
                }

                if (typeof text.message === 'object') {
                    const message = Object.values(text.message as object).flatMap((msg: string[]) => msg.join(' '));

                    throw new HttpException({
                        ...response,
                        statusText: message.join(' '),
                    });
                }

                throw new HttpException({
                    ...response,
                    statusText: text.message,
                });
            }

            if (response.status !== 204) {
                this._response!.data = await response.json();
            }
        } catch (e) {
            this._response!.error = e as HttpException;
        }

        return this._response!;
    }
}
