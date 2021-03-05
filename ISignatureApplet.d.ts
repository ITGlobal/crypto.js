/**
 * Интерфейс криптографического апплета для Validata CSP. Требования к реализации:
 * 1. Вызов любого метода должен завершаться моментально (< 10мс) независимо от входных параметров.
 *    Сама же операция может занимать длительное время.
 * 2. Во время выполнения операции не должно происходить длительных синхронных вызовов из JavaScript.
 *    Это может приводить к "залипанию" UI.
 * 3. Длительные операции (> 1c) рекомендуется сопровождать уведомлениями о прогрессе
 *    {@link IPromise#progress}.
 */
export interface ISignatureApplet {
    /**
     * Формирует CRY-пакет. Файлы подписываются головой, пакет шифруется указанным сертификатом.
     * @param files файлы для упаковки
     * @param options опции формирования CRY-пакета
     * @returns CRY-пакет
     */
    pack(files: File[] | ICrutchFile[], options: IPackOptions): IPromise<Blob | ICrutchBlob>;
    /**
     * Распаковывает CRY-пакет. Пакет расшифровывается головой.
     * @param buffer CRY-пакет
     * @returns распакованные файлы
     */
    unpack(buffer: Blob | ICrutchBlob): IPromise<IUnpackResult>;
    /**
     * Возвращает список актуальных сертификатов из справочника
     * @returns список сертификатов
     */
    getCerts(): IPromise<ICertificate[]>;
    /**
     * Подписывает данные
     * @param data данные
     * @param options опции подписи
     * @returns подпись
     */
    sign(data: Blob | ICrutchBlob, options?: ISignOptions, signature?: Blob | ICrutchBlob): IPromise<Blob | ICrutchBlob>;
    /**
     * Возвращает сертификат подписи (голову)
     */
    getHeadCert(): IPromise<ICertificate>;
    /**
     * Зашифровать данные с возможностью указать получателей
     */
    encrypt(data: Blob | ICrutchBlob, options: IEncryptOptions): IPromise<Blob | ICrutchBlob>;
    /**
     * Расшифровать данные
     */
    decrypt(data: Blob | ICrutchBlob, options: IDecryptOptions): IPromise<Blob | ICrutchBlob>;
}
/**
 * Опции формирования CRY-пакета {@link ISignatureApplet#pack}
 */
export interface IPackOptions {
    /**
     * Сертификат шифрования
     */
    certificate: ICertificateKeyId | ICertificateSerialNumber;
}
/**
 * Результат распаковки CRY-пакета {@link ISignatureApplet#unpack}
 */
export interface IUnpackResult {
    /**
     * Распакованные файлы
     */
    files: File[] | ICrutchFile[];
    /**
     * Сертификаты получателей
     */
    recipients: ICertificateId[];
}
/**
 * Опции подписи {@link ISignatureApplet#sign}
 */
export interface ISignOptions {
    /**
     * См. документацию по API справочника
     * @default false
     */
    pkcs7?: boolean;
    /**
     * Сформировать отсоединенную подпись (без подписываемых данных)
     * @default false подпись с подписываемыми данными
     */
    detached?: boolean;
    /**
     * Приложить сертификат
     * @default false
     */
    sendCertificate?: boolean;
    /**
     * См. документацию по API справочника
     * @default false
     */
    sendChain?: boolean;
}
/**
 * Запрос шифрования {@link ISignatureApplet#encrypt}
 */
export interface IEncryptRequest {
    /**
     * Опции шифрования
     */
    options: IEncryptOptions;
}
/**
 * Опции шифрования {@link ISignatureApplet#encrypt}
 */
export interface IEncryptOptions {
    /**
     * См. документацию по API справочника
     * @default false
     */
    pkcs7?: boolean;
    /**
     * См. документацию по API справочника
     * @default 0 (NO_FLAGS)
     */
    flags: number;
    /**
     * Список серийных номеров сертификатов получателей
     */
    receivers: string[];
}
/**
 * Запрос шифрования {@link ISignatureApplet#decrypt}
 */
export interface IDecryptRequest {
    /**
     * Опции шифрования
     */
    options: IDecryptOptions;
}
/**
 * Опции шифрования {@link ISignatureApplet#encrypt}
 */
export interface IDecryptOptions {
    /**
     * См. документацию по API справочника
     * @default false
     */
    pkcs7?: boolean;
    /**
     * См. документацию по API справочника
     * @default 0 (NO_FLAGS)
     */
    flags: number;
}
/**
 * Идентификатор закрытого ключа
 */
export interface ICertificateKeyId {
    /**
     * Идентификатор закрытого ключа
     */
    keyId: string;
}
/**
 * Серийный номер сертификата
 */
export interface ICertificateSerialNumber {
    /**
     * Серийный номер сертификата
     */
    serialNumber: string;
}
/**
 * Идентификатор сертификата
 */
export interface ICertificateId extends ICertificateKeyId, ICertificateSerialNumber {
}
/**
 * Сертификат
 */
export interface ICertificate extends ICertificateId {
    /**
     * Издатель
     */
    issuer: ICertificateParty;
    /**
     * Владелец
     */
    subject: ICertificateParty;
}
/**
 * Сторона сертификата
 */
export interface ICertificateParty {
    /**
     * Организация
     */
    organization: string;
    /**
     * Фамилия
     */
    surname: string;
}
/**
 * Выполняемая операция
 */
export interface IPromise<TResult> {
    /**
     * Устанавливает обработчики событий
     * @param done операция успешно завершена
     * @param fail операция завершена с ошибкой
     * @param progress операция выполняется
     */
    then(done: (result: TResult) => any, fail?: (error: IError) => any, progress?: (progress: IProgress) => any): any;
}
/**
 * Сообщение об ошибке
 */
export interface IError {
    /**
     * Код ошибки
     */
    code: string;
    /**
     * Описание ошибки
     */
    message: string;
    /**
     * Дополнительные параметры
     */
    args?: {
        [key: string]: any;
    };
    /**
     * URL с детальным описанием проблемы и способом ее устранения
     */
    url?: string;
}
/**
 * Уведомление о прогрессе.
 * Процент выполненного считается так: {@link IProgress#current} / {@link IProgress#end} * 100.
 */
export interface IProgress {
    /**
     * Текущее значение
     */
    current: number;
    /**
     * Конечное значение
     */
    end: number;
}
/**
 * Интерфейс файла, используемый в качестве альтернативы {@type Blob}
 * в браузерах без поддержки File API (например, IE9-).
 */
export interface ICrutchBlob {
    /**
     * Содержимое файла
     */
    content: string;
    /**
     * MIME-тип файла
     */
    type?: string;
    /**
     * Кодировка файла: base64, utf-8, windows-1251, ...
     * Значение base64 означает, что содержимое файла представлено в строке {@link ICrutchFile#content}
     * в формате base64.
     */
    encoding: string;
}
/**
 * Интерфейс файла, используемый в качестве альтернативы {@type File}
 * в браузерах без поддержки File API (например, IE9-).
 */
export interface ICrutchFile extends ICrutchBlob {
    /**
     * Имя файла
     */
    name: string;
}
/**
 * Информация о версии криптосервиса
 */
export interface IVersionInfo {
    /**
     * Номер версии криптосервиса
     */
    version: string;
}
/**
 * Информация о криптографических профилях
 */
export interface ICryptoProfiles {
    /**
     * Доступные криптографические профили RSA
     */
    rsa: string[];
    /**
     * Доступные криптографические профили ГОСТ
     */
    gost: string[];
}
export interface ICSResponse<TContent> {
    content: TContent;
    status: number;
}
