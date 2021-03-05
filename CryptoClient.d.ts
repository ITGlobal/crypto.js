import { ISignatureApplet, IUnpackResult, IPackOptions, IPromise, ICrutchBlob, ICrutchFile, ICertificate, ISignOptions, IVersionInfo, ICryptoProfiles, IDecryptOptions, IEncryptOptions } from './ISignatureApplet';
export declare class CryptoClient implements ISignatureApplet {
    private options;
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
     * Возвращает информацию о версии криптосервиса
     */
    getVersion(): IPromise<IVersionInfo>;
    /**
    * Возвращает информацию о криптографических профилях
    */
    getProfiles(): IPromise<ICryptoProfiles>;
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
    sign(data: Blob | ICrutchBlob, options?: ISignOptions, signature?: Blob | ICrutchBlob): IPromise<Blob | ICrutchBlob>;
    encrypt(data: Blob | ICrutchBlob, options: IEncryptOptions): IPromise<Blob | ICrutchBlob>;
    decrypt(data: Blob | ICrutchBlob, options: IDecryptOptions): IPromise<Blob | ICrutchBlob>;
    importCertificate(data: Blob): IPromise<void>;
    getHeadCert(): IPromise<ICertificate>;
    getHeadCertFor(args: ICryptoSessionParams): IPromise<ICertificate>;
    private executeSession<T>(method, path, data, success?);
    private whenSession<T>(func);
}
export interface ICryptoClientOptions {
    /**
     * Порт коммутатора
     * @default 48737
     */
    defaultPort?: number;
    /**
     * Порт крипто-сервиса
     * @default 48737
     */
    port?: {
        value;
    };
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
