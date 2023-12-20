export declare class AccessCredentials {
    url: string;
    key: string;
    name?: string;
    icon?: string;
    constructor(url?: string, key?: string, name?: string, icon?: string);
    static GenerateKey(): string;
    ToUri(): string;
}
