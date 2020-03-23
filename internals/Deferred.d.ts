import { IPromise, IError, IProgress } from '../ISignatureApplet';
export declare class Deferred<TResult> implements IPromise<TResult> {
    protected handlers: Array<Function>[];
    protected result: any;
    protected resolution: number;
    then(done: (result: TResult) => any, fail?: (error: IError) => any, progress?: (progress: IProgress) => any): any;
    resolve(result: TResult): void;
    reject(error: IError): void;
    notify(progress: IProgress): void;
    protected handle(funcIndex: number): void;
}
