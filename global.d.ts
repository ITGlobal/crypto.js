declare interface Window {
    new (): Window;
    prototype: Window;
    CryptoApi: ICryptoApi;
}

declare interface ICryptoApi {
    init(): Promise<any>;
    minVersion: string;
    getCryptoSystems(): Promise<any>;
    getProfiles(type: any): Promise<any>;
    getCertificateInfo(type: any, profile: any): Promise<any>;
    signString(type: any, profile: any, data: string, signature?: Blob): Promise<any>;
    signFile(type: any, profile: any, data: any, saveToDisk: boolean, fileName: string, signature?: Blob): Promise<any>;
    saveFile(filename: string, data: any): Promise<any>;
    createXmlRequest(type: any): Promise<any>;
    getXmlRequest(filepath: string): Promise<any>;
    createPKCSRequest(type: any, profile: any): Promise<any>;
    setActiveCertificate(profile: any, certificate: string, exportToLocalStore: boolean): Promise<any>;
    setActiveCertificateBase64(profile: any, certificate: any, exportToLocalStore: boolean): Promise<any>;
    importCertificate(type: any, profile: any, data: any): Promise<any>;
    importUpdate(type: any, profile: any, data: any): Promise<any>;
    checkInstalledCryptographyTypeCompliesTo(filePath: string): Promise<any>;
}

declare const CryptoApi: ICryptoApi;

/**
 * Наброски API унивесальной библиотеки
 */

/**
 * Тип криптопровадера
 */
declare const enum ProviderTypeEnum {
    CryptoServise = 'NSD_CS',
    MoexPlugin = 'MOEX_PLUGIN',
}
declare type ProviderType = {
    [index in ProviderTypeEnum]: string;
};

/**
 * Тип криптосистемы
 */
declare type CryptoSystem = 'RSA' | 'GOST';

/**
 * Параметры для открытия сессии
 */
declare interface ISessionOptions {
    /**
     * Тип криптосистемы
     */
    type: CryptoSystem;

    /**
     * Название профиля. Если не указано, то используется профиль по умолчанию.
     */
    profile?: string;
}

/**
 * Параметры для создания криптографического профиля
 */
declare interface IProfileCreateParameters {
    /**
     * Тип криптосистемы
     */
    type: CryptoSystem;

    /**
     * Название профиля
     */
    profile: string;

    /**
     * Рабочий сертификат
     */
    certificate: Blob;

    /**
     * Массив сертификатов ЦС
     */
    ca: Blob[];

    /**
     * Массив СОС
     */
    crl: Blob[];
}

/**
 * Криптопровайдер
 */
declare interface IProvider {
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
    openSession(options: ISessionOptions): Promise<ISession>;

    // /**
    //  * Открытие сессии криптопровайдера
    //  * @param type Тип криптосистемы
    //  * @param profile Название профиля. Если не указано, то используется профиль по умолчанию.
    //  * @returns Сессия криптопровайдера
    //  */
    // openSession(type: CryptoSystem, profile?: string): Promise<ISession>;

    /**
     * Сформировать криптографический профиль
     * @param parameters Параметры для создания криптографического профиля
     * @returns Сессия криптопровайдера
     */
    createProfile(parameters: IProfileCreateParameters): Promise<ISession>;
}

/**
 * Сессия криптопровайдера
 */
declare interface ISession {
    // /**
    //  * ID сессии
    //  */
    // id?: string;

    /**
     * Тип криптосистемы
     */
    type: CryptoSystem;

    /**
     * Название профиля
     */
    profile: string;

    /**
     * Получить рабочий сертификат
     * @returns Описание рабочего сертификата
     */
    getHeadCertificate(): Promise<ICertificate>;

    /**
     * Получить список сертификатов
     * @returns Список сертификатов
     */
    getCertificates(): Promise<ICertificate[]>;

    /**
     * Сгенерировать ЭЦП для строки текста
     * @param content Строка для подписи
     * @returns ЭЦП
     */
    signString(content: string, signature?: Blob): Promise<Blob>;

    /**
     * Сгенерировать ЭЦП для бинарных данных (файла)
     * @param content Данные для подписи
     * @returns ЭЦП
     */
    signFile(content: Blob, signature?: Blob): Promise<Blob>;

