import { IPromise } from './ISignatureApplet';
export declare class CryptoServiceProvider implements IProvider {
    private readonly type;
    private readonly baseUrl;
    constructor(options: any);
    /**
     * Текущая открытая сессия
     * @readonly
     */
    session: ISession;
    /**
     * Запрос версии провайдера
     * @returns Строка с номером версии
     */
    getVersion(): Promise<string>;
    /**
     * Получение установленных криптосистем
     * @returns Список установленных криптосистем
     */
    getCryptoSystems(): Promise<CryptoSystem[]>;
    /**
     * Получение списка профилей
     * @param type Тип криптосистемы
     * @returns Список названий профилей
     */
    getProfiles(type: CryptoSystem): Promise<string[]>;
    /**
     * Открытие сессии криптопровайдера
     * @param options Параметры для открытия сессии
     * @returns Сессия криптопровайдера
     */
    openSession(options: ISessionOptions | {
        id: string;
    }): Promise<ISession>;
    /**
     * Сформировать криптографический профиль
     * @param parameters Параметры для создания криптографического профиля
     * @returns Сессия криптопровайдера
     */
    createProfile(parameters: IProfileCreateParameters): Promise<ISession>;
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
