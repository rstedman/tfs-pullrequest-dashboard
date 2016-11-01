/**
    These interfaces are copied from the vss-web-extension-sdk node module.
    This is an ugly hack to work around issues that Typescript 2 seems to currently have
    with the type defnitions defined there
**/

// Type definitions for Microsoft Visual Studio Services v106.20161010.0629
// Project: https://www.visualstudio.com/integrate/extensions/overview
// Definitions by: Microsoft <vsointegration@microsoft.com>

   /// <reference path='./knockout/knockout.d.ts' />
   /// <reference path='./jquery/jquery.d.ts' />
   /// <reference path='./q/q.d.ts' />
   /// <reference path='./requirejs/require.d.ts' />

//----------------------------------------------------------
// Common interfaces specific to WebPlatform area
//----------------------------------------------------------

/**
* VSS-specific options for VSS ajax requests
*/
interface IVssAjaxOptions {

    /*
    * Auth token manager that can be used to get and attach auth tokens to requests
    */
    authTokenManager?: IAuthTokenManager<any>;

    /**
     * If true, textStatus and jqXHR are added to the success callback. In this case, spread (instead of then) needs to be used (default false).
     */
    useAjaxResult?: boolean;

    /**
     * If true, the progress indicator will be shown while the request is executing. Defaults to true.
     */
    showProgressIndicator?: boolean;

    /**
     * Current session id. Defaults to pageContext.diagnostics.sessionId.
     */
    sessionId?: string;

    /**
     * Current command for activity logging.
     */
    command?: string;
}

/**
* Event listener for VSS ajax events. Gets notified before and after each request
*/
interface IVssAjaxEventListener {

    /**
    * Method invoked before a request is sent
    *
    * @param requestId A unique id that can be used to track this particular request (id is unique among all clients)
    * @param requestUrl Url of the request that is about to be issued
    * @param ajaxOptions Ajax settings/options for the request
    * @param vssRequestOptions Additional VSS-specific options supplied in the request
    */
    beforeRequest?: (requestId: number, requestUrl: string, ajaxOptions: JQueryAjaxSettings, vssRequestOptions: IVssAjaxOptions) => void;

    /**
    * Method invoked when a response has been received
    *
    * @param requestId A unique id that can be used to track this particular request (id is unique among all clients)
    * @param data The response data
    * @param textStatus A string indicating status of the request
    * @param jqXHR: The jQuery XHR object for the request
    * @param vssRequestOptions Additional VSS-specific options supplied in the request
    */
    responseReceived?: (requestId: number, data: any, textStatus: string, jqXHR: JQueryXHR, vssRequestOptions: IVssAjaxOptions) => void;

    /**
    * Method invoked after a response has been received and its callback/promise has been invoked
    *
    * @param requestId A unique id that can be used to track this particular request (id is unique among all clients)
    * @param data The response data
    * @param textStatus A string indicating status of the request
    * @param jqXHR: The jQuery XHR object for the request
    * @param vssRequestOptions Additional VSS-specific options supplied in the request
    */
    postResponseCallback?: (requestId: number, data: any, textStatus: string, jqXHR: JQueryXHR, vssRequestOptions: IVssAjaxOptions) => void;
}

/**
* Interface for a class that can fetch auth tokens to be used in AJAX requests.
*/
interface IAuthTokenManager<TToken> {

    /**
    * Get the auth token to use for this request.
    *
    * @param refresh If true refresh the token (i.e. request a new one - don't use a cached token)
    */
    getAuthToken(refresh?: boolean): IPromise<TToken>;

    /**
     * Gets the authorization header to use in a request from the given token
     *
     * @param sessionToken Used for token key.
     * @return the value to use for the Authorization header in a request.
     */
    getAuthorizationHeader(sessionToken: TToken): string;
}

/**
* A promise represents the eventual result of an asynchronous operation. The primary way of interacting with a promise is through its then method,
* which registers callbacks to receive either a promise’s eventual value or the reason why the promise cannot be fulfilled.
*/
interface IPromise<T> {
    /**
     * Then method which accepts a fulfill delegate which returns a promise or nothing and a reject delegate which returns a promise or nothing. Then returns a new promise.
     */
    then<U>(onFulfill: (value: T) => IPromise<U> | void, onReject?: (reason: any) => IPromise<U> | void): IPromise<U>;

    /**
     * Then method which accepts a fulfill delegate which returns a promise or nothing and a reject delegate which returns a reason value or nothing. Then returns a new promise.
     */
    then<U>(onFulfill: (value: T) => IPromise<U> | void, onReject?: (reason: any) => U | void): IPromise<U>;

    /**
     * Then method which accepts a fulfill delegate which returns a value or nothing and a reject delegate which returns a promise or nothing. Then returns a new promise.
     */
    then<U>(onFulfill: (value: T) => U | void, onReject?: (reason: any) => IPromise<U> | void): IPromise<U>;

    /**
     * Then method which accepts a fulfill delegate which returns a value or nothing and a reject delegate which returns a reason value or nothing. Then returns a new promise.
     */
    then<U>(onFulfill: (value: T) => U | void, onReject?: (reason: any) => U | void): IPromise<U>;
}
interface EventTarget {
    checked: boolean;
    nodeType: number;
}

interface Date {
    toGMTString(): string;
}

interface IErrorCallback {
    (error: any): void;
}

interface IResultCallback extends Function {
}

interface IArgsFunctionR<TResult> {
    (...args: any[]): TResult;
}

interface IFunctionPR<TParam, TResult> {
    (param: TParam): TResult;
}

interface IFunctionPPR<TParam1, TParam2, TResult> {
    (param1: TParam1, param2: TParam2): TResult;
}

interface IFunctionPPPR<TParam1, TParam2, TParam3, TResult> {
    (param1: TParam1, param2: TParam2, param3: TParam3): TResult;
}

interface IComparer<T> extends IFunctionPPR<T, T, number> {
}

interface IDictionaryStringTo<T> {
    [key: string]: T;
}

interface IDictionaryNumberTo<T> {
    [key: number]: T;
}

interface IEventHandler extends Function {
}

interface IWebApiArrayResult {
    count: number;
    value: any[];
}

interface Window {
    ActiveXObject: any;
    DOMParser: any;
    XSLTProcessor: any;
    vsSdkOnLoad:() => void;
}

interface ServerError {
    typeKey?: string;
}

interface TfsError extends Error {
    status?: string;
    stack?: string;
    serverError?: ServerError;
    [key: string]: any;
}

//These variables defined by server.
declare var exports: any;

declare var _disabledPlugins: string[];

interface IWebAccessPlugin {
    namespace: string;
    loadAfter: string;
}

declare var _plugins: IWebAccessPlugin[];
declare var _builtinPlugins: IWebAccessPlugin[];

interface IWebAccessPluginBase {
    namespace: string;
    base: string;
}

declare var _builtInBases: IWebAccessPluginBase[];
declare var _bases: IWebAccessPluginBase[];

interface IDisposable {
    dispose(): void;
}

interface IKeyValuePair<TKey, TValue> {
    key: TKey;
    value: TValue;
}

declare var require: Require;
declare var define: RequireDefine;
//----------------------------------------------------------
// Common interfaces specific to WebPlatform area
//----------------------------------------------------------

/**
* Interface for a single XDM channel
*/
interface IXDMChannel {

    /**
    * Invoke a method via RPC. Lookup the registered object on the remote end of the channel and invoke the specified method.
    *
    * @param method Name of the method to invoke
    * @param instanceId unique id of the registered object
    * @param params Arguments to the method to invoke
    * @param instanceContextData Optional context data to pass to a registered object's factory method
    */
    invokeRemoteMethod<T>(methodName: string, instanceId: string, params?: any[], instanceContextData?: Object): IPromise<T>;

    /**
    * Get a proxied object that represents the object registered with the given instance id on the remote side of this channel.
    *
    * @param instanceId unique id of the registered object
    * @param contextData Optional context data to pass to a registered object's factory method
    */
    getRemoteObjectProxy<T>(instanceId: string, contextData?: Object): IPromise<T>;

    /**
    * Get the object registry to handle messages from this specific channel.
    * Upon receiving a message, this channel registry will be used first, then
    * the global registry will be used if no handler is found here.
    */
    getObjectRegistry(): IXDMObjectRegistry;
}

/**
* Registry of XDM channels kept per target frame/window
*/
interface IXDMChannelManager {

    /**
    * Add an XDM channel for the given target window/iframe
    *
    * @param window Target iframe window to communicate with
    * @param targetOrigin Url of the target iframe (if known)
    */
    addChannel(window: Window, targetOrigin?: string): IXDMChannel;
}

/**
* Registry of XDM objects that can be invoked by an XDM channel
*/
interface IXDMObjectRegistry {

