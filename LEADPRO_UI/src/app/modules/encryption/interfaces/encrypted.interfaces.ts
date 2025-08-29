export interface IEncryptionData {
    id: string;
    key: string;
    storedEncryptionData: string;
    storedIV: string;
    storedEncryptionAESKey: string;
}

export interface IEncryptionKey {
  id?: string;
  name: string;
  publicKey: string; 
}
