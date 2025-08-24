export interface IEncryptionData {
  id: string;
  storedEncryptionData: string;
  storedIV: string;
  storedEncryptionAESKey: string;
}

export interface IEncryptionKey {
  user: string;
  publicKey: string; 
}
