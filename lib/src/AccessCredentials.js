class AccessCredentials {
    constructor(url, key, name, icon) {
        this.url = url || this.ToUri();
        this.key = key || AccessCredentials.GenerateKey();
        this.name = name;
        this.icon = icon;
    }
    static GenerateKey() {
        return Date.now().toString();
    }
    ToUri() {
        const queryParams = [
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
export { AccessCredentials };
//# sourceMappingURL=AccessCredentials.js.map