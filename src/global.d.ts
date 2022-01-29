declare type HttpResult<TData = unknown> = {
    status: 'success' | 'error' | 'fail';
    data?: TData;
    message?: string;
    code?: number;
}