    /**
     * Записать файл на диск
     * @param filename Имя файла
     * @param content Содержимое файла
     * @returns Информация о записанном файле
     */
    saveFile(filename: string, content: Blob): Promise<IFile>;

    /**
     * Собрать CRY пакет
     * @param pkg Содержимое CRY пакета
     * @returns Зашифрованный CRY пакет
     */
    createCryPackage(pkg: ICryPackage): Promise<Blob>;

    /**
     * Разобрать CRY пакет
     * @param content Зашифрованный CRY пакет
     * @returns Содержимое CRY пакета
     */
    decryptCryPackage(content: Blob): Promise<ICryPackage>;

    /**
     * Создать ключ ЭЦП и XML-шаблон с соответствующим открытым ключом
     * @returns Данные XML шаблона
     */
    createXmlRequest(): Promise<IXmlRequest>;

    /**
     * Разобрать XML-шаблон с открытым ключом
     * @param filepath Путь к файлу шаблона
     * @returns Данные XML шаблона
     */
    getXmlRequest(filepath: string): Promise<IXmlRequest>;

    /**
     * Сгенерировать новый ключ ЭЦП и запрос на создание сертификата в формате PKCS#10,
     * подписанный на текущем рабочем сертификате
     * @returns Запрос на создание сертификата (в формате PKCS#10)
     */
    createPkcsRequest(): Promise<Blob>;

    /**
     * Добавить сертификат в локальный справочник и сделать его рабочим
     * @param certificate Сертификат
     * @param exportToStore Нужно ли экспортировать сертификат в системное хранилище
     */
    setActiveCertificate(certificate: Blob, exportToLocalStore?: boolean): Promise<void>;

    /**
     * Добавить сертификат в локальный справочник и сделать его рабочим
     * @param filepath Путь к файлу сертификата
     * @param exportToStore Нужно ли экспортировать сертификат в системное хранилище
     */
    setActiveCertificate(filepath: string, exportToLocalStore?: boolean): Promise<void>;

    /**
     * Импортировать сертификат
     * @param certificate Сертификат
     */
    importCertificate(certificate: Blob): Promise<void>;

    /**
     * Импортировать обновления от ЦР или ЦС через PSE файл
     * @param pseFile PSE файл
     */
    importUpdate(pseFile: Blob): Promise<void>;

    /**
     * Проверить, установлена ли на машине криптография, соответствующая сертификату
     * @param filepath Путь к файлу сертификата
     * @returns true, если соответствующий тип криптографии установлен
     */
    checkInstalledCryptographyTypeCompliesTo(filepath: string): Promise<boolean>;

    /**
     * Закрыть сессию криптопровайдера
     */
    closeSession(): Promise<void>;
}

/**
 * Данные XML-шаблона
 */
declare interface IXmlRequest {
    cspId: string;
    keyName: string;
    publicKey: Blob;
}

/**
 * Информация о сертификате
 */
declare interface ICertificate {
    /**
     * Идентификатор ключа, соответствующего сертификату
     */
    keyId: string;

    /**
     * Серийный номер сертификата
     */
    serialNumber: string;

    /**
     * x500 имя издателя
     */
    issuer: string;

    /**
     * x500 имя владельца
     */
    subject: string;

    /**
     * Список OID-ов расширенных использований ключа
     */
    extendedKeyUsages: string[];
}

/**
 * Информация о сертификате получателя.
 * По меньшей мере одно из полей @param keyId, @param serialNumber должно быть проставлено
 */
declare interface IRecipient {
    /**
     * Идентификатор ключа, соответствующего сертификату
     */
    keyId?: string;

    /**
     * Серийный номер сертификата
     */
    serialNumber?: string;
}

/**
 * Файл на диске
 */
declare interface IFile {
    /**
     * Имя файла
     */
    filename: string;

    /**
     * Полный путь к файлу
     */
    path: string;
}

/**
 * Описание CRY пакета
 */
declare interface ICryPackage {
    /**
     * Список файлов в пакете
     */
    files: ICryPackageFile[];

    /**
     * Список получателей пакета
     */
    recipients: IRecipient[];
}

/**
 * Файл в CRY пакете
 */
declare interface ICryPackageFile {
    /**
     * Имя файла
     */
    name: string;

    /**
     * Содержимое файла
     */
    content: Blob;
}