    /**
    * Register an object (instance or factory method) exposed by this frame to callers in a remote frame
    *
    * @param instanceId unique id of the registered object
    * @param instance Either: (1) an object instance, or (2) a function that takes optional context data and returns an object instance.
    */
    register(instanceId: string, instance: Object | { (contextData?: any): Object; }): void;

    /**
    * Get an instance of an object registered with the given id
    *
    * @param instanceId unique id of the registered object
    * @param contextData Optional context data to pass to the contructor of an object factory method
    */
    getInstance<T>(instanceId: string, contextData?: Object): T;
}

/**
* Options for the extension's initialization method
*/
interface IExtensionInitializationOptions {

    /**
    * Set to true if the extension will explicitly call notifyLoadSucceeded or notifyLoadFailed
    * itself to indicate that the extension is done loading (stops UI loading indicator in the host).
    * If false (the default) the extension is considered ready as soon as init is called.
    */
    explicitNotifyLoaded?: boolean;

    /**
    * Set to true if the extension is going to consume any VSS script libraries.
    * For example, controls, REST clients, services, etc.
    * This pulls in the script loader and configuration data from the host frame so that
    * 'require' statements can be used to load VSTS modules. A call to VSS.require will
    * effectively turn this option on, even if not specified in the VSS.init handshake.
    */
    usePlatformScripts?: boolean;

    /**
    * Set to true if the extension desires to use VSS platform CSS styles. If not explicitly set,
    * the default value is the value of 'usePlatformScripts'.
    */
    usePlatformStyles?: boolean;

    /**
    * Extension-specific AMD module loader configuration. This configuration
    * will be merged with the VSTS-specific configuration.
    */
    moduleLoaderConfig?: ModuleLoaderConfiguration;

    /**
    * Optional callback method that gets invoked when this extension frame is reused by another contribution
    * which shares the same URI of the contribution that originally caused this extension frame to be loaded.
    */
    extensionReusedCallback?: (contribution: Contribution) => void;
}

/**
* Storage that can be leveraged by sandboxed extension content. The host frame will
* store this data in localStorage for the extension's publisher id.
*/
interface ISandboxedStorage {
    /**
    * Used by the VSS.SDK to shim localStorage for sandboxed content - for a given publisher.
    */
    localStorage?: IDictionaryStringTo<string>;
}

/**
* Data passed from the host to an extension frame via the initial handshake
*/
interface IHostHandshakeData {

    /**
    * Static context information about the current page
    */
    pageContext: PageContext;

    /**
    * Initial configuration for the extension frame
    */
    initialConfig?: any;

    /**
    * Context information about the extension
    */
    extensionContext: IExtensionContext;

    /**
    * The contribution that caused the extension frame to be loaded.
    */
    contribution: Contribution;

    /**
    * Initial sandboxed-storage data for the current extension's publisher.
    */
    sandboxedStorage?: ISandboxedStorage;
}

/**
* Data passed to the host from an extension frame via the initial handshake
*/
interface IExtensionHandshakeData {

    /**
    * If true, consider the extension loaded upon completion of the initial handshake.
    */
    notifyLoadSucceeded: boolean;

    /**
    * Optional callback method that gets invoked when this extension frame is reused by another contribution
    * which shares the same URI of the contribution that originally caused this extension frame to be loaded.
    */
    extensionReusedCallback?: (contribution: Contribution) => void;

    /**
    * The version of the VSS.SDK javascript file being used by the extension
    */
    vssSDKVersion: number;
}

/**
* Information about a control interface that is exposed across iframe boundaries
*/
interface IExternalControlInterfaceInfo {
    methodNames: string[];
}

/**
* Context about the app that owns the content that is being hosted
*/
interface IExtensionContext {
    /**
    * Friendly unique id of the publisher
    */
    publisherId: string;

    /**
    * Friendly id of the extension (unique within the publisher)
    */
    extensionId: string;

    /**
    * Version of the extension
    */
    version: string;

    /**
    * The base uri to be used with relative urls in contribution properties
    */
    baseUri: string;
}

/**
* Context passed to GetServiceInstance
*/
interface IDefaultGetServiceContext {

    /**
    * The web context to be used in the get service call
    */
    webContext: WebContext;

    /**
    * The extension context, i.e. publisher id, extension id, etc.
    */
    extensionContext: IExtensionContext;

    /**
    * Options that were passed to the host management service,
    * contains the registered VSS auth application id
    */
    hostManagementServiceOptions: IHostManagementServiceOptions;
}

/**
* Options passed to the host management service
*/
interface IHostManagementServiceOptions extends IExtensionContext {

    /**
    * The registered VSS auth application id
    */
    registrationId: string;
}

/**
* Session token whose value can be added to the Authorization header in requests to VSTS endpoints
*/
interface ISessionToken {

    /**
    * The registered VSS auth application id
    */
    appId: string;

    /**
    * Name describing the token
    */
    name: string;

    /**
    * Token value
    */
    token: string;
}

/**
* A Contribution with its containing extension
*/
interface IExtensionContribution extends Contribution {

    /**
    * The extension that owns this contribution
    */
    extension: ExtensionManifest;
}

/**
* Information about an individual contribution that contributes one or more services registered by id.
*/
interface IServiceContribution extends IExtensionContribution {

    /**
    * Get the instance of an object registered by this contribution
    *
    * @param objectId Id of the registered object (defaults to the id property of the contribution)
    * @param context Optional context to use when getting the object.
    */
    getInstance<T>(objectId?: string, context?: any): IPromise<T>;
}

interface IHostDialogOptions {

    height?: number;
    width?: number;
    draggable?: boolean;
    resizable?: boolean;
    title?: string;
    modal?: boolean;
    buttons?: IDictionaryStringTo<any>;
    open?: Function;
    close?: Function;
    getDialogResult?: () => any;
    okCallback?: (result: any) => void;
    cancelCallback?: Function;
    okText?: string;
    cancelText?: string;
}

interface IExternalDialog {

    /**
    * Gets an object registered in the dialog's contribution control.
    *
    * @param instanceId Id of the instance to get
    * @param contextData Optional data to pass to the extension for it to use when creating the instance
    * @return Promise that is resolved to the instance (a proxy object that talks to the instance)
    */
    getContributionInstance<T>(instanceId: string, contextData?: any): IPromise<T>;

    /**
    * Close the dialog
    */
    close();

    /**
    * Update the title of the dialog
    *
    * @param title New dialog title
    */
    setTitle(title: string);

    /**
    * Update the enablement of the OK button
    */
    updateOkButton(enabled: boolean);
}

/**
 * Represents a button used in IHostDialogService.openMessageDialog().
 */
interface IMessageDialogButton {
    /**
     * Used as HTML id of the button.
     */
    id: string;
    /**
     * Text to display on the button.
     */
    text: string;
    /**
     * When true, the dialog's promise is rejected instead of resolved when this button is clicked.
     */
    reject?: boolean;
    /**
     * Specifies how the button should look.
     * Possible values:
     *   (undefined) - Default
     *   "warning" - Red
     */
    style?: string;
}

/**
 * Used by IHostDialogService.openMessageDialog().
 */
interface IOpenMessageDialogOptions {
    /**
     * Array of buttons to show. Default is [Button.Ok, Button.Cancel]
     */
    buttons?: IMessageDialogButton[];
    /**
     * Button to use when the user presses the Esc key. Default is the last button.
     */
    escapeButton?: IMessageDialogButton;
    /**
     * If this is set, the user will be presented with a text box. Non-rejecting buttons will be disabled until the user types in this string.
     */
    requiredTypedConfirmation?: string;
    /**
     * Text for the title bar of the dialog. Default is "Confirm".
     */
    title?: string;
    /**
     * Width of dialog in px.
     */
    width?: number;
    /**
     * Height of dialog in px.
     */
    height?: number;
    /**
     * Use Bowtie styling. Default is true.
     */
    useBowtieStyle?: boolean;
}

/**
 * Result returned when a MessageDialog is closed.
 */
interface IMessageDialogResult {
    /**
     * Button that was clicked to dismiss the dialog.
     */
    button: IMessageDialogButton;
}

/**
* Service which manages showing dialogs in the parent frame
*/
interface IHostDialogService {

    /**
    * Open a modal dialog in the host frame which will get its content from a contributed control.
    *
    * @param contributionId The id of the control contribution to host in the dialog
    * @param dialogOptions options.title - title of dialog
    * @param contributionConfig Initial configuration to pass to the contribution control.
    * @param postContent Optional data to post to the contribution endpoint. If not specified, a GET request will be performed.
    */
    openDialog(contributionId: string, dialogOptions: IHostDialogOptions, contributionConfig?: Object, postContent?: Object): IPromise<IExternalDialog>;

    /**
     * Open a modal dialog in the host frame which will display the supplied message.
     * @param message the message to display in the dialog.
     * @param methodOptions options affecting the dialog
     * @returns a promise that is resolved when the user accepts the dialog (Ok, Yes, any button with Button.reject===false), or rejected if the user does not (Cancel, No, any button with Button.reject===true).
     */
    openMessageDialog(message: string, options?: IOpenMessageDialogOptions): IPromise<IMessageDialogResult>;

