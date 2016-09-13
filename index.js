var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout", "@kospa/base/system"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = require("knockout");
    var system = require("@kospa/base/system");
    var SOURCE_REGEXP = /^text!(.+)/, sources = {};
    var ModuleSource = (function () {
        function ModuleSource(source, options) {
            if (options === void 0) { options = {}; }
            this.source = source;
            this.options = options;
            this.isLoading = false;
            this.isLoaded = false;
            if (typeof source !== "string") {
                throw new Error("Module Template Source need string template source");
            }
            if (sources[source]) {
                return sources[source];
            }
            this.name = source.match(SOURCE_REGEXP)[1];
            var tmpl = ko.observable(this.options.loadingTemplate || ModuleEngine.defaults.loading);
            tmpl.data = {};
            this.template = tmpl;
            if (options.afterRender) {
                var self_1 = this, origAfterRender_1 = options.afterRender;
                this.options.afterRender = function () {
                    if (self_1.isLoaded) {
                        origAfterRender_1.apply(self_1.options, arguments);
                    }
                };
            }
            sources[source] = this;
        }
        ModuleSource.isModuleTemplateSource = function (value) {
            return SOURCE_REGEXP.test(value);
        };
        ModuleSource.prototype.text = function (value) {
            if (!this.isLoaded)
                this.loadTemplate();
            if (arguments.length === 0) {
                return this.template();
            }
            else {
                this.template(arguments[0]);
            }
        };
        ModuleSource.prototype.data = function (key, value) {
            if (arguments.length === 1) {
                if (key === "precompiled")
                    this.template(); // register observable for auto template refresh
                return this.template.data[key];
            }
            this.template.data[key] = value;
        };
        ModuleSource.prototype.nodes = function (element) {
            if (arguments.length === 0) {
                var markup = this.text(); // to register dependency
                if (!this.template.data.__NODES__) {
                    this.template.data.__NODES__ = parseMarkup(markup);
                }
                return this.template.data.__NODES__;
            }
            else {
                this.template.data.__NODES__ = arguments[0];
            }
        };
        ModuleSource.prototype.loadTemplate = function () {
            var _this = this;
            if (this.isLoading) {
                return;
            }
            this.isLoading = true;
            system.module(this.source)
                .then(function (template) {
                _this.data("precompiled", null);
                _this.isLoaded = true;
                _this.isLoading = false;
                _this.template.data.__NODES__ = null;
                _this.template(template);
            });
        };
        return ModuleSource;
    }());
    exports.ModuleSource = ModuleSource;
    ko.templateSources["module"] = ModuleSource;
    var ModuleEngine = (function (_super) {
        __extends(ModuleEngine, _super);
        function ModuleEngine(innerEngine) {
            _super.call(this);
            this.allowTemplateRewriting = false;
            this._innerEngine = innerEngine || new ModuleEngine.defaults.engine();
        }
        ModuleEngine.prototype.makeTemplateSource = function (template, templateDocument, options) {
            // Module template
            if (typeof template === "string" && ModuleSource.isModuleTemplateSource(template)) {
                return new ko.templateSources["Module"](template, options);
            }
            //Call base method
            return this._innerEngine.makeTemplateSource.call(this._innerEngine, template, templateDocument);
        };
        ModuleEngine.prototype.renderTemplateSource = function (templateSource, bindingContext, options) {
            return this._innerEngine.renderTemplateSource.apply(this._innerEngine, arguments);
        };
        ModuleEngine.prototype.renderTemplate = function (template, bindingContext, options, templateDocument) {
            var templateSource = this.makeTemplateSource(template, templateDocument, options);
            return this.renderTemplateSource(templateSource, bindingContext, options);
        };
        ModuleEngine.defaults = {
            loading: "<div class=\"template-loading\"></div>",
            engine: ko.nativeTemplateEngine
        };
        return ModuleEngine;
    }(ko.templateEngine));
    exports.ModuleEngine = ModuleEngine;
    ko["moduleTemplateEngine"] = ModuleEngine;
    //#endregion
    //#region Public Base Members
    var defaultInstance = new ModuleEngine();
    function setTemplateEngine(innerEngine) {
        ko.setTemplateEngine(innerEngine ? new ModuleEngine(innerEngine) : defaultInstance);
    }
    exports.setTemplateEngine = setTemplateEngine;
    /**
     * Init Method for boostrap module.
     * It installs ModuleEngine as default Knockout Template Engine.
     */
    function init() {
        setTemplateEngine();
    }
    exports.init = init;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = defaultInstance;
    //#endregion
    function parseMarkup(markup) {
        var parser = new DOMParser();
        return parser.parseFromString(markup, "text/html").body;
    }
});
