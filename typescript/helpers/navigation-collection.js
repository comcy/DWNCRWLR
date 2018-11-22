"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavigationCollection = (function () {
    function NavigationCollection() {
        this.items = {};
        this.count = 0;
    }
    NavigationCollection.prototype.ContainsKey = function (key) {
        return this.items.hasOwnProperty(key);
    };
    NavigationCollection.prototype.Count = function () {
        return this.count;
    };
    NavigationCollection.prototype.Add = function (key, value) {
        if (!this.items.hasOwnProperty(key))
            this.count++;
        this.items[key] = value;
    };
    NavigationCollection.prototype.Remove = function (key) {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        return val;
    };
    NavigationCollection.prototype.Item = function (key) {
        return this.items[key];
    };
    NavigationCollection.prototype.Keys = function () {
        var keySet = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
        return keySet;
    };
    NavigationCollection.prototype.Values = function () {
        var values = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }
        return values;
    };
    return NavigationCollection;
}());
exports.NavigationCollection = NavigationCollection;
//# sourceMappingURL=navigation-collection.js.map