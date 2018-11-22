"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavigationItem = (function () {
    function NavigationItem(name, link, displayName) {
        if (displayName === void 0) { displayName = 'no name'; }
        this.name = name;
        this.link = link;
        if (displayName === 'no name')
            this.displayName = name;
        else
            this.displayName = displayName;
    }
    NavigationItem.prototype.setName = function (name) {
        this.name = name;
    };
    NavigationItem.prototype.setLink = function (link) {
        this.link = link;
    };
    NavigationItem.prototype.setDisplayName = function (displayName) {
        this.displayName = displayName;
    };
    return NavigationItem;
}());
exports.NavigationItem = NavigationItem;
//# sourceMappingURL=navigation-item.js.map