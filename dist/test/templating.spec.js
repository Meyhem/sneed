"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var templating_1 = require("../templating");
describe('prepareVariables', function () {
    test('maps default values', function () {
        var out = (0, templating_1.prepareVariables)({}, { scaffolds: [], edits: [], variables: { chucks: { default: 'Feed & Seed' } } });
        expect(out.chucks).toEqual('Feed & Seed');
    });
    test('adds helper functions to variables', function () {
        var out = (0, templating_1.prepareVariables)({}, { scaffolds: [], edits: [], variables: {} });
        expect(out.path).not.toBeUndefined();
        expect(out.casing).not.toBeUndefined();
        expect(out._).not.toBeUndefined();
    });
});
describe('assertVariablesReady', function () {
    test('passes prepared variables', function () {
        expect(function () { return (0, templating_1.assertVariablesReady)({ chuck: 'Feed & Seed' }); }).not.toThrow();
    });
    test('fals un-prepared variables', function () {
        expect(function () { return (0, templating_1.assertVariablesReady)({ chuck: undefined }); }).toThrow();
    });
});
describe('executeTemplateString', function () {
    test('renders const string', function () {
        var out = (0, templating_1.executeTemplateString)('Feed & Seed', {}, '');
        expect(out).toEqual('Feed & Seed');
    });
    test('renders with variable', function () {
        var out = (0, templating_1.executeTemplateString)('<%- name %> Feed & Seed', { name: "Chuck's" }, '');
        expect(out).toEqual("Chuck's Feed & Seed");
    });
    test('evaluates condition', function () {
        var out = (0, templating_1.executeTemplateString)('<% if (true) { %>Feed & Seed<% } %>', {}, '');
        expect(out).toEqual('Feed & Seed');
    });
});
