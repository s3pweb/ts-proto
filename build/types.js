"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectBatchMethod = exports.responsePromiseOrObservable = exports.responseObservable = exports.responsePromise = exports.responseType = exports.requestType = exports.observableType = exports.rawRequestType = exports.detectMapType = exports.shouldGenerateJSMapType = exports.toTypeName = exports.getEnumMethod = exports.messageToTypeName = exports.wrapperTypeName = exports.valueTypeName = exports.isEmptyType = exports.isLongValueType = exports.isStructTypeName = exports.isStructType = exports.isListValueTypeName = exports.isListValueType = exports.isFieldMaskTypeName = exports.isFieldMaskType = exports.isBytesValueType = exports.isAnyValueTypeName = exports.isAnyValueType = exports.isValueType = exports.isTimestamp = exports.isObjectId = exports.isMapType = exports.isWholeNumber = exports.isLong = exports.isRepeated = exports.isWithinOneOfThatShouldBeUnion = exports.isWithinOneOf = exports.isEnum = exports.isMessage = exports.isBytes = exports.isPrimitive = exports.isOptionalProperty = exports.isScalar = exports.createTypeMap = exports.notDefaultCheck = exports.defaultValue = exports.getFieldOptionsJsType = exports.packedType = exports.toReaderCall = exports.basicTypeName = exports.basicLongWireType = exports.basicWireType = void 0;
exports.isJsTypeFieldOption = void 0;
const ts_proto_descriptors_1 = require("ts-proto-descriptors");
const ts_poet_1 = require("ts-poet");
const options_1 = require("./options");
const visit_1 = require("./visit");
const utils_1 = require("./utils");
const sourceInfo_1 = require("./sourceInfo");
const case_1 = require("./case");
const enums_1 = require("./enums");
/** Based on https://github.com/dcodeIO/protobuf.js/blob/master/src/types.js#L37. */
function basicWireType(type) {
    switch (type) {
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_DOUBLE:
            return 1;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FLOAT:
            return 5;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_ENUM:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT32:
            return 0;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED32:
            return 5;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT64:
            return 0;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64:
            return 1;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BOOL:
            return 0;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_MESSAGE:
            return 2;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_GROUP:
            return 3;
        default:
            throw new Error("Invalid type " + type);
    }
}
exports.basicWireType = basicWireType;
function basicLongWireType(type) {
    switch (type) {
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT64:
            return 0;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64:
            return 1;
        default:
            return undefined;
    }
}
exports.basicLongWireType = basicLongWireType;
/** Returns the type name without any repeated/required/etc. labels. */
function basicTypeName(ctx, field, typeOptions = {}) {
    var _a, _b;
    const { options } = ctx;
    const fieldType = (_a = getFieldOptionsJsType(field, ctx.options)) !== null && _a !== void 0 ? _a : field.type;
    switch (fieldType) {
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_DOUBLE:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FLOAT:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED32:
            return (0, ts_poet_1.code) `number`;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64:
            return isJsTypeFieldOption(options, field)
                ? (_b = jsTypeName(field)) !== null && _b !== void 0 ? _b : longTypeName(ctx)
                : // this handles 2^53, Long is only needed for 2^64; this is effectively pbjs's forceNumber
                    longTypeName(ctx);
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BOOL:
            return (0, ts_poet_1.code) `boolean`;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING:
            return (0, ts_poet_1.code) `string`;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES:
            if (options.env === options_1.EnvOption.NODE) {
                return (0, ts_poet_1.code) `Buffer`;
            }
            else {
                return (0, ts_poet_1.code) `Uint8Array`;
            }
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_MESSAGE:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_GROUP:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_ENUM:
            return messageToTypeName(ctx, field.typeName, { ...typeOptions, repeated: isRepeated(field) });
        default:
            return (0, ts_poet_1.code) `${field.typeName}`;
    }
}
exports.basicTypeName = basicTypeName;
/** Returns the Reader method for the primitive's read/write call. */
function toReaderCall(field) {
    switch (field.type) {
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_DOUBLE:
            return "double";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FLOAT:
            return "float";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_ENUM:
            return "int32";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT32:
            return "uint32";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT32:
            return "sint32";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED32:
            return "fixed32";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED32:
            return "sfixed32";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64:
            return "int64";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64:
            return "uint64";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT64:
            return "sint64";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64:
            return "fixed64";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64:
            return "sfixed64";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BOOL:
            return "bool";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING:
            return "string";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES:
            return "bytes";
        default:
            throw new Error(`Not a primitive field ${field}`);
    }
}
exports.toReaderCall = toReaderCall;
function packedType(type) {
    switch (type) {
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_DOUBLE:
            return 1;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FLOAT:
            return 5;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_ENUM:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT32:
            return 0;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED32:
            return 5;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT64:
            return 0;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64:
            return 1;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BOOL:
            return 0;
        default:
            return undefined;
    }
}
exports.packedType = packedType;
function getFieldOptionsJsType(field, options) {
    var _a;
    if (!options.useJsTypeOverride || ((_a = field.options) === null || _a === void 0 ? void 0 : _a.jstype) === undefined) {
        return;
    }
    switch (field.options.jstype) {
        case ts_proto_descriptors_1.FieldOptions_JSType.JS_STRING:
            return ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING;
        case ts_proto_descriptors_1.FieldOptions_JSType.JS_NUMBER:
            return ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64;
        // In the case of JS_NORMAL, we don't want to override the type, so we return
        case ts_proto_descriptors_1.FieldOptions_JSType.JS_NORMAL:
        // In the case of UNRECOGNIZED, we assume default behavior and we don't want to override the type, so we return
        case ts_proto_descriptors_1.FieldOptions_JSType.UNRECOGNIZED:
            return;
    }
}
exports.getFieldOptionsJsType = getFieldOptionsJsType;
function defaultValue(ctx, field) {
    const { typeMap, options, utils, currentFile } = ctx;
    const useDefaultValue = !currentFile.isProto3Syntax && !options.disableProto2DefaultValues && field.defaultValue;
    const numericDefaultVal = useDefaultValue ? field.defaultValue : 0;
    switch (field.type) {
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_DOUBLE:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FLOAT:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED32:
            return numericDefaultVal;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_ENUM:
            // proto3 enforces enums starting at 0, however proto2 does not, so we have
            // to probe and see if zero is an allowed value. If it's not, pick the first one.
            // This is probably not great, but it's only used in fromJSON and fromPartial,
            // and I believe the semantics of those in the proto2 world are generally undefined.
            const typeInfo = typeMap.get(field.typeName);
            const enumProto = typeInfo[2];
            const defaultEnum = enumProto.value.find((v) => (useDefaultValue ? v.name === field.defaultValue : v.number === 0)) ||
                enumProto.value[0];
            if (options.stringEnums) {
                const enumType = messageToTypeName(ctx, field.typeName);
                return (0, ts_poet_1.code) `${enumType}.${(0, enums_1.getMemberName)(ctx, enumProto, defaultEnum)}`;
            }
            else {
                return defaultEnum.number;
            }
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64:
            if (isJsTypeFieldOption(options, field)) {
                switch (field.options.jstype) {
                    case ts_proto_descriptors_1.FieldOptions_JSType.JS_STRING:
                        return `"${numericDefaultVal}"`;
                    case ts_proto_descriptors_1.FieldOptions_JSType.JS_NUMBER:
                        return numericDefaultVal;
                }
            }
            if (options.forceLong === options_1.LongOption.LONG) {
                const value = field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64 || field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64
                    ? "UZERO"
                    : "ZERO";
                return (0, ts_poet_1.code) `${utils.Long}.${useDefaultValue ? "fromNumber" : value}${useDefaultValue ? `(${numericDefaultVal})` : ""}`;
            }
            else if (options.forceLong === options_1.LongOption.STRING) {
                return `"${numericDefaultVal}"`;
            }
            else if (options.forceLong === options_1.LongOption.BIGINT) {
                return `BigInt("${numericDefaultVal}")`;
            }
            else {
                return numericDefaultVal;
            }
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BOOL:
            return useDefaultValue ? field.defaultValue : false;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING:
            return useDefaultValue ? `"${field.defaultValue}"` : '""';
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES:
            // todo(proto2): need to look into all the possible default values for the bytes type, and handle each one
            if (options.env === options_1.EnvOption.NODE) {
                return "Buffer.alloc(0)";
            }
            return "new Uint8Array(0)";
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_MESSAGE:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_GROUP:
        default:
            return (0, utils_1.nullOrUndefined)(options);
    }
}
exports.defaultValue = defaultValue;
/** Creates code that checks that the field is not the default value. Supports scalars and enums. */
function notDefaultCheck(ctx, field, messageOptions, place) {
    const { typeMap, options, currentFile } = ctx;
    const isOptional = isOptionalProperty(field, messageOptions, options, currentFile.isProto3Syntax);
    const maybeNotUndefinedAnd = isOptional
        ? `${place} !== undefined ${(0, utils_1.withAndMaybeCheckIsNotNull)(options, place)} &&`
        : "";
    switch (field.type) {
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_DOUBLE:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FLOAT:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED32:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BOOL:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING:
            return (0, ts_poet_1.code) `${maybeNotUndefinedAnd} ${place} !== ${defaultValue(ctx, field)}`;
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_ENUM:
            // proto3 enforces enums starting at 0, however proto2 does not, so we have
            // to probe and see if zero is an allowed value. If it's not, pick the first one.
            // This is probably not great, but it's only used in fromJSON and fromPartial,
            // and I believe the semantics of those in the proto2 world are generally undefined.
            const typeInfo = typeMap.get(field.typeName);
            const enumProto = typeInfo[2];
            const defaultEnum = enumProto.value.find((v) => v.number === defaultValue(ctx, field)) || enumProto.value[0];
            if (options.stringEnums) {
                const enumType = messageToTypeName(ctx, field.typeName);
                const enumValue = (0, enums_1.getMemberName)(ctx, enumProto, defaultEnum);
                return (0, ts_poet_1.code) `${maybeNotUndefinedAnd} ${place} !== ${enumType}.${enumValue}`;
            }
            else {
                return (0, ts_poet_1.code) `${maybeNotUndefinedAnd} ${place} !== ${defaultEnum.number}`;
            }
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT64:
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64:
            if (options.forceLong === options_1.LongOption.LONG && !isJsTypeFieldOption(options, field)) {
                return (0, ts_poet_1.code) `${maybeNotUndefinedAnd} !${place}.equals(${defaultValue(ctx, field)})`;
            }
            else {
                return (0, ts_poet_1.code) `${maybeNotUndefinedAnd} ${place} !== ${defaultValue(ctx, field)}`;
            }
        case ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES:
            // todo(proto2): need to look into all the possible default values for the bytes type, and handle each one
            return (0, ts_poet_1.code) `${maybeNotUndefinedAnd} ${place}.length !== 0`;
        default:
            throw new Error("Not implemented for the given type.");
    }
}
exports.notDefaultCheck = notDefaultCheck;
/** Scans all of the proto files in `request` and builds a map of proto typeName -> TS module/name. */
function createTypeMap(request, options) {
    const typeMap = new Map();
    for (const file of request.protoFile) {
        // We assume a file.name of google/protobuf/wrappers.proto --> a module path of google/protobuf/wrapper.ts
        const moduleName = file.name.replace(".proto", "");
        // So given a fullName like FooMessage_InnerMessage, proto will see that as package.name.FooMessage.InnerMessage
        function saveMapping(tsFullName, desc, s, protoFullName) {
            // package is optional, but make sure we have a dot-prefixed type name either way
            const prefix = file.package.length === 0 ? "" : `.${file.package}`;
            typeMap.set(`${prefix}.${protoFullName}`, [moduleName, tsFullName, desc]);
        }
        (0, visit_1.visit)(file, sourceInfo_1.default.empty(), saveMapping, options, saveMapping);
    }
    return typeMap;
}
exports.createTypeMap = createTypeMap;
/** A "Scalar Value Type" as defined in https://developers.google.com/protocol-buffers/docs/proto3#scalar */
function isScalar(field) {
    const scalarTypes = [
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_DOUBLE,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FLOAT,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT32,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT32,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT32,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT64,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED32,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED32,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BOOL,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_STRING,
        ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES,
    ];
    return scalarTypes.includes(field.type);
}
exports.isScalar = isScalar;
// When useOptionals='messages', non-scalar fields are translated into optional
// properties.
// When useOptionals='all', all fields are translated into
// optional properties, with the exception of map Entry key/values, which must
// always be present.
// When useOptionals='deprecatedOnly', all deprecated fields are translated into
// optional properties, with the exception of map Entry key/values, which must
// always be present.
// OneOf fields are always optional, whenever oneof=unions option not in use.
function isOptionalProperty(field, messageOptions, options, isProto3Syntax) {
    var _a, _b, _c, _d;
    const optionalMessages = options.useOptionals === true || options.useOptionals === "messages" || options.useOptionals === "all";
    const optionalAll = options.useOptionals === "all";
    const deprecatedOnly = options.useOptionals === "deprecatedOnly" && field.options && field.options.deprecated;
    const repeatedOptional = (_d = (_c = (_b = (_a = field === null || field === void 0 ? void 0 : field.options) === null || _a === void 0 ? void 0 : _a._unknownFields) === null || _b === void 0 ? void 0 : _b[7777 * 8]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.includes(1);
    return ((repeatedOptional && isRepeated(field)) ||
        (optionalMessages && isMessage(field)) ||
        ((optionalAll || deprecatedOnly) && !(messageOptions === null || messageOptions === void 0 ? void 0 : messageOptions.mapEntry)) ||
        // file is proto2, we have enabled proto2 optionals, and the field itself is optional
        (!isProto3Syntax &&
            field.label === ts_proto_descriptors_1.FieldDescriptorProto_Label.LABEL_OPTIONAL &&
            !(messageOptions === null || messageOptions === void 0 ? void 0 : messageOptions.mapEntry) &&
            !options.disableProto2Optionals) ||
        // don't bother verifying that oneof is not union. union oneofs generate their own properties.
        isWithinOneOf(field) ||
        field.proto3Optional);
}
exports.isOptionalProperty = isOptionalProperty;
/** This includes all scalars, enums and the [groups type](https://developers.google.com/protocol-buffers/docs/reference/java/com/google/protobuf/DescriptorProtos.FieldDescriptorProto.Type.html#TYPE_GROUP) */
function isPrimitive(field) {
    return !isMessage(field);
}
exports.isPrimitive = isPrimitive;
function isBytes(field) {
    return field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BYTES;
}
exports.isBytes = isBytes;
function isMessage(field) {
    return field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_MESSAGE || field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_GROUP;
}
exports.isMessage = isMessage;
function isEnum(field) {
    return field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_ENUM;
}
exports.isEnum = isEnum;
function isWithinOneOf(field) {
    return field.hasOwnProperty("oneofIndex");
}
exports.isWithinOneOf = isWithinOneOf;
function isWithinOneOfThatShouldBeUnion(options, field) {
    return isWithinOneOf(field) && options.oneof === options_1.OneofOption.UNIONS && !field.proto3Optional;
}
exports.isWithinOneOfThatShouldBeUnion = isWithinOneOfThatShouldBeUnion;
function isRepeated(field) {
    return field.label === ts_proto_descriptors_1.FieldDescriptorProto_Label.LABEL_REPEATED;
}
exports.isRepeated = isRepeated;
function isLong(field) {
    return basicLongWireType(field.type) !== undefined;
}
exports.isLong = isLong;
function isWholeNumber(field) {
    return (field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT32 ||
        field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_INT64 ||
        field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT32 ||
        field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_UINT64 ||
        field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT32 ||
        field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SINT64 ||
        field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED32 ||
        field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_FIXED64 ||
        field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED32 ||
        field.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_SFIXED64);
}
exports.isWholeNumber = isWholeNumber;
function isMapType(ctx, messageDesc, field) {
    return detectMapType(ctx, messageDesc, field) !== undefined;
}
exports.isMapType = isMapType;
function isObjectId(field) {
    // need to use endsWith instead of === because objectid could be imported from an external proto file
    return field.typeName.endsWith(".ObjectId");
}
exports.isObjectId = isObjectId;
function isTimestamp(field) {
    return field.typeName === ".google.protobuf.Timestamp";
}
exports.isTimestamp = isTimestamp;
function isValueType(ctx, field) {
    return valueTypeName(ctx, field.typeName) !== undefined;
}
exports.isValueType = isValueType;
function isAnyValueType(field) {
    return isAnyValueTypeName(field.typeName);
}
exports.isAnyValueType = isAnyValueType;
function isAnyValueTypeName(typeName) {
    return typeName === "google.protobuf.Value" || typeName === ".google.protobuf.Value";
}
exports.isAnyValueTypeName = isAnyValueTypeName;
function isBytesValueType(field) {
    return field.typeName === ".google.protobuf.BytesValue";
}
exports.isBytesValueType = isBytesValueType;
function isFieldMaskType(field) {
    return isFieldMaskTypeName(field.typeName);
}
exports.isFieldMaskType = isFieldMaskType;
function isFieldMaskTypeName(typeName) {
    return typeName === "google.protobuf.FieldMask" || typeName === ".google.protobuf.FieldMask";
}
exports.isFieldMaskTypeName = isFieldMaskTypeName;
function isListValueType(field) {
    return isListValueTypeName(field.typeName);
}
exports.isListValueType = isListValueType;
function isListValueTypeName(typeName) {
    return typeName === "google.protobuf.ListValue" || typeName === ".google.protobuf.ListValue";
}
exports.isListValueTypeName = isListValueTypeName;
function isStructType(field) {
    return isStructTypeName(field.typeName);
}
exports.isStructType = isStructType;
function isStructTypeName(typeName) {
    return typeName === "google.protobuf.Struct" || typeName === ".google.protobuf.Struct";
}
exports.isStructTypeName = isStructTypeName;
function isLongValueType(field) {
    return field.typeName === ".google.protobuf.Int64Value" || field.typeName === ".google.protobuf.UInt64Value";
}
exports.isLongValueType = isLongValueType;
function isEmptyType(typeName) {
    return typeName === ".google.protobuf.Empty";
}
exports.isEmptyType = isEmptyType;
function valueTypeName(ctx, typeName) {
    switch (typeName) {
        case ".google.protobuf.StringValue":
            return (0, ts_poet_1.code) `string`;
        case ".google.protobuf.Int32Value":
        case ".google.protobuf.UInt32Value":
        case ".google.protobuf.DoubleValue":
        case ".google.protobuf.FloatValue":
            return (0, ts_poet_1.code) `number`;
        case ".google.protobuf.Int64Value":
        case ".google.protobuf.UInt64Value":
            // return options ? longTypeName(options) : code`number`;
            return longTypeName(ctx);
        case ".google.protobuf.BoolValue":
            return (0, ts_poet_1.code) `boolean`;
        case ".google.protobuf.BytesValue":
            return ctx.options.env === options_1.EnvOption.NODE
                ? (0, ts_poet_1.code) `Buffer`
                : ctx.options.useJsonWireFormat
                    ? (0, ts_poet_1.code) `string`
                    : (0, ts_poet_1.code) `Uint8Array`;
        case ".google.protobuf.ListValue":
            return ctx.options.useReadonlyTypes ? (0, ts_poet_1.code) `ReadonlyArray<any>` : (0, ts_poet_1.code) `Array<any>`;
        case ".google.protobuf.Value":
            return (0, ts_poet_1.code) `any`;
        case ".google.protobuf.Struct":
            return ctx.options.useReadonlyTypes ? (0, ts_poet_1.code) `{readonly [key: string]: any}` : (0, ts_poet_1.code) `{[key: string]: any}`;
        case ".google.protobuf.FieldMask":
            return ctx.options.useJsonWireFormat
                ? (0, ts_poet_1.code) `string`
                : ctx.options.useReadonlyTypes
                    ? (0, ts_poet_1.code) `readonly string[]`
                    : (0, ts_poet_1.code) `string[]`;
        case ".google.protobuf.Duration":
            return ctx.options.useJsonWireFormat ? (0, ts_poet_1.code) `string` : undefined;
        case ".google.protobuf.Timestamp":
            return ctx.options.useJsonWireFormat ? (0, ts_poet_1.code) `string` : undefined;
        default:
            return undefined;
    }
}
exports.valueTypeName = valueTypeName;
function wrapperTypeName(typeName) {
    switch (typeName) {
        case ".google.protobuf.StringValue":
        case ".google.protobuf.Int32Value":
        case ".google.protobuf.UInt32Value":
        case ".google.protobuf.DoubleValue":
        case ".google.protobuf.FloatValue":
        case ".google.protobuf.Int64Value":
        case ".google.protobuf.UInt64Value":
        case ".google.protobuf.BoolValue":
        case ".google.protobuf.BytesValue":
        case ".google.protobuf.ListValue":
        case ".google.protobuf.Timestamp":
        case ".google.protobuf.Struct":
        case ".google.protobuf.Value":
            return typeName.split(".")[3];
        default:
            return undefined;
    }
}
exports.wrapperTypeName = wrapperTypeName;
function longTypeName(ctx) {
    const { options, utils } = ctx;
    if (options.forceLong === options_1.LongOption.LONG) {
        return (0, ts_poet_1.code) `${utils.Long}`;
    }
    else if (options.forceLong === options_1.LongOption.STRING) {
        return (0, ts_poet_1.code) `string`;
    }
    else if (options.forceLong === options_1.LongOption.BIGINT) {
        return (0, ts_poet_1.code) `bigint`;
    }
    else {
        return (0, ts_poet_1.code) `number`;
    }
}
function jsTypeName(field) {
    var _a, _b;
    if (((_a = field.options) === null || _a === void 0 ? void 0 : _a.jstype) === ts_proto_descriptors_1.FieldOptions_JSType.JS_STRING) {
        return (0, ts_poet_1.code) `string`;
    }
    else if (((_b = field.options) === null || _b === void 0 ? void 0 : _b.jstype) === ts_proto_descriptors_1.FieldOptions_JSType.JS_NUMBER) {
        return (0, ts_poet_1.code) `number`;
    }
}
/** Maps `.some_proto_namespace.Message` to a TypeName. */
function messageToTypeName(ctx, protoType, typeOptions = {}) {
    var _a;
    const { options, typeMap } = ctx;
    // Watch for the wrapper types `.google.protobuf.*Value`. If we're mapping
    // them to basic built-in types, we union the type with undefined to
    // indicate the value is optional. Exceptions:
    // - If the field is repeated, values cannot be undefined.
    let valueType = valueTypeName(ctx, protoType);
    if (!typeOptions.keepValueType && valueType) {
        if ((_a = typeOptions.repeated) !== null && _a !== void 0 ? _a : false) {
            return valueType;
        }
        return (0, ts_poet_1.code) `${valueType} | ${(0, utils_1.nullOrUndefined)(options)}`;
    }
    // Look for other special prototypes like Timestamp that aren't technically wrapper types
    if (!typeOptions.keepValueType && protoType === ".google.protobuf.Timestamp") {
        if (options.useDate == options_1.DateOption.DATE) {
            return (0, ts_poet_1.code) `Date`;
        }
        if (options.useDate == options_1.DateOption.STRING || options.useDate == options_1.DateOption.STRING_NANO) {
            return (0, ts_poet_1.code) `string`;
        }
    }
    // need to use endsWith instead of === because objectid could be imported from an external proto file
    if (!typeOptions.keepValueType && options.useMongoObjectId && protoType.endsWith(".ObjectId")) {
        return (0, ts_poet_1.code) `mongodb.ObjectId`;
    }
    const [module, type] = toModuleAndType(typeMap, protoType);
    return (0, ts_poet_1.code) `${(0, utils_1.impProto)(options, module, type)}`;
}
exports.messageToTypeName = messageToTypeName;
/** Breaks `.some_proto_namespace.Some.Message` into `['some_proto_namespace', 'Some_Message', Descriptor]. */
function toModuleAndType(typeMap, protoType) {
    return typeMap.get(protoType) || (0, utils_1.fail)(`No type found for ${protoType}`);
}
function getEnumMethod(ctx, enumProtoType, methodSuffix) {
    const [module, type] = toModuleAndType(ctx.typeMap, enumProtoType);
    return (0, utils_1.impProto)(ctx.options, module, `${(0, case_1.uncapitalize)(type)}${methodSuffix}`);
}
exports.getEnumMethod = getEnumMethod;
/** Return the TypeName for any field (primitive/message/etc.) as exposed in the interface. */
function toTypeName(ctx, messageDesc, field, ensureOptional = false) {
    var _a;
    function finalize(type, isOptional) {
        if (isOptional) {
            return (0, ts_poet_1.code) `${type} | ${(0, utils_1.nullOrUndefined)(ctx.options, field.proto3Optional)}`;
        }
        return type;
    }
    const fieldType = (_a = getFieldOptionsJsType(field, ctx.options)) !== null && _a !== void 0 ? _a : field.type;
    const type = basicTypeName(ctx, { ...field, type: fieldType }, { keepValueType: false });
    if (isRepeated(field)) {
        const mapType = messageDesc ? detectMapType(ctx, messageDesc, field) : false;
        if (mapType) {
            const { keyType, valueType } = mapType;
            if (shouldGenerateJSMapType(ctx, messageDesc, field)) {
                return finalize((0, ts_poet_1.code) `Map<${keyType}, ${valueType}>`, ensureOptional);
            }
            return finalize((0, ts_poet_1.code) `{ [key: ${keyType} ]: ${valueType} }`, ensureOptional);
        }
        if (ctx.options.useReadonlyTypes) {
            return finalize((0, ts_poet_1.code) `readonly ${type}[]`, ensureOptional);
        }
        return finalize((0, ts_poet_1.code) `${type}[]`, ensureOptional);
    }
    if (isValueType(ctx, field)) {
        // google.protobuf.*Value types are already unioned with `undefined`
        // in messageToTypeName, so no need to consider them for that here.
        return finalize(type, false);
    }
    // By default (useOptionals='none', oneof=properties), non-scalar fields
    // outside oneofs and all fields within a oneof clause need to be unioned
    // with `undefined` to indicate the value is optional.
    //
    // When useOptionals='messages' or useOptionals='all', non-scalar fields are
    // translated to optional properties, so no need for the union with
    // `undefined` here.
    //
    // When oneof=unions, we generate a single property for the entire `oneof`
    // clause, spelling each option out inside a large type union. No need for
    // union with `undefined` here, either.
    const { options } = ctx;
    return finalize(type, (!isWithinOneOf(field) &&
        isMessage(field) &&
        (options.useOptionals === false || options.useOptionals === "none")) ||
        (isWithinOneOf(field) && options.oneof === options_1.OneofOption.PROPERTIES) ||
        (isWithinOneOf(field) && field.proto3Optional) ||
        ensureOptional);
}
exports.toTypeName = toTypeName;
/**
 * For a protobuf map field, if the generated code should use the javascript Map type.
 *
 * If the type of a protobuf map key corresponds to the Long type, we always use the Map type. This avoids generating
 * invalid code such as below (using Long as key of a javascript object):
 *
 * export interface Foo {
 *  bar: { [key: Long]: Long }
 * }
 *
 * See https://github.com/stephenh/ts-proto/issues/708 for more details.
 */
function shouldGenerateJSMapType(ctx, message, field) {
    if (ctx.options.useMapType) {
        return true;
    }
    const mapType = detectMapType(ctx, message, field);
    if (!mapType) {
        return false;
    }
    return (mapType.keyField.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_BOOL ||
        (isLong(mapType.keyField) && ctx.options.forceLong === options_1.LongOption.LONG));
}
exports.shouldGenerateJSMapType = shouldGenerateJSMapType;
function detectMapType(ctx, messageDesc, fieldDesc) {
    var _a;
    const { typeMap } = ctx;
    if (fieldDesc.label === ts_proto_descriptors_1.FieldDescriptorProto_Label.LABEL_REPEATED &&
        fieldDesc.type === ts_proto_descriptors_1.FieldDescriptorProto_Type.TYPE_MESSAGE) {
        const mapType = typeMap.get(fieldDesc.typeName)[2];
        if (!((_a = mapType.options) === null || _a === void 0 ? void 0 : _a.mapEntry))
            return undefined;
        const [keyField, valueField] = mapType.field;
        const keyType = toTypeName(ctx, messageDesc, keyField);
        // use basicTypeName because we don't need the '| undefined'
        const valueType = basicTypeName(ctx, valueField);
        return { messageDesc: mapType, keyField, keyType, valueField, valueType };
    }
    return undefined;
}
exports.detectMapType = detectMapType;
function rawRequestType(ctx, methodDesc, typeOptions = {}) {
    return messageToTypeName(ctx, methodDesc.inputType, typeOptions);
}
exports.rawRequestType = rawRequestType;
function observableType(ctx, asType = false) {
    if (ctx.options.useAsyncIterable) {
        return (0, ts_poet_1.code) `AsyncIterable`;
    }
    else if (asType) {
        return (0, ts_poet_1.code) `${(0, ts_poet_1.imp)("t:Observable@rxjs")}`;
    }
    else {
        return (0, ts_poet_1.code) `${(0, ts_poet_1.imp)("Observable@rxjs")}`;
    }
}
exports.observableType = observableType;
function requestType(ctx, methodDesc, partial = false) {
    let typeName = rawRequestType(ctx, methodDesc, { keepValueType: true });
    if (partial) {
        typeName = (0, ts_poet_1.code) `${ctx.utils.DeepPartial}<${typeName}>`;
    }
    if (methodDesc.clientStreaming) {
        return (0, ts_poet_1.code) `${observableType(ctx)}<${typeName}>`;
    }
    return typeName;
}
exports.requestType = requestType;
function responseType(ctx, methodDesc, typeOptions = {}) {
    return messageToTypeName(ctx, methodDesc.outputType, { keepValueType: true });
}
exports.responseType = responseType;
function responsePromise(ctx, methodDesc) {
    return (0, ts_poet_1.code) `Promise<${responseType(ctx, methodDesc, { keepValueType: true })}>`;
}
exports.responsePromise = responsePromise;
function responseObservable(ctx, methodDesc) {
    return (0, ts_poet_1.code) `${observableType(ctx)}<${responseType(ctx, methodDesc, { keepValueType: true })}>`;
}
exports.responseObservable = responseObservable;
function responsePromiseOrObservable(ctx, methodDesc) {
    const { options } = ctx;
    if (options.returnObservable || methodDesc.serverStreaming) {
        return responseObservable(ctx, methodDesc);
    }
    return responsePromise(ctx, methodDesc);
}
exports.responsePromiseOrObservable = responsePromiseOrObservable;
function detectBatchMethod(ctx, fileDesc, serviceDesc, methodDesc) {
    const { typeMap } = ctx;
    const nameMatches = methodDesc.name.startsWith("Batch");
    const inputType = typeMap.get(methodDesc.inputType);
    const outputType = typeMap.get(methodDesc.outputType);
    if (nameMatches && inputType && outputType) {
        // TODO: This might be enums?
        const inputTypeDesc = inputType[2];
        const outputTypeDesc = outputType[2];
        if (hasSingleRepeatedField(inputTypeDesc) && hasSingleRepeatedField(outputTypeDesc)) {
            const singleMethodName = methodDesc.name.replace("Batch", "Get");
            const inputFieldName = inputTypeDesc.field[0].name;
            const inputType = basicTypeName(ctx, inputTypeDesc.field[0]); // e.g. repeated string -> string
            const outputFieldName = outputTypeDesc.field[0].name;
            let outputType = basicTypeName(ctx, outputTypeDesc.field[0]); // e.g. repeated Entity -> Entity
            const mapType = detectMapType(ctx, outputTypeDesc, outputTypeDesc.field[0]);
            if (mapType) {
                outputType = mapType.valueType;
            }
            const uniqueIdentifier = `${(0, utils_1.maybePrefixPackage)(fileDesc, serviceDesc.name)}.${methodDesc.name}`;
            return {
                methodDesc: methodDesc,
                uniqueIdentifier,
                singleMethodName: utils_1.FormattedMethodDescriptor.formatName(singleMethodName, ctx.options),
                inputFieldName,
                inputType,
                outputFieldName,
                outputType,
                mapType: !!mapType,
            };
        }
    }
    return undefined;
}
exports.detectBatchMethod = detectBatchMethod;
function hasSingleRepeatedField(messageDesc) {
    return messageDesc.field.length == 1 && messageDesc.field[0].label === ts_proto_descriptors_1.FieldDescriptorProto_Label.LABEL_REPEATED;
}
function isJsTypeFieldOption(options, field) {
    var _a, _b;
    return (options.useJsTypeOverride &&
        (((_a = field.options) === null || _a === void 0 ? void 0 : _a.jstype) === ts_proto_descriptors_1.FieldOptions_JSType.JS_NUMBER || ((_b = field.options) === null || _b === void 0 ? void 0 : _b.jstype) === ts_proto_descriptors_1.FieldOptions_JSType.JS_STRING));
}
exports.isJsTypeFieldOption = isJsTypeFieldOption;