    buttons: {
        /**
         * Localized Ok button.
         */
        ok: IMessageDialogButton;
        /**
         * Localized Cancel button.
         */
        cancel: IMessageDialogButton;
        /**
         * Localized Yes button.
         */
        yes: IMessageDialogButton;
        /**
         * Localized No button.
         */
        no: IMessageDialogButton;
    }
}

/**
* Service which allows interaction with the browser location and navigation of the host frame
*/
interface IHostNavigationService {

    /**
     * Reloads the parent frame
     */
    reload();

    /**
    * Add a callback to be invoked each time the hash navigation has changed
    *
    * @param callback Method invoked on each navigation hash change
    */
    onHashChanged(callback: (hash: string) => void);

    /**
    * Gets the current hash.
    *
    * @return Hash part of the host page's url (url following #)
    */
    getHash(): IPromise<string>;

    /**
    * Sets the provided hash from the hosted content.
    *
    * @param hash The new hash string to
    */
    setHash(hash: string);
}

/**
* Service which allows for getting and setting of extension data
*/
interface IExtensionDataService {

    /**
    * Returns a promise for retrieving a setting at the provided key and scope
    *
    * @param key The key to retrieve a value for
    * @param documentOptions The scope in which the value is stored - default value is account-wide
    */
    getValue<T>(key: string, documentOptions?: IDocumentOptions): IPromise<T>;

    /**
    * Returns a promise for saving a setting at the provided key and scope
    *
    * @param key The key to save a value for
    * @param value The value to save
    * @param documentOptions The scope in which the value is stored - default value is account-wide
    */
    setValue<T>(key: string, value: T, documentOptions?: IDocumentOptions): IPromise<T>;

    /**
    * Returns a promise for getting a document with the provided id in the provided collection
    *
    * @param collectionName The name of the collection where the document lives
    * @param id The id of the document in the collection
    * @param documentOptions The scope in which the value is stored - default value is account-wide
    */
    getDocument(collectionName: string, id: string, documentOptions?: IDocumentOptions): IPromise<any>;

    /**
    * Returns a promise for getting all of the documents in the provided collection
    *
    * @param collectionName The name of the collection where the document lives
    * @param documentOptions The scope in which the value is stored - default value is account-wide
    */
    getDocuments(collectionName: string, documentOptions?: IDocumentOptions): IPromise<any[]>;

    /**
    * Returns a promise for creating a document in the provided collection
    *
    * @param collectionName The name of the collection where the document lives
    * @param doc The document to store
    * @param documentOptions The scope in which the value is stored - default value is account-wide
    */
    createDocument(collectionName: string, doc: any, documentOptions?: IDocumentOptions): IPromise<any>;

    /**
    * Returns a promise for setting a document in the provided collection
    * Creates the document if it does not exist, otherwise updates the existing document with the id provided
    *
    * @param collectionName The name of the collection where the document lives
    * @param doc The document to store
    * @param documentOptions The scope in which the value is stored - default value is account-wide
    */
    setDocument(collectionName: string, doc: any, documentOptions?: IDocumentOptions): IPromise<any>;

    /**
    * Returns a promise for updating a document in the provided collection
    * A document with the id provided must exist
    *
    * @param collectionName The name of the collection where the document lives
    * @param doc The document to store
    * @param documentOptions The scope in which the value is stored - default value is account-wide
    */
    updateDocument(collectionName: string, doc: any, documentOptions?: IDocumentOptions): IPromise<any>;

    /**
    * Returns a promise for deleting the document at the provided scope, collection and id
    *
    * @param collectionName The name of the collection where the document lives
    * @param id The id of the document in the collection
    * @param documentOptions The scope in which the value is stored - default value is account-wide
    */
    deleteDocument(collectionName: string, id: string, documentOptions?: IDocumentOptions): IPromise<void>;
}

/**
* Interface for options that can be supplied with document actions
*/
interface IDocumentOptions {
    /**
    * The scope of where the document is stored. Can be Account or User.
    */
    scopeType: string;

    /**
    * The value of the scope where the document is stored. Can be Current or Me.
    */
    scopeValue?: string;

    /**
    * The default value to return when using getValue(). If the document has no value,
    * this value will be used instead.
    */
    defaultValue?: any;
}

/**
* Interface for a registered object that contributes menu item(s)
*/
interface IContributedMenuSource {

    /**
    * Get an array of menu items for the given context
    *
    * @param context Menu-specific context information
    * @return Array of menu items or a promise for the array
    */
    getMenuItems(context: any): IContributedMenuItem[] | IPromise<IContributedMenuItem[]>;

    /**
    * Handle a menu item from this menu source being clicked. This is only invoked when the
    * contributed menu item does not have an "action" method.
    *
    * @param actionContext Menu-specific context information
    */
    execute?(actionContext: any);
}

/**
* An individual contributed menu item
*/
interface IContributedMenuItem {

    /**
    * Menu-item specific identifier
    */
    id?: string;

    /**
    * Text to display in the menu item
    */
    text?: string;

    /**
    * Tooltip to display for the menu item
    */
    title?: string;

    /**
    * Set to true if this menu item is just a separator
    */
    separator?: boolean;

    /**
    * Set to true if this menu item should be disabled
    */
    disabled?: boolean;

    /**
     * If true, the menu item will not be displayed.
     */
    hidden?: boolean;

    /**
    * Url to an icon image or css class for the image cell
    */
    icon?: string;

    /**
    * If true, do not render an icon or space for an icon.
    */
    noIcon?: boolean;

    /**
    * If this menu item has a sub menu, these are the contributed child items
    */
    childItems?: IContributedMenuItem[] | IPromise<IContributedMenuItem[]>;

    /**
    * Id of the menu group that this item should be placed in.
    */
    groupId?: string;

    /**
    * If specified, create an <a> tag around this menu item with the specified href.
    */
    href?: string;

    /**
    * Method invoked when the menu item is clicked.
    *
    * @param actionContext Menu-specific context information
    */
    action?: (actionContext: any) => void;
}
interface IContributedTab {
    /**
     * Determines if this tab should be displayed
     * @param context Context information
     * @return boolean Return true not to show this tab.
     */
    isInvisible?: (context?: any) => boolean | IPromise<boolean>;

    /**
     * Page title, which will be displayed above the list of Tabs
     * @param context Context information
     * @return string The unescaped page title
     */
    pageTitle: string | IPromise<string> | ((context?: any) => string | IPromise<string>);

    /**
     * Name of the tab
     * @param context Context information
     * @return string The unescaped text that appears as the name of the tab
     */
    name: string | IPromise<string> | ((context?: any) => string | IPromise<string>);

    /**
     * Title text for the tab, i.e., the tooltip
     * @param context Context information
     * @return string The tooltip text
     */
    title?: string | IPromise<string> | ((context?: any) => string | IPromise<string>);

    /**
     * URI to the page that this tab will display (i.e. in a frame)
     */
    uri: string;

    /**
     * Function that is invoked when there is a new context available for the extension.
     */
    updateContext: (context: any) => void | IPromise<void>;

    /**
     * Determines if this tab should be disabled
     * @param context Context information
     * @return boolean Return true to disable this tab.
     */
    isDisabled?: (context?: any) => boolean | IPromise<boolean>;
}

/**
 * A navigation element which appears in the header section.
 * @exemptedapi
 */
interface IContributedHub extends Hub {
    /**
     * Specifies the target hub id where the children are attached to the target hub.
     */
    targetHubId?: string;

    /**
     * Hubs resolved by this container hub.
     */
    children: IContributedHub[] | (()=> IPromise<IContributedHub[]>);

    /**
     * Specifies whether a separator is displayed before this hub or not.
     */
    beforeSeparator?: boolean;

    /**
     * Specifies whether a separator is displayed after this hub or not.
     */
    afterSeparator?: boolean;

    /**
     * Specifies whether this hub is a default hub or not (rendered differently).
     */
    isDefault?: boolean;

    /**
    * If true, the hub element should be rendered as a disabled element.
    */
    disabled: boolean;
}

/**
* Context passed to hubs-providers in calls to get hubs
*/
interface IHubsProviderContext {
    /**
    * The contribution id of the owning control
    */
    contributionId: string;

    /**
    * Method that can be called when hubs change in order to update the owning control
    */
    refreshDelegate?: Function;
}

/**
 * The contract for hub providers which are expected to provide a container hub.
 * @exemptedapi
 */
interface IHubsProvider {
    /**
     * Container hub specified by this provider. Container decides where to display child hubs in the header.
     */
    getContainerHub(context: IHubsProviderContext): IContributedHub | IPromise<IContributedHub>;
}

//----------------------------------------------------------
// Generated file, DO NOT EDIT.
// To regenerate this file, run "GenerateConstants.cmd" .

