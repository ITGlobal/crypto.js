import { IPromise, ICrutchBlob } from '../ISignatureApplet';
/**
 * Конвертирует {@type Blob} в строку {@type ICrutchBlob}, строку оставляет как есть
 * @param data
 */
export declare function toCrutchBlob(data: Blob | ICrutchBlob): IPromise<ICrutchBlob>;
export declare function send<T>(method: string, address: string, request: string, data: any, success?: (res: any) => T): IPromise<T>;
export declare function getOptions<T>(vals: T, defs: T): T;
