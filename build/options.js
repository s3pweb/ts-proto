"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTypeToMessages = exports.getTsPoetOpts = exports.optionsFromParameter = exports.defaultOptions = exports.ServiceOption = exports.OneofOption = exports.EnvOption = exports.JsonTimestampOption = exports.DateOption = exports.LongOption = void 0;
var LongOption;
(function (LongOption) {
    LongOption["NUMBER"] = "number";
    LongOption["LONG"] = "long";
    LongOption["STRING"] = "string";
    LongOption["BIGINT"] = "bigint";
})(LongOption || (exports.LongOption = LongOption = {}));
var DateOption;
(function (DateOption) {
    DateOption["DATE"] = "date";
    DateOption["STRING"] = "string";
    DateOption["STRING_NANO"] = "string-nano";
    DateOption["TIMESTAMP"] = "timestamp";
})(DateOption || (exports.DateOption = DateOption = {}));
var JsonTimestampOption;
(function (JsonTimestampOption) {
    JsonTimestampOption["RFC3339"] = "rfc3339";
    JsonTimestampOption["RAW"] = "raw";
})(JsonTimestampOption || (exports.JsonTimestampOption = JsonTimestampOption = {}));
var EnvOption;
(function (EnvOption) {
    EnvOption["NODE"] = "node";
    EnvOption["BROWSER"] = "browser";
    EnvOption["BOTH"] = "both";
})(EnvOption || (exports.EnvOption = EnvOption = {}));
var OneofOption;
(function (OneofOption) {
    OneofOption["PROPERTIES"] = "properties";
    OneofOption["UNIONS"] = "unions";
})(OneofOption || (exports.OneofOption = OneofOption = {}));
var ServiceOption;
(function (ServiceOption) {
    ServiceOption["GRPC"] = "grpc-js";
    ServiceOption["NICE_GRPC"] = "nice-grpc";
    ServiceOption["GENERIC"] = "generic-definitions";
    ServiceOption["DEFAULT"] = "default";
    ServiceOption["NONE"] = "none";
})(ServiceOption || (exports.ServiceOption = ServiceOption = {}));
function defaultOptions() {
    return {
        context: false,
        snakeToCamel: ["json", "keys"],
        emitDefaultValues: [],
        globalThisPolyfill: false,
        forceLong: LongOption.NUMBER,
        useJsTypeOverride: false,
        useOptionals: "none",
        useDate: DateOption.DATE,
        useJsonTimestamp: JsonTimestampOption.RFC3339,
        useMongoObjectId: false,
        oneof: OneofOption.PROPERTIES,
        esModuleInterop: false,
        fileSuffix: "",
        importSuffix: "",
        lowerCaseServiceMethods: false,
        outputEncodeMethods: true,
        outputJsonMethods: true,
        outputPartialMethods: true,
        outputTypeAnnotations: false,
        outputTypeRegistry: false,
        stringEnums: false,
        constEnums: false,
        removeEnumPrefix: false,
        enumsAsLiterals: false,
        outputClientImpl: true,
        outputServices: [],
        returnObservable: false,
        addGrpcMetadata: false,
        metadataType: undefined,
        addNestjsRestParameter: false,
        nestJs: false,
        env: EnvOption.BOTH,
        unrecognizedEnum: true,
        unrecognizedEnumName: "UNRECOGNIZED",
        unrecognizedEnumValue: -1,
        exportCommonSymbols: true,
        outputSchema: false,
        onlyTypes: false,
        emitImportedFiles: true,
        useExactTypes: true,
        useAbortSignal: false,
        useAsyncIterable: false,
        unknownFields: false,
        usePrototypeForDefaults: false,
        useJsonName: false,
        useJsonWireFormat: false,
        useNumericEnumForJson: false,
        initializeFieldsAsUndefined: true,
        useMapType: false,
        useReadonlyTypes: false,
        useSnakeTypeName: true,
        outputExtensions: false,
        outputIndex: false,
        M: {},
        rpcBeforeRequest: false,
        rpcAfterResponse: false,
        rpcErrorHandler: false,
        comments: true,
        disableProto2Optionals: false,
        disableProto2DefaultValues: false,
        useNullAsOptional: false,
    };
}
exports.defaultOptions = defaultOptions;
const nestJsOptions = {
    lowerCaseServiceMethods: true,
    outputEncodeMethods: false,
    outputJsonMethods: false,
    outputPartialMethods: false,
    outputClientImpl: false,
    useDate: DateOption.TIMESTAMP,
};
function optionsFromParameter(parameter) {
    const options = defaultOptions();
    if (parameter) {
        const parsed = parseParameter(parameter);
        if (parsed.nestJs) {
            Object.assign(options, nestJsOptions);
        }
        Object.assign(options, parsed);
    }
    // onlyTypes=true implies outputJsonMethods=false,outputEncodeMethods=false,outputClientImpl=false,nestJs=false
    if (options.onlyTypes) {
        options.outputJsonMethods = false;
        options.outputEncodeMethods = false;
        options.outputClientImpl = false;
        options.nestJs = false;
    }
    else if (!options.outputJsonMethods &&
        !options.outputEncodeMethods &&
        !options.outputClientImpl &&
        !options.nestJs) {
        options.onlyTypes = true;
    }
    // Treat forceLong=true as LONG
    if (options.forceLong === true) {
        options.forceLong = LongOption.LONG;
    }
    // Treat outputServices=false as NONE
    if (options.outputServices === false) {
        options.outputServices = [ServiceOption.NONE];
    }
    // Existing type-coercion inside parseParameter leaves a little to be desired.
    if (typeof options.outputServices == "string") {
        options.outputServices = [options.outputServices];
    }
    // Assume the user wants the default service output, unless they're using nestJs, which has
    // its own controllers output (although nestjs users can ask for other services too).
    if (options.outputServices.length == 0 && !options.nestJs) {
        options.outputServices = [ServiceOption.DEFAULT];
    }
    // If using nestJs + other services, add the encode methods back
    if (options.nestJs && options.outputServices.length > 0) {
        options.outputEncodeMethods = true;
    }
    if (options.useDate === true) {
        // Treat useDate=true as DATE
        options.useDate = DateOption.DATE;
    }
    else if (options.useDate === false) {
        // Treat useDate=false as TIMESTAMP
        options.useDate = DateOption.TIMESTAMP;
    }
    if (options.snakeToCamel === false) {
        options.snakeToCamel = [];
    }
    else if (options.snakeToCamel === true) {
        options.snakeToCamel = ["keys", "json"];
    }
    else if (typeof options.snakeToCamel === "string") {
        options.snakeToCamel = options.snakeToCamel.split("_");
    }
    if (options.emitDefaultValues === "json-methods") {
        options.emitDefaultValues = ["json-methods"];
    }
    else {
        options.emitDefaultValues = [];
    }
    if (options.useJsonWireFormat) {
        if (!options.onlyTypes) {
            // useJsonWireFormat requires onlyTypes=true
            options.useJsonWireFormat = false;
        }
        else {
            // useJsonWireFormat implies stringEnums=true and useDate=string
            options.stringEnums = true;
            options.useDate = DateOption.STRING;
        }
    }
    if (options.nestJs) {
        options.initializeFieldsAsUndefined = false;
    }
    if (options.outputIndex) {
        options.exportCommonSymbols = false;
    }
    if (options.rpcBeforeRequest || options.rpcAfterResponse || options.rpcErrorHandler) {
        const includesGeneric = options.outputServices.includes(ServiceOption.GENERIC);
        options.outputServices = [ServiceOption.DEFAULT];
        if (includesGeneric) {
            options.outputServices.push(ServiceOption.GENERIC);
        }
    }
    if (options.unrecognizedEnumValue) {
        // Make sure to cast number options to an actual number
        options.unrecognizedEnumValue = Number(options.unrecognizedEnumValue);
    }
    return options;
}
exports.optionsFromParameter = optionsFromParameter;
// A very naive parse function, eventually could/should use iots/runtypes
function parseParameter(parameter) {
    const options = { M: {} };
    parameter.split(",").forEach((param) => {
        // same as protoc-gen-go https://github.com/protocolbuffers/protobuf-go/blob/bf9455640daabb98c93b5b5e71628f3f813d57bb/compiler/protogen/protogen.go#L168-L171
        const optionSeparatorPos = param.indexOf("=");
        const key = param.substring(0, optionSeparatorPos);
        const value = parseParamValue(param.substring(optionSeparatorPos + 1));
        if (key.charAt(0) === "M") {
            if (typeof value !== "string") {
                console.warn(`ignoring invalid M option: '${param}'`);
            }
            else {
                const mKey = key.substring(1);
                if (options.M[mKey]) {
                    console.warn(`received conflicting M options: '${param}' will override 'M${mKey}=${options.M[mKey]}'`);
                }
                if (param.endsWith(".ts")) {
                    console.warn(`received M option '${param}' ending in '.ts' this is usually a mistake`);
                }
                options.M[mKey] = value;
            }
        }
        else if (options[key]) {
            options[key] = [options[key], value];
        }
        else {
            options[key] = value;
        }
    });
    return options;
}
function parseParamValue(value) {
    return value === "true" ? true : value === "false" ? false : value;
}
function getTsPoetOpts(options) {
    const { importSuffix, esModuleInterop } = options;
    const pbjs = "protobufjs/minimal" + importSuffix;
    return {
        prefix: `/* eslint-disable */`,
        dprintOptions: { preferSingleLine: true, lineWidth: 120 },
        forceRequireImport: esModuleInterop ? [] : ["long"],
        forceDefaultImport: esModuleInterop ? [pbjs] : [],
        forceModuleImport: esModuleInterop ? [] : [pbjs],
    };
}
exports.getTsPoetOpts = getTsPoetOpts;
function addTypeToMessages(options) {
    return ((options.outputTypeAnnotations || options.outputTypeRegistry) && options.outputTypeAnnotations !== "static-only");
}
exports.addTypeToMessages = addTypeToMessages;