// Generated data for the following assemblies:
// Microsoft.TeamFoundation.Server.WebAccess.Platform
// Microsoft.VisualStudio.Services.ExtensionManagement.WebApi
//----------------------------------------------------------


/**
* Model to represent a public access uri
*/
interface AccessPointModel {
    /**
    * Host name and port number of the url
    */
    authority: string;
    /**
    * Url scheme (http, https, ...)
    */
    scheme: string;
    /**
    * Full url
    */
    uri: string;
}

interface AcquisitionOperation {
    /**
    * State of the the AcquisitionOperation for the current user
    */
    operationState: any;
    /**
    * AcquisitionOperationType: install, request, buy, etc...
    */
    operationType: any;
    /**
    * Optional reason to justify current state. Typically used with Disallow state.
    */
    reason: string;
    /**
    * List of reasons indicating why the operation is not allowed.
    */
    reasons: any[];
}

/**
* Model used to configure how TFS reports usage data to Application Insights
*/
interface AppInsightsConfiguration {
    /**
    * If true, automatically call "trackPage" when the page is loaded
    */
    autoTrackPage: boolean;
    /**
    * Optional data used to override the default values sent to trackPage
    */
    customTrackPageData: AppInsightsCustomTrackPageData;
    /**
    * Set to false if app insights reporting is not enabled/configured
    */
    enabled: boolean;
    /**
    * The url from which to retrieve app insights scripts
    */
    insightsScriptUrl: string;
    /**
    * The instrumentation key used to track this deployment's usage
    */
    instrumentationKey: string;
    /**
    * If true, include collection, project, and team info in the track-page urls
    */
    trackProjectInfo: boolean;
}

/**
* Model that can be used to customize the values sent to AppInsights via "trackPage"
*/
interface AppInsightsCustomTrackPageData {
    alias: string;
    metrics: { [key: string]: number; };
    pageName: string;
    properties: { [key: string]: string; };
}

/**
* Web Access configuration data. This information is used to process requests on the server.  This data is also placed in a json island on each page in order for JavaScript to know key configuration data required to things like construct proper urls
*/
interface ConfigurationContext {
    /**
    * MVC api configuration
    */
    api: ConfigurationContextApis;
    /**
    * Optional name of the client (e.g. TEE) hosting the page
    */
    clientHost: string;
    isHosted: boolean;
    /**
    * Current mail settings for TFS
    */
    mailSettings: TfsMailSettings;
    /**
    * Server resource paths
    */
    paths: ConfigurationContextPaths;
}

/**
* MVC api configuration
*/
interface ConfigurationContextApis {
    /**
    * Specifies the path prefix for the area
    */
    areaPrefix: string;
    /**
    * Specifies the path prefix for the controller
    */
    controllerPrefix: string;
    /**
    * Api-version for legacy rpc-style web access api controllers See WebApiVersionClient for the version coming from the client/browser.  The return value is a positive whole number >= 1.
    */
    webApiVersion: string;
}

/**
* Paths to server resources
*/
interface ConfigurationContextPaths {
    /**
    * Relative path to the _content path of the web application
    */
    resourcesPath: string;
    /**
    * Relative path to the root of the web application
    */
    rootPath: string;
    /**
    * Static content version stamp
    */
    staticContentVersion: string;
    /**
    * Relative path to unversioned 3rd party static content
    */
    staticRoot3rdParty: string;
    /**
    * Relative path to versioned static content
    */
    staticRootTfs: string;
}

declare enum ContextHostType {
    Unknown = 0,
    /**
    * The Deployment Host
    */
    Deployment = 1,
    /**
    * The Application Host
    */
    Application = 2,
    /**
    * The Project Collection
    */
    ProjectCollection = 4,
}

interface ContextIdentifier {
    id: string;
    name: string;
}

/**
* A feature that can be enabled or disabled
*/
interface ContributedFeature {
    /**
    * If true, the feature is enabled unless overridden at some scope
    */
    defaultState: boolean;
    /**
    * Rules for setting the default value if not specified by any setting/scope. Evaluated in order until a rule returns an Enabled or Disabled state (not Undefined)
    */
    defaultValueRules: ContributedFeatureDefaultValueRule[];
    /**
    * The description of the feature
    */
    description: string;
    /**
    * The full contribution id of the feature
    */
    id: string;
    /**
    * The friendly name of the feature
    */
    name: string;
    /**
    * The scopes/levels at which settings can set the enabled/disabled state of this feature
    */
    scopes: ContributedFeatureSettingScope[];
}

/**
* A rules for setting the default value of a feature if not specified by any setting/scope
*/
interface ContributedFeatureDefaultValueRule {
    /**
    * Name of the IContributedFeatureValuePlugin to run
    */
    name: string;
    /**
    * Properties to feed to the IContributedFeatureValuePlugin
    */
    properties: any;
}

/**
* The current state of a feature within a given scope
*/
declare enum ContributedFeatureEnabledValue {
    /**
    * The state of the feature is not set for the specified scope
    */
    Undefined = -1,
    /**
    * The feature is disabled at the specified scope
    */
    Disabled = 0,
    /**
    * The feature is enabled at the specified scope
    */
    Enabled = 1,
}

/**
* The scope to which a feature setting applies
*/
interface ContributedFeatureSettingScope {
    /**
    * The name of the settings scope to use when reading/writing the setting
    */
    settingScope: string;
    /**
    * Whether this is a user-scope or this is a host-wide (all users) setting
    */
    userScoped: boolean;
}

/**
* A contributed feature/state pair
*/
interface ContributedFeatureState {
    /**
    * The full contribution id of the feature
    */
    featureId: string;
    /**
    * The scope at which this state applies
    */
    scope: ContributedFeatureSettingScope;
    /**
    * The current state of this feature
    */
    state: ContributedFeatureEnabledValue;
}

/**
* Page context configuration that can be contributed by remote services (different VSTS services delivering content to the page)
*/
interface ContributedServiceContext {
    /**
    * Dynamic bundles to include from this service
    */
    bundles: DynamicBundlesCollection;
    /**
    * Specifies the prefixes for CSS modules that should map to the current service. e.g. "VSS/LoaderPlugins/Css!EMS:ExtensionManagement" would map to ExtensionManagement.css under the themed content path of this service if "EMS" is in the CSSModulePrefixes list.
    */
    cssModulePrefixes: string[];
    /**
    * Feature flag states to include by default in page data (avoids AJAX lookup)
    */
    featureAvailability: FeatureAvailabilityContext;
    /**
    * Module loader configuration which may be merged-in with the parent host (if injected into the DOM) Because the config may be merged with the host config, each root area path must be explicitly defined here rather than relying on basePath as a catch-all.
    */
    moduleLoaderConfig: ModuleLoaderConfiguration;
    /**
    * Paths to resources on this service
    */
    paths: ConfigurationContextPaths;
    /**
    * Lookup of urls for different services (at different host levels)
    */
    serviceLocations: ServiceLocations;
    /**
    * The root url of the service that can be used to resolve relative links when this content is hosted in another site.
    */
    serviceRootUrl: string;
    /**
    * Instance id of the service
    */
    serviceTypeId: string;
}

/**
* An individual contribution made by an extension
*/
interface Contribution {
    /**
    * List of constraints (filters) that should be applied to the availability of this contribution
    */
    constraints: ContributionConstraint[];
    description: string;
    id: string;
    /**
    * Includes is a set of contributions that should have this contribution included in their targets list.
    */
    includes: string[];
    /**
    * Properties/attributes of this contribution
    */
    properties: any;
    /**
    * The ids of the contribution(s) that this contribution targets. (parent contributions)
    */
    targets: string[];
    /**
    * Id of the Contribution Type
    */
    type: string;
    visibleTo: string[];
}

/**
* Base class shared by contributions and contribution types
*/
interface ContributionBase {
    /**
    * Description of the contribution/type
    */
    description: string;
    /**
    * Fully qualified identifier of the contribution/type
    */
    id: string;
    /**
    * VisibleTo can be used to restrict whom can reference a given contribution/type. This value should be a list of publishers or extensions access is restricted too.  Examples: "ms" - Means only the "ms" publisher can reference this. "ms.vss-web" - Means only the "vss-web" extension from the "ms" publisher can reference this.
    */
    visibleTo: string[];
}

/**
* Specifies a constraint that can be used to dynamically include/exclude a given contribution
*/
interface ContributionConstraint {
    /**
    * An optional property that can be specified to group constraints together. All constraints within a group are AND'd together (all must be evaluate to True in order for the contribution to be included). Different groups of constraints are OR'd (only one group needs to evaluate to True for the contribution to be included).
    */
    group: number;
    /**
    * If true, negate the result of the filter (include the contribution if the applied filter returns false instead of true)
    */
    inverse: boolean;
    /**
    * Name of the IContributionFilter class
    */
    name: string;
    /**
    * Properties that are fed to the contribution filter class
    */
    properties: any;
    /**
    * Constraints can be optionally be applied to one or more of the relationships defined in the contribution. If no relationships are defined then all relationships are associated with the constraint. This means the default behaviour will elimiate the contribution from the tree completely if the constraint is applied.
    */
    relationships: string[];
}

