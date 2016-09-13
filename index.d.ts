import * as ko from "knockout";
export interface ModuleTemplateObservable extends ko.Observable<string> {
    data: any;
}
export interface ModuleSourceOptions {
    loadingTemplate?: string;
    afterRender?: () => any;
}
export declare class ModuleSource {
    source: string;
    options: ModuleSourceOptions;
    name: string;
    template: ModuleTemplateObservable;
    isLoading: boolean;
    isLoaded: boolean;
    constructor(source: string, options?: ModuleSourceOptions);
    static isModuleTemplateSource(value: string): boolean;
    text(): string;
    text(value: string): void;
    data(key: string): any;
    data(key: string, value: any): void;
    nodes(): Element;
    nodes(element: Element): void;
    loadTemplate(): void;
}
export interface ModuleEngineDefault {
    loading: string;
    engine: {
        new (): ko.templateEngine;
        prototype: ko.templateEngine;
    };
}
export declare class ModuleEngine extends ko.templateEngine {
    allowTemplateRewriting: boolean;
    private _innerEngine;
    static defaults: ModuleEngineDefault;
    constructor();
    constructor(innerEngine: ko.templateEngine);
    makeTemplateSource(template: any, templateDocument: Document, options?: any): any;
    renderTemplateSource(templateSource: any, bindingContext: ko.BindingContext<any>, options?: any): any;
    renderTemplate(template: any, bindingContext: ko.BindingContext<any>, options: any, templateDocument: any): any;
}
declare const defaultInstance: ModuleEngine;
/** Set ModuleEngine as default Knockout Template Engine using the Knockout Native Template Engine to process Module.JS Templates. */
export declare function setTemplateEngine(): void;
/**
 * Set ModuleEngine as default Knockout Template Engine.
 * @param innerEngine - Inner Engine to use to process Module.JS Templates.
 */
export declare function setTemplateEngine(innerEngine: ko.templateEngine): void;
/**
 * Init Method for boostrap module.
 * It installs ModuleEngine as default Knockout Template Engine.
 */
export declare function init(): void;
export default defaultInstance;
