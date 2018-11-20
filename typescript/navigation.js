"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Navigation = (function () {
    function Navigation(parentName, items) {
        if (items === void 0) { items = []; }
        this.parent = parentName;
        this.items = items;
    }
    Navigation.prototype.setParent = function (parentName) {
        this.parent = parentName;
    };
    Navigation.prototype.setItem = function (item) {
        this.items.push(item);
    };
    return Navigation;
}());
exports.Navigation = Navigation;
//# sourceMappingURL=navigation.js.map