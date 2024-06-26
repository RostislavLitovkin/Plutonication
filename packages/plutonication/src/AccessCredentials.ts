/**
 * Class to use correct acces credential information in the wallet
 */
class AccessCredentials {
  public url: string;
  public key: string;
  public name?: string;
  public icon?: string;
  public plutoLayout?: string;

  /**
   * Constructor of the AccessCredentials class.
   * @param {string} url - URL for the credentials.
   * @param {string} [name] - Optional name for the credentials.
   * @param {string} [icon] - Optional icon for the credentials.
   * @param {string} [plutoLayout] - Optional plutoLayout for the credentials.
   */
  constructor(url: string, name?: string, icon?: string, plutoLayout?: string) {
    this.url = url;
    this.key = AccessCredentials.GenerateKey();
    this.name = name;
    this.icon = icon;
    this.plutoLayout = plutoLayout;
  }

  /**
  * Helper method that generates a random key.
  * @returns random key
  */
  static GenerateKey(): string {
    if(typeof crypto !== "undefined"){
      return crypto.randomUUID()
    }

    // Used only for tests
    return Date.now().toString()
  }

  /**
   * Converts the credentials into a URI string to be used in the Plutonication application.
   * @returns The URI string generated from the credentials.
   */
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

    if (this.plutoLayout != null) {
      queryParams.push(`plutolayout=${encodeURIComponent(this.plutoLayout)}`);
    }

    return `plutonication:?${queryParams.join("&")}`;
  }
}

export { AccessCredentials };
