declare class AccessCredentials {
    url: string;
    key: string;
    name?: string;
    icon?: string;
    constructor(url?: string, key?: string, name?: string, icon?: string);
    static GenerateKey(): string;
    ToUri(): string;
}
declare class PlutonicationModal extends HTMLElement {
    generateButton: HTMLElement;
    welcomeHeader: HTMLElement;
    qrCodeDiv: HTMLElement;
    scanQrContainer: HTMLElement;
    qrContainer: HTMLElement;
    scanText: HTMLElement;
    connectionInfoDiv: HTMLElement;
    disconnectBtn: HTMLElement;
    backToConnectBtn: HTMLElement;
    constructor();
    generateQRCode(text: any, width: any, height: any): HTMLCanvasElement;
    generateQRMatrix(text: any): any[];
    generarQR(text: any): void;
    showQR(accesCredentials: AccessCredentials): void;
    hideQR(): void;
}
export { PlutonicationModal };