/**
* Item representing a contribution path. Can be of type default, resource or bundle
*/
interface ContributionPath {
    /**
    * Type if this contribution path
    */
    pathType: ContributionPathType;
    /**
    * Replace value for this contribution path
    */
    value: string;
}

/**
* Type of the contribution path
*/
declare enum ContributionPathType {
    Default = 0,
    Resource = 1,
}

/**
* Description about a property of a contribution type
*/
interface ContributionPropertyDescription {
    /**
    * Description of the property
    */
    description: string;
    /**
    * Name of the property
    */
    name: string;
    /**
    * True if this property is required
    */
    required: boolean;
    /**
    * The type of value used for this property
    */
    type: ContributionPropertyType;
}

/**
* The type of value used for a property
*/
declare enum ContributionPropertyType {
    /**
    * Contribution type is unknown (value may be anything)
    */
    Unknown = 0,
    /**
    * Value is a string
    */
    String = 1,
    /**
    * Value is a Uri
    */
    Uri = 2,
    /**
    * Value is a GUID
    */
    Guid = 4,
    /**
    * Value is True or False
    */
    Boolean = 8,
    /**
    * Value is an integer
    */
    Integer = 16,
    /**
    * Value is a double
    */
    Double = 32,
    /**
    * Value is a DateTime object
    */
    DateTime = 64,
    /**
    * Value is a generic Dictionary/JObject/property bag
    */
    Dictionary = 128,
    /**
    * Value is an array
    */
    Array = 256,
    /**
    * Value is an arbitrary/custom object
    */
    Object = 512,
}

/**
* A contribution type, given by a json schema
*/
interface ContributionType {
    description: string;
    id: string;
    /**
    * Controls whether or not contributions of this type have the type indexed for queries. This allows clients to find all extensions that have a contribution of this type.  NOTE: Only TrustedPartners are allowed to specify indexed contribution types.
    */
    indexed: boolean;
    /**
    * Friendly name of the contribution/type
    */
    name: string;
    /**
    * Describes the allowed properties for this contribution type
    */
    properties: { [key: string]: ContributionPropertyDescription; };
    visibleTo: string[];
}

/**
* Contains lists of script and css references that need to be included on the page in order for the controls used by the page to work.
*/
interface CoreReferencesContext {
    /**
    * Core 3rd party javascript bundle reference
    */
    coreScriptsBundle: JavascriptFileReference;
    /**
    * Core VSS javascript bundle reference for extension frames
    */
    extensionCoreReferences: JavascriptFileReference;
    /**
    * Core javascript files referenced on a page
    */
    scripts: JavascriptFileReference[];
    /**
    * Core CSS files referenced on a page
    */
    stylesheets: StylesheetReference[];
}

/**
* Contextual information that data providers can examine when populating their data
*/
interface DataProviderContext {
    /**
    * Generic property bag that contains context-specific properties that data providers can use when populating their data dictionary
    */
    properties: { [key: string]: number; };
}

/**
* A query that can be issued for data provider data
*/
interface DataProviderQuery {
    /**
    * Contextual information to pass to the data providers
    */
    context: DataProviderContext;
    /**
    * The contribution ids of the data providers to resolve
    */
    contributionIds: string[];
}

/**
* Result structure from calls to GetDataProviderData
*/
interface DataProviderResult {
    /**
    * Property bag of data keyed off of the data provider contribution id
    */
    data: { [key: string]: number; };
    /**
    * List of data providers resolved in the data-provider query
    */
    resolvedProviders: ResolvedDataProvider[];
}

interface DaylightSavingsAdjustmentEntry {
    /**
    * Millisecond adjustment from UTC
    */
    offset: number;
    /**
    * Date that the offset adjustment starts
    */
    start: Date;
}

interface DiagnosticsContext {
    /**
    * Id of the current activity
    */
    activityId: string;
    allowStatsCollection: boolean;
    /**
    * Whether or not to enable static content bundling. This is on by default but the value can be overridden with a TFS-BUNDLING cookie or registry entry.
    */
    bundlingEnabled: boolean;
    /**
    * True if the CDN feature flag is enabled.
    */
    cdnAvailable: boolean;
    /**
    * True if the CDN feature flag is enabled and the user has not disabled CDN with a cookie.
    */
    cdnEnabled: boolean;
    clientLogLevel: number;
    debugMode: boolean;
    isDevFabric: boolean;
    sessionId: string;
    tracePointCollectionEnabled: boolean;
    tracePointProfileEnd: string;
    tracePointProfileStart: string;
    /**
    * Denotes the version of the web platform consumed by this service. Of the form M###.
    */
    webPlatformVersion: string;
}

interface DynamicBundlesCollection {
    scripts: DynamicScriptBundle[];
    scriptsExcludedByPath: string[];
    styles: DynamicCSSBundle[];
}

interface DynamicCSSBundle {
    contentLength: number;
    cssFiles: string[];
    fallbackThemeUri: string;
    uri: string;
}

interface DynamicScriptBundle {
    contentLength: number;
    uri: string;
}

interface ExtendedHostContext {
    authority: string;
    hostType: ContextHostType;
    id: string;
    isAADAccount: boolean;
    name: string;
    relativeUri: string;
    scheme: string;
    uri: string;
}

/**
* Audit log for an extension
*/
interface ExtensionAuditLog {
    /**
    * Collection of audit log entries
    */
    entries: ExtensionAuditLogEntry[];
    /**
    * Extension that the change was made for
    */
    extensionName: string;
    /**
    * Publisher that the extension is part of
    */
    publisherName: string;
}

/**
* An audit log entry for an extension
*/
interface ExtensionAuditLogEntry {
    /**
    * Change that was made to extension
    */
    auditAction: string;
    /**
    * Date at which the change was made
    */
    auditDate: Date;
    /**
    * Extra information about the change
    */
    comment: string;
    /**
    * Represents the user who made the change
    */
    updatedBy: any;
}

interface ExtensionAuthorization {
    id: string;
    scopes: string[];
}

/**
* Represents a single collection for extension data documents
*/
interface ExtensionDataCollection {
    /**
    * The name of the collection
    */
    collectionName: string;
    /**
    * A list of documents belonging to the collection
    */
    documents: any[];
    /**
    * The type of the collection's scope, such as Default or User
    */
    scopeType: string;
    /**
    * The value of the collection's scope, such as Current or Me
    */
    scopeValue: string;
}

/**
* Represents a query to receive a set of extension data collections
*/
interface ExtensionDataCollectionQuery {
    /**
    * A list of collections to query
    */
    collections: ExtensionDataCollection[];
}

/**
* Base class for an event callback for an extension
*/
interface ExtensionEventCallback {
    /**
    * The uri of the endpoint that is hit when an event occurs
    */
    uri: string;
}

/**
* Collection of event callbacks - endpoints called when particular extension events occur.
*/
interface ExtensionEventCallbackCollection {
    /**
    * Optional.  Defines an endpoint that gets called via a POST reqeust to notify that an extension disable has occurred.
    */
    postDisable: ExtensionEventCallback;
    /**
    * Optional.  Defines an endpoint that gets called via a POST reqeust to notify that an extension enable has occurred.
    */
    postEnable: ExtensionEventCallback;
    /**
    * Optional.  Defines an endpoint that gets called via a POST reqeust to notify that an extension install has completed.
    */
    postInstall: ExtensionEventCallback;
    /**
    * Optional.  Defines an endpoint that gets called via a POST reqeust to notify that an extension uninstall has occurred.
    */
    postUninstall: ExtensionEventCallback;
    /**
    * Optional.  Defines an endpoint that gets called via a POST reqeust to notify that an extension update has occurred.
    */
    postUpdate: ExtensionEventCallback;
    /**
    * Optional.  Defines an endpoint that gets called via a POST reqeust to notify that an extension install is about to occur.  Response indicates whether to proceed or abort.
    */
    preInstall: ExtensionEventCallback;
    /**
    * For multi-version extensions, defines an endpoint that gets called via an OPTIONS request to determine the particular version of the extension to be used
    */
    versionCheck: ExtensionEventCallback;
}

/**
* Set of flags applied to extensions that are relevant to contribution consumers
*/
declare enum ExtensionFlags {
    /**
    * A built-in extension is installed for all VSTS accounts by default
    */
    BuiltIn = 1,
    /**
    * The extension comes from a fully-trusted publisher
    */
    Trusted = 2,
}

