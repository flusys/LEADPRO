export interface IEncryptionData {
  id: string;
  storedEncryptionData: string;
  storedIV: string;
  storedEncryptionAESKey: string;
}

export interface IEncryptionKey {
  id: string;
  name: string;
  user: string;
  publicKey: string; 
}
