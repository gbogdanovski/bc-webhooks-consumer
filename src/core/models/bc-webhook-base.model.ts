export interface BcWebHookBaseModel<T> {
    scope: string;
    store_id: string;
    hash: string;
    created_at: number;
    producer: string;
    data: T;
}