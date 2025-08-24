export interface IPassword {
    username: string;
    secret: string;
    notes: string;
    otherKeys: Array<{
        key:string,
        value:string
    }>;
}