/**
* Base class for extension properties which are shared by the extension manifest and the extension model
*/
interface ExtensionManifest {
    /**
    * Uri used as base for other relative uri's defined in extension
    */
    baseUri: string;
    /**
    * List of contributions made by this extension
    */
    contributions: Contribution[];
    /**
    * List of contribution types defined by this extension
    */
    contributionTypes: ContributionType[];
    /**
    * List of explicit demands required by this extension
    */
    demands: string[];
    /**
    * Collection of endpoints that get called when particular extension events occur
    */
    eventCallbacks: ExtensionEventCallbackCollection;
    /**
    * Language Culture Name set by the Gallery
    */
    language: string;
    /**
    * Version of the extension manifest format/content
    */
    manifestVersion: any;
    /**
    * List of all oauth scopes required by this extension
    */
    scopes: string[];
    /**
    * The ServiceInstanceType(Guid) of the VSTS service that must be available to an account in order for the extension to be installed
    */
    serviceInstanceType: string;
}

/**
* A request for an extension (to be installed or have a license assigned)
*/
interface ExtensionRequest {
    /**
    * Required message supplied if the request is rejected
    */
    rejectMessage: string;
    /**
    * Date at which the request was made
    */
    requestDate: Date;
    /**
    * Represents the user who made the request
    */
    requestedBy: any;
    /**
    * Optional message supplied by the requester justifying the request
    */
    requestMessage: string;
    /**
    * Represents the state of the request
    */
    requestState: ExtensionRequestState;
    /**
    * Date at which the request was resolved
    */
    resolveDate: Date;
    /**
    * Represents the user who resolved the request
    */
    resolvedBy: any;
}

interface ExtensionRequestedEvent {
    /**
    * Name of the account for which the extension was requested
    */
    accountName: string;
    /**
    * The extension request object
    */
    extensionRequest: ExtensionRequest;
    /**
    * Gallery host url
    */
    galleryHostUrl: string;
    /**
    * Link to view the extension details page
    */
    itemUrl: string;
    /**
    * The extension which has been requested
    */
    publishedExtension: any;
    /**
    * Linkk to view the extension request
    */
    requestUrl: string;
}

/**
* Represents the state of an extension request
*/
declare enum ExtensionRequestState {
    /**
    * The request has been opened, but not yet responded to
    */
    Open = 0,
    /**
    * The request was accepted (extension installed or license assigned)
    */
    Accepted = 1,
    /**
    * The request was rejected (extension not installed or license not assigned)
    */
    Rejected = 2,
}

/**
* The state of an extension
*/
interface ExtensionState {
    extensionName: string;
    flags: ExtensionStateFlags;
    installationIssues: InstalledExtensionStateIssue[];
    lastUpdated: Date;
    /**
    * The time at which the version was last checked
    */
    lastVersionCheck: Date;
    publisherName: string;
    version: string;
}

/**
* States of an extension Note:  If you add value to this enum, you need to do 2 other things.  First add the back compat enum in value src\Vssf\Sdk\Server\Contributions\InstalledExtensionMessage.cs.  Second, you can not send the new value on the message bus.  You need to remove it from the message bus event prior to being sent.
*/
declare enum ExtensionStateFlags {
    /**
    * No flags set
    */
    None = 0,
    /**
    * Extension is disabled
    */
    Disabled = 1,
    /**
    * Extension is a built in
    */
    BuiltIn = 2,
    /**
    * Extension has multiple versions
    */
    MultiVersion = 4,
    /**
    * Extension is not installed.  This is for builtin extensions only and can not otherwise be set.
    */
    UnInstalled = 8,
    /**
    * Error performing version check
    */
    VersionCheckError = 16,
    /**
    * Trusted extensions are ones that are given special capabilities. These tend to come from Microsoft and can't be published by the general public.  Note: BuiltIn extensions are always trusted.
    */
    Trusted = 32,
    /**
    * Extension is currently in an error state
    */
    Error = 64,
    /**
    * Extension scopes have changed and the extension requires re-authorization
    */
    NeedsReauthorization = 128,
    /**
    * Error performing auto-upgrade. For example, if the new version has demands not supported the extension cannot be auto-upgraded.
    */
    AutoUpgradeError = 256,
    /**
    * Extension is currently in a warning state, that can cause a degraded experience. The degraded experience can be caused for example by some installation issues detected such as implicit demands not supported.
    */
    Warning = 512,
}

interface FeatureAvailabilityContext {
    featureStates: { [key: string]: boolean; };
}

interface GlobalizationContext {
    culture: string;
    theme: string;
    timeZoneId: string;
    timezoneOffset: number;
}

interface HeaderModel {
    brandIcon: string;
    brandName: string;
    context: any;
    contributionId: string;
    elementContributionType: string;
    supportsContribution: boolean;
    userDisplayName: string;
}

interface HostContext {
    id: string;
    name: string;
    relativeUri: string;
    uri: string;
}

/**
* Model representing a hub in VSTS pages' navigation menu
*/
interface Hub {
    builtIn: boolean;
    hidden: boolean;
    groupId: string;
    icon: string;
    id: string;
    isSelected: boolean;
    name: string;
    order: any;
    uri: string;
}

/**
* Model representing a hub group in VSTS pages' navigation menu
*/
interface HubGroup {
    builtIn: boolean;
    hasHubs: boolean;
    hidden: boolean;
    icon: string;
    id: string;
    name: string;
    nonCollapsible: boolean;
    order: any;
    uri: string;
}

/**
* Context information containing the relevant hubs and hub groups for a given context
*/
interface HubsContext {
    allHubs: Hub[];
    hubGroups: HubGroup[];
    hubGroupsCollectionContributionId: string;
    hubs: Hub[];
    pinningPreferences: PinningPreferences;
    selectedHubGroupId: string;
    selectedHubId: string;
}

/**
* Model to represent a TeamFoundationIdentity
*/
interface IdentityModel {
    /**
    * Custom display name
    */
    customDisplayName: string;
    /**
    * Display name
    */
    displayName: string;
    /**
    * Email address
    */
    email: string;
    /**
    * Unique team foundation id
    */
    id: string;
    /**
    * Is the identity active
    */
    isActive: boolean;
    /**
    * Is the identity a group/team
    */
    isContainer: boolean;
    /**
    * The provider's display name for this identity
    */
    providerDisplayName: string;
    /**
    * Unique name for this identity
    */
    uniqueName: string;
}

/**
* Represents a VSTS extension along with its installation state
*/
interface InstalledExtension {
    baseUri: string;
    contributions: Contribution[];
    contributionTypes: ContributionType[];
    demands: string[];
    eventCallbacks: ExtensionEventCallbackCollection;
    /**
    * The friendly extension id for this extension - unique for a given publisher.
    */
    extensionId: string;
    /**
    * The display name of the extension.
    */
    extensionName: string;
    /**
    * This is the set of files available from the extension.
    */
    files: any[];
    /**
    * Extension flags relevant to contribution consumers
    */
    flags: ExtensionFlags;
    /**
    * Information about this particular installation of the extension
    */
    installState: InstalledExtensionState;
    language: string;
    /**
    * This represents the date/time the extensions was last updated in the gallery. This doesnt mean this version was updated the value represents changes to any and all versions of the extension.
    */
    lastPublished: Date;
    manifestVersion: any;
    /**
    * Unique id of the publisher of this extension
    */
    publisherId: string;
    /**
    * The display name of the publisher
    */
    publisherName: string;
    /**
    * Unique id for this extension (the same id is used for all versions of a single extension)
    */
    registrationId: string;
    scopes: string[];
    serviceInstanceType: string;
    /**
    * Version of this extension
    */
    version: string;
}

/**
* The state of an installed extension
*/
interface InstalledExtensionState {
    /**
    * States of an installed extension
    */
    flags: ExtensionStateFlags;
    /**
    * List of installation issues
    */
    installationIssues: InstalledExtensionStateIssue[];
    /**
    * The time at which this installation was last updated
    */
    lastUpdated: Date;
}

/**
* Represents an installation issue
*/
interface InstalledExtensionStateIssue {
    /**
    * The error message
    */
    message: string;
    /**
    * Source of the installation issue, for example  "Demands"
    */
    source: string;
    /**
    * Installation issue type (Warning, Error)
    */
    type: InstalledExtensionStateIssueType;
}

/**
* Installation issue type (Warning, Error)
*/
declare enum InstalledExtensionStateIssueType {
    /**
    * Represents an installation warning, for example an implicit demand not supported
    */
    Warning = 0,
    /**
    * Represents an installation error, for example an explicit demand not supported
    */
    Error = 1,
}

/**
* Reference to a javascript file to include on a page
*/
interface JavascriptFileReference {
    /**
    * Condition to check in the case that Url lives on a CDN. The fallback script will be included if this check fails.
    */
    fallbackCondition: string;
    /**
    * Fallback url to use in case Url lives on a CDN
    */
    fallbackUrl: string;
    /**
    * Id of the reference (JQuery, JQueryUI, MicrosoftAjax, etc.)
    */
    identifier: string;
    /**
    * Is this a core javascript file that needs to be included in all child extension frames
    */
    isCoreModule: boolean;
    /**
    * Url of the javascript reference
    */
    url: string;
}

