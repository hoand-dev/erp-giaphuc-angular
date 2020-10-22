/* declare json module */
declare module "*.json" {
    const value: any;
    export default value;
}

/* declare globalize module */
declare module 'globalize' {
    const value: any;
    export default value;
}

/* declare devextreme localization */
declare module 'devextreme/localization/messages/*' {
    const value: any;
    export default value;
}

declare module 'devextreme-cldr-data/*' {
    const value: any;
    export default value;
}