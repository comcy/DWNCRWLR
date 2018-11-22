"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavigationItem = (function () {
    function NavigationItem(name, link, displayName) {
        this.name = name;
        this.link = link;
        this.displayName = displayName === '' ? 'no name' : displayName;
    }
    NavigationItem.prototype.setName = function (name) {
        this.name = name;
    };
    NavigationItem.prototype.setLink = function (link) {
        this.link = link;
    };
    NavigationItem.prototype.setDisplayName = function (displayName) {
        this.displayName = displayName === '' ? 'no name' : displayName;
    };
    return NavigationItem;
}());
exports.NavigationItem = NavigationItem;
//# sourceMappingURL=navigation-item.js.map