/**
* Class used to wrap arrays in an object.
*/
interface JsonArrayWrapper {
    __wrappedArray: string;
}

interface MicrosoftAjaxConfig {
    cultureInfo: any;
}

/**
* AMD javascript module loader configuration
*/
interface ModuleLoaderConfiguration {
    baseUrl: string;
    contributionPaths: { [key: string]: ContributionPath; };
    paths: { [key: string]: string; };
    shim: { [key: string]: ModuleLoaderShimConfiguration; };
    /**
    * The maximum amount of time (in seconds) the AMD loader will wait for scripts to load.
    */
    waitSeconds: number;
}

/**
* AMD javascript module loader shim configuration
*/
interface ModuleLoaderShimConfiguration {
    deps: string[];
    exports: string;
}

/**
* Structure to specify current navigation context of the executing request. The navigation context content's are generally obtained from the request URL. Some context specifiers such as "Account" can be implicit and might come from current IVssServiceHost.
*/
interface NavigationContext {
    /**
    * A token to show which area the request has been targeted to. By default there are two areas "Admin" and "Api". They can be specified in the URL as _admin and _api respectively.
    */
    area: string;
    /**
    * Current action route value
    */
    currentAction: string;
    /**
    * Current controller route value
    */
    currentController: string;
    /**
    * Current parameters route value (the path after the controller and action in the url)
    */
    currentParameters: string;
    /**
    * Flag to show top most navigation context. For example the URL http://server:port/collection/project/_controller/action sets the Project bit while the URL http://server:port/collection/project/_admin/_controller/action sets also sets the area property to Admin.
    */
    topMostLevel: NavigationContextLevels;
}

/**
* Flags to show which tokens of the navigation context are present in the current request URL. The request url's context part are formed like http://server:port[/{collection}[/{project}[/{team}]]][/_admin]/_{controller}/{action} The tokens {collection}, {project} and {team} are navigation level tokens whereas _admin segment is a switch to show admin areas of the site.
*/
declare enum NavigationContextLevels {
    None = 0,
    /**
    * Root level in Azure.
    */
    Deployment = 1,
    /**
    * Root level in on premises. Neither of {collection}, {project} and {team} tokens have information
    */
    Application = 2,
    /**
    * Flag to show {collection} token has information.
    */
    Collection = 4,
    /**
    * Flag to show {project} token has information.
    */
    Project = 8,
    /**
    * Flag to show {team} token has information.
    */
    Team = 16,
    /**
    * Sugar for all application levels.
    */
    ApplicationAll = 30,
    /**
    * Sugar for all levels
    */
    All = 31,
}

/**
* Global context placed on each VSSF web page (through json island data) which gives enough information for core TypeScript modules/controls on the page to operate
*/
interface PageContext {
    /**
    * Configuration for reporting telemetry/usage data to App Insights
    */
    appInsightsConfiguration: AppInsightsConfiguration;
    /**
    * Core javascript and css references
    */
    coreReferences: CoreReferencesContext;
    /**
    * Specifies the prefixes for CSS modules that should map to the current service. e.g. "VSS/LoaderPlugins/Css!EMS:ExtensionManagement" would map to ExtensionManagement.css under the themed content path of this service if "EMS" is in the CSSModulePrefixes list.
    */
    cssModulePrefixes: string[];
    /**
    * Diagnostic related information for the current page
    */
    diagnostics: DiagnosticsContext;
    /**
    * Feature flag states to include by default in page data (avoids AJAX lookup)
    */
    featureAvailability: FeatureAvailabilityContext;
    /**
    * Globalization data for the current page based on the current user's settings
    */
    globalization: GlobalizationContext;
    /**
    * Cached set of hubs and hub groups for the given request/navigation-context
    */
    hubsContext: HubsContext;
    /**
    * Configuration needed for Microsoft.Ajax library
    */
    microsoftAjaxConfig: MicrosoftAjaxConfig;
    /**
    * The (AMD) module configuration
    */
    moduleLoaderConfig: ModuleLoaderConfiguration;
    /**
    * Current navigation context.
    */
    navigation: NavigationContext;
    /**
    * The service instance type id for the VSTS service serving this page
    */
    serviceInstanceId: string;
    serviceLocations: ServiceLocations;
    /**
    * Contains global time zone configuration information (e.g. which dates DST changes)
    */
    timeZonesConfiguration: TimeZonesConfiguration;
    /**
    * Web Access configuration
    */
    webAccessConfiguration: ConfigurationContext;
    /**
    * The web context information for the given page request
    */
    webContext: WebContext;
}

interface PinningPreferences {
    pinnedHubGroupIds: string[];
    pinnedHubs: { [key: string]: string[]; };
    unpinnedHubGroupIds: string[];
    unpinnedHubs: { [key: string]: string[]; };
}

/**
* A request for an extension (to be installed or have a license assigned)
*/
interface RequestedExtension {
    /**
    * The unique name of the extension
    */
    extensionName: string;
    /**
    * A list of each request for the extension
    */
    extensionRequests: ExtensionRequest[];
    /**
    * DisplayName of the publisher that owns the extension being published.
    */
    publisherDisplayName: string;
    /**
    * Represents the Publisher of the requested extension
    */
    publisherName: string;
    /**
    * The total number of requests for an extension
    */
    requestCount: number;
}

/**
* Entry for a specific data provider's resulting data
*/
interface ResolvedDataProvider {
    /**
    * The total time the data provider took to resolve its data (in milliseconds)
    */
    duration: any;
    error: string;
    id: string;
}

interface Scope {
    description: string;
    title: string;
    value: string;
}

/**
* Holds a lookup of urls for different services (at different host levels)
*/
interface ServiceLocations {
    locations: { [key: string]: { [key: number]: string; }; };
}

/**
* Reference to a CSS file to include on a page
*/
interface StylesheetReference {
    /**
    * Url of the high-contrast version of the CSS file
    */
    highContrastUrl: string;
    /**
    * Is this a core stylesheet that needs to be included in child frames
    */
    isCoreStylesheet: boolean;
    /**
    * Url of the CSS file
    */
    url: string;
}

/**
* Information about the extension
*/
interface SupportedExtension {
    /**
    * Unique Identifier for this extension
    */
    extension: string;
    /**
    * Unique Identifier for this publisher
    */
    publisher: string;
    /**
    * Supported version for this extension
    */
    version: string;
}

interface TeamContext {
    id: string;
    name: string;
}

/**
* Data contract to represent a given team foundation service host (account, collection, deployment)
*/
interface TeamFoundationServiceHostModel {
    /**
    * Type of host (deployment, account, collection)
    */
    hostType: any;
    /**
    * Unique id of the host (collection id, account id, etc.)
    */
    instanceId: string;
    /**
    * Name of the host (collection name, account name, etc.)
    */
    name: string;
    /**
    * Path of the service host, relative to the root virtual directory (e.g. DefaultCollection)
    */
    relVDir: string;
    /**
    * Path of the service host relative to the web application root (e.g. /tfs/DefaultCollection)
    */
    vDir: string;
}

interface TfsMailSettings {
    enabled: boolean;
    from: string;
}

/**
* Internal structure to describe IVssServiceHost
*/
interface TfsServiceHostDescriptor {
    hostType: any;
    id: string;
    name: string;
    relVdir: string;
    vdir: string;
}

interface TimeZonesConfiguration {
    daylightSavingsAdjustments: DaylightSavingsAdjustmentEntry[];
}

interface UserContext {
    email: string;
    id: string;
    limitedAccess: boolean;
    name: string;
    uniqueName: string;
}

/**
* Context information for all web access requests
*/
interface WebContext {
    account: HostContext;
    /**
    * Information about the Collection used in the current request (may be null)
    */
    collection: HostContext;
    /**
    * Information about the current request context's host
    */
    host: ExtendedHostContext;
    /**
    * Information about the project used in the current request (may be null)
    */
    project: ContextIdentifier;
    /**
    * Information about the team used in the current request (may be null)
    */
    team: TeamContext;
    /**
    * Information about the current user
    */
    user: UserContext;
}

/**
* Contextual data for web-page-related data providers about the originating (host/source) page
*/
interface WebPageDataProviderPageSource {
    /**
    * List of paths contributed by the host which are available to 3rd party extension developers through VSS.SDK
    */
    contributionPaths: string[];
    /**
    * Diagnostics context (debug mode, activity id, etc.) of the source page
    */
    diagnostics: DiagnosticsContext;
    /**
    * The navigation context for the host page that is loading the data provider
    */
    navigation: NavigationContext;
    /**
    * The project context for the host page that is loading the data provider
    */
    project: ContextIdentifier;
    /**
    * Currently selected hubgroup id
    */
    selectedHubGroupId: string;
    /**
    * Currently selected hub id
    */
    selectedHubId: string;
    /**
    * The team context for the host page that is loading the data provider
    */
    team: ContextIdentifier;
    /**
    * The url of the host page that is loading the data provider
    */
    url: string;
}

