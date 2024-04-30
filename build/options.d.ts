import { ToStringOpts } from "ts-poet/build/Code";
export declare enum LongOption {
    NUMBER = "number",
    LONG = "long",
    STRING = "string",
    BIGINT = "bigint"
}
export declare enum DateOption {
    DATE = "date",
    STRING = "string",
    STRING_NANO = "string-nano",
    TIMESTAMP = "timestamp"
}
export declare enum JsonTimestampOption {
    RFC3339 = "rfc3339",
    RAW = "raw"
}
export declare enum EnvOption {
    NODE = "node",
    BROWSER = "browser",
    BOTH = "both"
}
export declare enum OneofOption {
    PROPERTIES = "properties",
    UNIONS = "unions"
}
export declare enum ServiceOption {
    GRPC = "grpc-js",
    NICE_GRPC = "nice-grpc",
    GENERIC = "generic-definitions",
    DEFAULT = "default",
    NONE = "none"
}
export type Options = {
    context: boolean;
    snakeToCamel: Array<"json" | "keys">;
    forceLong: LongOption;
    useJsTypeOverride: boolean;
    globalThisPolyfill: boolean;
    useOptionals: boolean | "none" | "deprecatedOnly" | "messages" | "all";
    emitDefaultValues: Array<"json-methods">;
    useDate: DateOption;
    useJsonTimestamp: JsonTimestampOption;
    useMongoObjectId: boolean;
    oneof: OneofOption;
    esModuleInterop: boolean;
    fileSuffix: string;
    importSuffix: string;
    outputEncodeMethods: true | false | "encode-only" | "decode-only" | "encode-no-creation";
    outputJsonMethods: true | false | "to-only" | "from-only";
    outputPartialMethods: boolean;
    outputTypeAnnotations: boolean | "static-only" | "optional";
    outputTypeRegistry: boolean;
    stringEnums: boolean;
    constEnums: boolean;
    removeEnumPrefix: boolean;
    enumsAsLiterals: boolean;
    outputClientImpl: boolean | "grpc-web";
    outputServices: ServiceOption[];
    addGrpcMetadata: boolean;
    metadataType: string | undefined;
    addNestjsRestParameter: boolean;
    returnObservable: boolean;
    lowerCaseServiceMethods: boolean;
    nestJs: boolean;
    env: EnvOption;
    unrecognizedEnum: boolean;
    unrecognizedEnumName: string;
    unrecognizedEnumValue: number;
    exportCommonSymbols: boolean;
    outputSchema: boolean;
    onlyTypes: boolean;
    emitImportedFiles: boolean;
    useAbortSignal: boolean;
    useExactTypes: boolean;
    useAsyncIterable: boolean;
    unknownFields: boolean;
    usePrototypeForDefaults: boolean;
    useJsonName: boolean;
    useJsonWireFormat: boolean;
    useNumericEnumForJson: boolean;
    initializeFieldsAsUndefined: boolean;
    useMapType: boolean;
    useReadonlyTypes: boolean;
    useSnakeTypeName: boolean;
    outputExtensions: boolean;
    outputIndex: boolean;
    M: {
        [from: string]: string;
    };
    rpcBeforeRequest: boolean;
    rpcAfterResponse: boolean;
    rpcErrorHandler: boolean;
    comments: boolean;
    disableProto2Optionals: boolean;
    disableProto2DefaultValues: boolean;
    useNullAsOptional: boolean;
};
export declare function defaultOptions(): Options;
export declare function optionsFromParameter(parameter: string | undefined): Options;
export declare function getTsPoetOpts(options: Options): ToStringOpts;
export declare function addTypeToMessages(options: Options): boolean;