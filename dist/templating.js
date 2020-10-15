"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCommand = exports.executeEdits = exports.executeScaffolds = exports.executeTemplateString = exports.assertVariablesReady = exports.prepareVariables = void 0;
var lodash_1 = __importDefault(require("lodash"));
var ejs_1 = __importDefault(require("ejs"));
var path_1 = __importDefault(require("path"));
var casing = __importStar(require("change-case"));
var errors_1 = require("./errors");
function prepareVariables(variables, cmd) {
    return __assign(__assign({}, lodash_1.default.defaultsDeep(variables, lodash_1.default.mapValues(cmd.variables, function (v) { return v.default; }))), { casing: casing, path: path_1.default, _: lodash_1.default });
}
exports.prepareVariables = prepareVariables;
function assertVariablesReady(variables) {
    lodash_1.default.forEach(variables, function (v, k) {
        if (lodash_1.default.isUndefined(v)) {
            throw new errors_1.SneedError("Variable '" + k + "' is not defined. Either pass cli argument '--" + k + " your_value' or add 'default' value in command variables config");
        }
    });
}
exports.assertVariablesReady = assertVariablesReady;
function executeTemplateString(templateString, variables, templateFolder) {
    return ejs_1.default.render(templateString, variables, {
        filename: path_1.default.join(templateFolder, 'sneed-execution'),
        root: templateFolder
    });
}
exports.executeTemplateString = executeTemplateString;
function executeScaffolds(cmd, variables, config, fs) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, scaffold, templatePath, targetPath, renderedTemplatePath, renderedTargetPath, _c, template, renderedTemplate, dir, e_1_1;
        var e_1, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 11, 12, 13]);
                    _a = __values(cmd.scaffolds), _b = _a.next();
                    _e.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 10];
                    scaffold = _b.value;
                    templatePath = path_1.default.join(config.templateFolder, scaffold.template);
                    targetPath = scaffold.target;
                    renderedTemplatePath = void 0;
                    renderedTargetPath = void 0;
                    try {
                        renderedTemplatePath = executeTemplateString(templatePath, variables, config.templateFolder);
                    }
                    catch (e) {
                        throw new errors_1.SneedError("'template' path '" + templatePath + "' contains EJS error: " + e.message);
                    }
                    try {
                        renderedTargetPath = executeTemplateString(targetPath, variables, config.templateFolder);
                    }
                    catch (e) {
                        throw new errors_1.SneedError("'target' path '" + targetPath + "' contains EJS error: " + e.message);
                    }
                    return [4 /*yield*/, fs.exists(renderedTemplatePath)];
                case 2:
                    if (!(_e.sent())) {
                        throw new errors_1.SneedError("'template' file '" + renderedTemplatePath + "' does not exist");
                    }
                    _c = !config.override;
                    if (!_c) return [3 /*break*/, 4];
                    return [4 /*yield*/, fs.exists(renderedTargetPath)];
                case 3:
                    _c = (_e.sent());
                    _e.label = 4;
                case 4:
                    if (_c) {
                        throw new errors_1.SneedError("Target file '" + renderedTargetPath + "' already exists. Refusing to override to prevent data loss. Use option '--override' if this is intentional");
                    }
                    return [4 /*yield*/, fs.readFile(renderedTemplatePath)];
                case 5:
                    template = _e.sent();
                    renderedTemplate = void 0;
                    try {
                        renderedTemplate = executeTemplateString(template, variables, config.templateFolder);
                    }
                    catch (e) {
                        throw new errors_1.SneedError("Template file '" + renderedTemplatePath + "' contains EJS error: " + e.message);
                    }
                    dir = path_1.default.parse(renderedTargetPath).dir;
                    if (!dir) return [3 /*break*/, 7];
                    return [4 /*yield*/, fs.createDir(dir)];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7: return [4 /*yield*/, fs.writeFile(renderedTargetPath, renderedTemplate)];
                case 8:
                    _e.sent();
                    console.log("+ " + renderedTargetPath);
                    _e.label = 9;
                case 9:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 10: return [3 /*break*/, 13];
                case 11:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 12:
                    try {
                        if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.executeScaffolds = executeScaffolds;
function executeEdits(cmd, variables, config, fs) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, edit, templatePath, renderedTemplatePath, renderedTargetPath, renderedMark, template, renderedTemplate, editedFile, replaceBy, editedResult, e_2_1;
        var e_2, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 9, 10, 11]);
                    _a = __values(cmd.edits), _b = _a.next();
                    _d.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 8];
                    edit = _b.value;
                    templatePath = path_1.default.join(config.templateFolder, edit.template);
                    renderedTemplatePath = void 0;
                    renderedTargetPath = void 0;
                    renderedMark = void 0;
                    try {
                        renderedTemplatePath = executeTemplateString(templatePath, variables, config.templateFolder);
                    }
                    catch (e) {
                        throw new errors_1.SneedError("'template' path '" + templatePath + "' contains EJS error: " + e.message);
                    }
                    try {
                        renderedTargetPath = executeTemplateString(edit.target, variables, config.templateFolder);
                    }
                    catch (e) {
                        throw new errors_1.SneedError("'target' path '" + edit.target + "' contains EJS error: " + e.message);
                    }
                    try {
                        renderedMark = executeTemplateString(edit.mark, variables, config.templateFolder);
                    }
                    catch (e) {
                        throw new errors_1.SneedError("'mark' path '" + edit.mark + "' contains EJS error: " + e.message);
                    }
                    return [4 /*yield*/, fs.exists(renderedTemplatePath)];
                case 2:
                    if (!(_d.sent())) {
                        throw new errors_1.SneedError("'template' file '" + renderedTemplatePath + "' does not exist");
                    }
                    return [4 /*yield*/, fs.exists(renderedTargetPath)];
                case 3:
                    if (!(_d.sent())) {
                        throw new errors_1.SneedError("'target' file '" + renderedTargetPath + "' does not exist");
                    }
                    return [4 /*yield*/, fs.readFile(renderedTemplatePath)];
                case 4:
                    template = _d.sent();
                    renderedTemplate = void 0;
                    try {
                        renderedTemplate = executeTemplateString(template, variables, config.templateFolder);
                    }
                    catch (e) {
                        throw new errors_1.SneedError("Template '" + renderedTemplatePath + "' contains EJS error: " + e.message);
                    }
                    return [4 /*yield*/, fs.readFile(renderedTargetPath)];
                case 5:
                    editedFile = _d.sent();
                    replaceBy = void 0;
                    switch (edit.editType) {
                        case 'insertAfter':
                            replaceBy = renderedMark + renderedTemplate;
                            break;
                        case 'insertBefore':
                            replaceBy = renderedTemplate + renderedMark;
                            break;
                        case 'replace':
                            replaceBy = renderedTemplate;
                            break;
                        default:
                            throw new Error('unreachable');
                    }
                    editedResult = editedFile.replace(renderedMark, replaceBy);
                    return [4 /*yield*/, fs.writeFile(renderedTargetPath, editedResult)];
                case 6:
                    _d.sent();
                    console.log("~ " + renderedTargetPath);
                    _d.label = 7;
                case 7:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 8: return [3 /*break*/, 11];
                case 9:
                    e_2_1 = _d.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 11];
                case 10:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.executeEdits = executeEdits;
function executeCommand(command, variables, config, fs) {
    return __awaiter(this, void 0, void 0, function () {
        var cmd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cmd = config.commands[command];
                    variables = prepareVariables(variables, cmd);
                    assertVariablesReady(variables);
                    return [4 /*yield*/, executeScaffolds(cmd, variables, config, fs)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, executeEdits(cmd, variables, config, fs)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.executeCommand = executeCommand;
