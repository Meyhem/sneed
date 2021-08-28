"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
var yargs_1 = __importDefault(require("yargs"));
var config_1 = require("./config");
var errors_1 = require("./errors");
var file_system_1 = require("./file-system");
var init_1 = require("./init");
var templating_1 = require("./templating");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var cli, command, cfg, _a, config, vars;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    process.on('unhandledRejection', function (err) {
                        console.error(err);
                        console.error('Sneed crashed... If you this its a bug please submit an issue https://github.com/Meyhem/sneed/issues');
                        process.exit(1);
                    });
                    cli = yargs_1.default
                        .usage('Usage: $0 <template> [options] [variables]')
                        .command('init', 'initialize environment (create .sneedrc and templates folder)')
                        .command('<template>', 'scaffold a <template>', function (args) {
                        return args.demandCommand();
                    })
                        .demandCommand(1)
                        .option('override', {
                        type: 'boolean',
                        default: false,
                        description: 'turns off existing file protection (can override existing files). !DATA LOSS DANGER!'
                    })
                        .help('h')
                        .alias('h', 'help')
                        .example('$0', 'some_template --var1 4 --var2 7').argv;
                    command = cli._[0];
                    if (!(command === 'init')) return [3 /*break*/, 6];
                    cfg = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, config_1.loadConfig)()];
                case 2:
                    cfg = _b.sent();
                    console.log('Configuration found');
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    console.log('No configuration found, creating');
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, (0, init_1.initSneedEnvironment)(cfg, file_system_1.filesystem)];
                case 5:
                    _b.sent();
                    process.exit(0);
                    _b.label = 6;
                case 6: return [4 /*yield*/, (0, config_1.loadConfig)()];
                case 7:
                    config = _b.sent();
                    if (!lodash_1.default.includes(lodash_1.default.keys(config.commands), command)) return [3 /*break*/, 9];
                    vars = lodash_1.default.mapValues(lodash_1.default.omit(cli, ['_', '$0', 'override']), lodash_1.default.toString);
                    config.override = !!cli.override;
                    config.templateFolder = path_1.default.resolve(config.templateFolder);
                    return [4 /*yield*/, (0, templating_1.executeCommand)(command, vars, config, file_system_1.filesystem)];
                case 8:
                    _b.sent();
                    process.exit(0);
                    _b.label = 9;
                case 9: throw new errors_1.SneedError("Command '" + command + "' is not builtin or defined in config");
            }
        });
    });
}
main().catch(function (err) {
    if (err.isSneedError) {
        console.error(err.message);
        process.exit(1);
    }
    else {
        throw err;
    }
});
