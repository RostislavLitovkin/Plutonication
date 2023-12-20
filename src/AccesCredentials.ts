// Class to use correct acces credential information in the wallet
export class AccessCredentials {
  public url: string;
  public key: string;
  public name?: string;
  public icon?: string;

  constructor(url?: string, key?: string, name?: string, icon?: string) {
    this.url = url || this.ToUri();
    this.key = key || AccessCredentials.GenerateKey();
    this.name = name;
    this.icon = icon;
  }
  
  static GenerateKey(): string {
    return Date.now().toString();
  }


  ToUri(): string {
    const queryParams: string[] = [
      `url=${encodeURIComponent(this.url)}`,
      `key=${encodeURIComponent(this.key)}`,
    ];

    if (this.name != null) {
      queryParams.push(`name=${encodeURIComponent(this.name)}`);
    }

    if (this.icon != null) {
      queryParams.push(`icon=${encodeURIComponent(this.icon)}`);
    }
    return `plutonication:?${queryParams.join("&")}`;
  }
}
