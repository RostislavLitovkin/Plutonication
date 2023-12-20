"use strict";
exports.__esModule = true;
// Class to use correct acces credential information in the wallet
var AccessCredentials = /** @class */ (function () {
    function AccessCredentials(url, key, name, icon) {
        this.url = url || this.ToUri();
        this.key = key || AccessCredentials.GenerateKey();
        this.name = name;
        this.icon = icon;
    }
    AccessCredentials.GenerateKey = function () {
        return Date.now().toString();
    };
    AccessCredentials.prototype.ToUri = function () {
        var queryParams = [
            "url=" + encodeURIComponent(this.url),
            "key=" + encodeURIComponent(this.key),
        ];
        if (this.name != null) {
            queryParams.push("name=" + encodeURIComponent(this.name));
        }
        if (this.icon != null) {
            queryParams.push("icon=" + encodeURIComponent(this.icon));
        }
        return "plutonication:?" + queryParams.join("&");
    };
    return AccessCredentials;
}());
exports.AccessCredentials = AccessCredentials;
