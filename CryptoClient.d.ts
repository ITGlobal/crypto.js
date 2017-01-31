import { ISignatureApplet, IUnpackResult, IPackOptions, IPromise, ICrutchBlob, ICrutchFile, ICertificate, ISignOptions } from './ISignatureApplet';
export declare class CryptoClient implements ISignatureApplet {
    private readonly settings;
    private readonly baseUrl;
    private sessionPromise;
    static settings: ICryptoClientOptions;
    /**
     * Текущая открытая сессия
     * @readonly
     */
    session: ICryptoSession;
    constructor(options?: ICryptoClientOptions);
    /**
     * Возвращает список установленных справочников сертификатов: 'GOST' и/или 'RSA'
     */
    getTypes(): IPromise<string[]>;
    /**
     * Открывает сессию. Пытается открыть существующую сессию, если указан {@type ICryptoSessionId индентификатор}.
     * Затем пытается открыть новую сессию, если указаны {@type ICryptoSessionParams параметры}.
     * @param args идентификатор и/или параметры сессии
     * @returns открытая сессия
     */
    open(args: ICryptoSessionId | ICryptoSessionParams): IPromise<ICryptoSession>;
    /**
     * Закрывает сессию
     * @returns закрытая сессия
     */
    close(): IPromise<ICryptoSession>;
    pack(files: File[] | ICrutchFile[], options: IPackOptions): IPromise<Blob | ICrutchBlob>;
    unpack(buffer: Blob | ICrutchBlob): IPromise<IUnpackResult>;
    getCerts(): IPromise<ICertificate[]>;
    sign(data: Blob | ICrutchBlob, options?: ISignOptions): IPromise<Blob | ICrutchBlob>;
    getHeadCert(): IPromise<ICertificate>;
    private send<T>(path, data, success?);
    private whenSession<T>(func);
}
export interface ICryptoClientOptions {
    /**
     * Порт крипто-сервиса
     * @default 48737
     */
    port?: number;
    /**
     * Использовать объекты File API: Blob, File - в результатах методов
     * @default false
     * @todo реализовать опцию
     */
    useFileApi?: boolean;
    /**
     * Функция преобразования объектов {@type IPromise}
     * @default identity функция, возвращающая первый параметр
     */
    transformPromise?: <T>(promise: IPromise<T>) => IPromise<T>;
    /**
     * Делать запросы к серверу по HTTP
     * @default false
     */
    noSsl?: boolean;
}
/**
 * Идентификатор сессии
 */
export interface ICryptoSessionId {
    /**
     * Идентификатор
     */
    id: string;
}
/**
 * Параметры сессии
 */
export interface ICryptoSessionParams {
    /**
     * Тип криптографии: 'GOST' или 'RSA'
     */
    type: string;
    /**
     * Профиль
     * @default 'My'
     */
    profile?: string;
}
/**
 * Сессия
 */
export interface ICryptoSession extends ICryptoSessionId {
    id: string;
    type: string;
    profile: string;
}