declare module XDM {
    interface IDeferred<T> {
        resolve: (result: T) => void;
        reject: (reason: any) => void;
        promise: IPromise<T>;
    }
    /**
    * Create a new deferred object
    */
    function createDeferred<T>(): IDeferred<T>;
    /**
    * Settings related to the serialization of data across iframe boundaries.
    */
    interface ISerializationSettings {
        /**
        * By default, properties that begin with an underscore are not serialized across
        * the iframe boundary. Set this option to true to serialize such properties.
        */
        includeUnderscoreProperties: boolean;
    }
    /**
     * Catalog of objects exposed for XDM
     */
    class XDMObjectRegistry implements IXDMObjectRegistry {
        private _registeredObjects;
        /**
        * Register an object (instance or factory method) exposed by this frame to callers in a remote frame
        *
        * @param instanceId unique id of the registered object
        * @param instance Either: (1) an object instance, or (2) a function that takes optional context data and returns an object instance.
        */
        register(instanceId: string, instance: Object | {
            (contextData?: any): Object;
        }): void;
        /**
        * Get an instance of an object registered with the given id
        *
        * @param instanceId unique id of the registered object
        * @param contextData Optional context data to pass to a registered object's factory method
        */
        getInstance<T>(instanceId: string, contextData?: Object): T;
    }
    /**
    * The registry of global XDM handlers
    */
    var globalObjectRegistry: XDMObjectRegistry;
    /**
     * Represents a channel of communication between frames\document
     * Stays "alive" across multiple funtion\method calls
     */
    class XDMChannel implements IXDMChannel {
        private static _nextChannelId;
        private static MAX_XDM_DEPTH;
        private static WINDOW_TYPES_TO_SKIP_SERIALIZATION;
        private static JQUERY_TYPES_TO_SKIP_SERIALIZATION;
        private _nextMessageId;
        private _deferreds;
        private _postToWindow;
        private _targetOrigin;
        private _handshakeToken;
        private _channelObjectRegistry;
        private _channelId;
        private _nextProxyFunctionId;
        private _proxyFunctions;
        constructor(postToWindow: Window, targetOrigin?: string);
        /**
        * Get the object registry to handle messages from this specific channel.
        * Upon receiving a message, this channel registry will be used first, then
        * the global registry will be used if no handler is found here.
        */
        getObjectRegistry(): IXDMObjectRegistry;
        /**
        * Invoke a method via RPC. Lookup the registered object on the remote end of the channel and invoke the specified method.
        *
        * @param method Name of the method to invoke
        * @param instanceId unique id of the registered object
        * @param params Arguments to the method to invoke
        * @param instanceContextData Optional context data to pass to a registered object's factory method
        * @param serializationSettings Optional serialization settings
        */
        invokeRemoteMethod<T>(methodName: string, instanceId: string, params?: any[], instanceContextData?: Object, serializationSettings?: ISerializationSettings): IPromise<T>;
        /**
        * Get a proxied object that represents the object registered with the given instance id on the remote side of this channel.
        *
        * @param instanceId unique id of the registered object
        * @param contextData Optional context data to pass to a registered object's factory method
        */
        getRemoteObjectProxy<T>(instanceId: string, contextData?: Object): IPromise<T>;
        private invokeMethod(registeredInstance, rpcMessage);
        private getRegisteredObject(instanceId, instanceContext?);
        /**
        * Handle a received message on this channel. Dispatch to the appropriate object found via object registry
        *
        * @param data Message data
        * @param origin Origin of the frame that sent the message
        * @return True if the message was handled by this channel. Otherwise false.
        */
        onMessage(data: any, origin: string): boolean;
        owns(source: Window, origin: string, data: any): boolean;
        error(data: any, errorObj: any): void;
        private _error(messageObj, errorObj, handshakeToken);
        private _success(messageObj, result, handshakeToken);
        private _sendRpcMessage(message);
        private _shouldSkipSerialization(obj);
        private _customSerializeObject(obj, settings, parentObjects?, nextCircularRefId?, depth?);
        private _registerProxyFunction(func, context);
        private _customDeserializeObject(obj, circularRefs?);
    }
    /**
    * Registry of XDM channels kept per target frame/window
    */
    class XDMChannelManager implements IXDMChannelManager {
        private static _default;
        private _channels;
        constructor();
        static get(): XDMChannelManager;
        /**
        * Add an XDM channel for the given target window/iframe
        *
        * @param window Target iframe window to communicate with
        * @param targetOrigin Url of the target iframe (if known)
        */
        addChannel(window: Window, targetOrigin?: string): IXDMChannel;
        private _handleMessageReceived(event);
        private _subscribe(windowObj);
    }
}
declare module VSS {
    var VssSDKVersion: number;
    var VssSDKRestVersion: string;
    /**
    * Service Ids for core services (to be used in VSS.getService)
    */
    module ServiceIds {
        /**
        * Service for showing dialogs in the host frame
        * Use: <IHostDialogService>
        */
        var Dialog: string;
        /**
        * Service for interacting with the host frame's navigation (getting/updating the address/hash, reloading the page, etc.)
        * Use: <IHostNavigationService>
        */
        var Navigation: string;
        /**
        * Service for interacting with extension data (setting/setting documents and collections)
        * Use: <IExtensionDataService>
        */
        var ExtensionData: string;
    }
    /**
     * Initiates the handshake with the host window.
     *
     * @param options Initialization options for the extension.
     */
    function init(options: IExtensionInitializationOptions): void;
    /**
     * Ensures that the AMD loader from the host is configured and fetches a script (AMD) module
     * (and its dependencies). If no callback is supplied, this will still perform an asynchronous
     * fetch of the module (unlike AMD require which returns synchronously). This method has no return value.
     *
     * Usage:
     *
     * VSS.require(["VSS/Controls", "VSS/Controls/Grids"], function(Controls, Grids) {
     *    ...
     * });
     *
     * @param modules A single module path (string) or array of paths (string[])
     * @param callback Method called once the modules have been loaded.
     */
    function require(modules: string[] | string, callback?: Function): void;
    /**
    * Register a callback that gets called once the initial setup/handshake has completed.
    * If the initial setup is already completed, the callback is invoked at the end of the current call stack.
    */
    function ready(callback: () => void): void;
    /**
    * Notifies the host that the extension successfully loaded (stop showing the loading indicator)
    */
    function notifyLoadSucceeded(): void;
    /**
    * Notifies the host that the extension failed to load
    */
    function notifyLoadFailed(e: any): void;
    /**
    * Get the web context from the parent host
    */
    function getWebContext(): WebContext;
    /**
    * Get the configuration data passed in the initial handshake from the parent frame
    */
    function getConfiguration(): any;
    /**
    * Get the context about the extension that owns the content that is being hosted
    */
    function getExtensionContext(): IExtensionContext;
    /**
    * Gets the information about the contribution that first caused this extension to load.
    */
    function getContribution(): Contribution;
    /**
    * Get a contributed service from the parent host.
    *
    * @param contributionId Full Id of the service contribution to get the instance of
    * @param context Optional context information to use when obtaining the service instance
    */
    function getService<T>(contributionId: string, context?: Object): IPromise<T>;
    /**
    * Get the contribution with the given contribution id. The returned contribution has a method to get a registered object within that contribution.
    *
    * @param contributionId Id of the contribution to get
    */
    function getServiceContribution(contributionId: string): IPromise<IServiceContribution>;
    /**
    * Get contributions that target a given contribution id. The returned contributions have a method to get a registered object within that contribution.
    *
    * @param targetContributionId Contributions that target the contribution with this id will be returned
    */
    function getServiceContributions(targetContributionId: string): IPromise<IServiceContribution[]>;
    /**
    * Register an object (instance or factory method) that this extension exposes to the host frame.
    *
    * @param instanceId unique id of the registered object
    * @param instance Either: (1) an object instance, or (2) a function that takes optional context data and returns an object instance.
    */
    function register(instanceId: string, instance: Object | {
        (contextData?: any): Object;
    }): void;
    /**
    * Get an instance of an object registered with the given id
    *
    * @param instanceId unique id of the registered object
    * @param contextData Optional context data to pass to the contructor of an object factory method
    */
    function getRegisteredObject(instanceId: string, contextData?: Object): Object;
    /**
    * Fetch an access token which will allow calls to be made to other VSTS services
    */
    function getAccessToken(): IPromise<ISessionToken>;
    /**
    * Fetch an token which can be used to identify the current user
    */
    function getAppToken(): IPromise<ISessionToken>;
    /**
    * Requests the parent window to resize the container for this extension based on the current extension size.
    *
    * @param width Optional width, defaults to scrollWidth
    * @param height Optional height, defaults to scrollHeight
    */
    function resize(width?: number, height?: number): void;
}
