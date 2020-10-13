"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SneedError = void 0;
var SneedError = /** @class */ (function (_super) {
    __extends(SneedError, _super);
    function SneedError(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = 'SneedError';
        _this.isSneedError = true;
        return _this;
    }
    return SneedError;
}(Error));
exports.SneedError = SneedError;
