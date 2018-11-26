"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var ArrayListMultimap = (function () {
    function ArrayListMultimap() {
        this._entries = [];
    }
    ArrayListMultimap.prototype.clear = function () {
        this._entries = [];
    };
    ArrayListMultimap.prototype.containsKey = function (key) {
        return this._entries
            .filter(function (entry) { return entry.key === key; })
            .length > 0;
    };
    ArrayListMultimap.prototype.containsValue = function (value) {
        return this._entries
            .filter(function (entry) { return entry.value === value; })
            .length > 0;
    };
    ArrayListMultimap.prototype.containsEntry = function (key, value) {
        return this._entries
            .filter(function (entry) { return entry.key === key && entry.value === value; })
            .length > 0;
    };
    ArrayListMultimap.prototype.valueCount = function (key) {
        return this._entries
            .filter(function (entry) { return entry.key === key; })
            .length;
    };
    ArrayListMultimap.prototype.delete = function (key, value) {
        var temp = this._entries;
        this._entries = this._entries
            .filter(function (entry) {
            if (value)
                return entry.key !== key || entry.value !== value;
            return entry.key !== key;
        });
        return temp.length !== this._entries.length;
    };
    Object.defineProperty(ArrayListMultimap.prototype, "entries", {
        get: function () {
            return this._entries;
        },
        enumerable: true,
        configurable: true
    });
    ArrayListMultimap.prototype.get = function (key) {
        return this._entries
            .filter(function (entry) { return entry.key === key; })
            .map(function (entry) { return entry.value; });
    };
    ArrayListMultimap.prototype.keys = function () {
        return Array.from(new Set(this._entries.map(function (entry) { return entry.key; })));
    };
    ArrayListMultimap.prototype.put = function (key, value) {
        this._entries.push(new models_1.MultimapEntry(key, value));
        return this._entries;
    };
    return ArrayListMultimap;
}());
exports.ArrayListMultimap = ArrayListMultimap;
//# sourceMappingURL=arraylist-multimap.js.map