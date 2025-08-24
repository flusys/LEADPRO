export interface IEncryptedPassword {
    id: string;
    storedEncryptedData: string;
    storedIV: string;
    storedEncryptedAESKey: string;
}
