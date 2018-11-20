"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavigationItem = (function () {
    function NavigationItem(name, link) {
        this.name = name;
        this.link = link;
    }
    NavigationItem.prototype.setName = function (name) {
        this.name = name;
    };
    NavigationItem.prototype.setLink = function (link) {
        this.link = link;
    };
    return NavigationItem;
}());
exports.NavigationItem = NavigationItem;
//# sourceMappingURL=navigation-item.js.map