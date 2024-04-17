"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndMaybeCheckIsNull = exports.withAndMaybeCheckIsNotNull = exports.withOrMaybeCheckIsNull = exports.withOrMaybeCheckIsNotNull = exports.maybeCheckIsNull = exports.maybeCheckIsNotNull = exports.nullOrUndefined = exports.arrowFunction = exports.tryCatchBlock = exports.impProto = exports.impFile = exports.getPropertyAccessor = exports.safeAccessor = exports.getFieldName = exports.getFieldJsonName = exports.FormattedMethodDescriptor = exports.assertInstanceOf = exports.maybePrefixPackage = exports.prefixDisableLinter = exports.maybeAddComment = exports.upperFirst = exports.lowerFirst = exports.singular = exports.fail = exports.readToBuffer = exports.generateIndexFiles = exports.protoFilesToGenerate = void 0;
const path = require("path");
const ts_poet_1 = require("ts-poet");
const options_1 = require("./options");
const case_1 = require("./case");
function protoFilesToGenerate(request) {
    return request.protoFile.filter((f) => request.fileToGenerate.includes(f.name));
}
exports.protoFilesToGenerate = protoFilesToGenerate;
function generateIndexFiles(files, options) {
    const packageTree = {
        index: "index.ts",
        leaves: {},
        chunks: [],
    };
    for (const { name, package: pkg } of files) {
        const moduleName = name.replace(".proto", options.fileSuffix);
        const pkgParts = pkg.length > 0 ? pkg.split(".") : [];
        const branch = pkgParts.reduce((branch, part, i) => {
            if (!(part in branch.leaves)) {
                const prePkgParts = pkgParts.slice(0, i + 1);
                const index = `index.${prePkgParts.join(".")}.ts`;
                branch.chunks.push((0, ts_poet_1.code) `export * as ${part} from "./${path.basename(index, ".ts") + options.importSuffix}";`);
                branch.leaves[part] = {
                    index,
                    leaves: {},
                    chunks: [],
                };
            }
            return branch.leaves[part];
        }, packageTree);
        branch.chunks.push((0, ts_poet_1.code) `export * from "./${moduleName + options.importSuffix}";`);
    }
    const indexFiles = [];
    let branches = [packageTree];
    let currentBranch;
    while ((currentBranch = branches.pop())) {
        indexFiles.push([currentBranch.index, (0, ts_poet_1.joinCode)(currentBranch.chunks)]);
        branches.push(...Object.values(currentBranch.leaves));
    }
    return indexFiles;
}
exports.generateIndexFiles = generateIndexFiles;
function readToBuffer(stream) {
    return new Promise((resolve) => {
        const ret = [];
        let len = 0;
        stream.on("readable", () => {
            let chunk;
            while ((chunk = stream.read())) {
                ret.push(chunk);
                len += chunk.length;
            }
        });
        stream.on("end", () => {
            resolve(Buffer.concat(ret, len));
        });
    });
}
exports.readToBuffer = readToBuffer;
function fail(message) {
    throw new Error(message);
}
exports.fail = fail;
function singular(name) {
    return name.substring(0, name.length - 1); // drop the 's', which is extremely naive
}
exports.singular = singular;
function lowerFirst(name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
}
exports.lowerFirst = lowerFirst;
function upperFirst(name) {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
}
exports.upperFirst = upperFirst;
// Since we don't know what form the comment originally took, it may contain closing block comments.
const CloseComment = /\*\//g;
/** Removes potentially harmful characters from comments and pushes it into chunks. */
function maybeAddComment(options, desc, chunks, deprecated, prefix = "") {
    if (!options.comments) {
        return;
    }
    let lines = [];
    if (desc.leadingComments || desc.trailingComments) {
        let content = (desc.leadingComments || desc.trailingComments || "").replace(CloseComment, "* /").trim();
        // Detect /** ... */ comments
        const isDoubleStar = content.startsWith("*");
        if (isDoubleStar) {
            content = content.substring(1).trim();
        }
        // Prefix things like the enum name.
        if (prefix) {
            content = prefix + content;
        }
        lines = content.split("\n").map((l) => l.replace(/^ /, "").replace(/\n/, ""));
    }
    // Deprecated comment should be added even if no other comment was added
    if (deprecated) {
        if (lines.length > 0) {
            lines.push("");
        }
        lines.push("@deprecated");
    }
    let comment;
    if (lines.length === 1) {
        comment = (0, ts_poet_1.code) `/** ${lines[0]} */`;
    }
    else {
        comment = (0, ts_poet_1.code) `/**\n * ${lines.join("\n * ")}\n */`;
    }
    if (lines.length > 0) {
        chunks.push((0, ts_poet_1.code) `\n\n${comment}\n\n`);
    }
}
exports.maybeAddComment = maybeAddComment;
// Comment block at the top of every source file, since these comments require specific
// syntax incompatible with ts-poet, we will hard-code the string and prepend to the
// generator output.
function prefixDisableLinter(spec) {
    return `/* eslint-disable */\n${spec}`;
}
exports.prefixDisableLinter = prefixDisableLinter;
function maybePrefixPackage(fileDesc, rest) {
    const prefix = fileDesc.package === "" ? "" : `${fileDesc.package}.`;
    return `${prefix}${rest}`;
}
exports.maybePrefixPackage = maybePrefixPackage;
/**
 * Asserts that an object is an instance of a certain class
 * @param obj The object to check
 * @param constructor The constructor of the class to check
 */
function assertInstanceOf(obj, constructor) {
    if (!(obj instanceof constructor)) {
        throw new Error(`Expected instance of ${constructor.name}`);
    }
}
exports.assertInstanceOf = assertInstanceOf;
/**
 * A MethodDescriptorProto subclass that adds formatted properties
 */
class FormattedMethodDescriptor {
    /**
     * The name of this method with formatting applied according to the `Options` object passed to the constructor.
     * Automatically updates to any changes to the `Options` or `name` of this object
     */
    get formattedName() {
        return FormattedMethodDescriptor.formatName(this.name, this.ctxOptions);
    }
    constructor(src, options) {
        this.ctxOptions = options;
        this.original = src;
        this.name = src.name;
        this.inputType = src.inputType;
        this.outputType = src.outputType;
        this.options = src.options;
        this.clientStreaming = src.clientStreaming;
        this.serverStreaming = src.serverStreaming;
    }
    /**
     * Retrieve the source `MethodDescriptorProto` used to construct this object
     * @returns The source `MethodDescriptorProto` used to construct this object
     */
    getSource() {
        return this.original;
    }
    /**
     * Applies formatting rules to a gRPC method name.
     * @param methodName The original method name
     * @param options The options object containing rules to apply
     * @returns The formatted method name
     */
    static formatName(methodName, options) {
        let result = methodName;
        if (options.lowerCaseServiceMethods || options.outputServices.includes(options_1.ServiceOption.GRPC)) {
            if (options.snakeToCamel)
                result = (0, case_1.camelCaseGrpc)(result);
        }
        return result;
    }
}
exports.FormattedMethodDescriptor = FormattedMethodDescriptor;
function getFieldJsonName(field, options) {
    // use "json_name" defined in a proto file
    if (options.useJsonName) {
        return field.jsonName;
    }
    // jsonName will be camelCased by the protocol compiler, plus can be overridden by the user,
    // so just use that instead of our own maybeSnakeToCamel
    if (options.snakeToCamel.includes("json")) {
        return field.jsonName;
    }
    else {
        // The user wants to keep snake case in the JSON, but we still want to see if the jsonName
        // attribute is set as an explicit override.
        const probableJsonName = (0, case_1.snakeToCamel)(field.name);
        const isJsonNameSet = probableJsonName !== field.jsonName;
        return isJsonNameSet ? field.jsonName : field.name;
    }
}
exports.getFieldJsonName = getFieldJsonName;
function getFieldName(field, options) {
    if (options.useJsonName) {
        return field.jsonName;
    }
    return (0, case_1.maybeSnakeToCamel)(field.name, options);
}
exports.getFieldName = getFieldName;
/**
 * https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/the-dangers-of-square-bracket-notation.md
 */
function isValidIdentifier(propertyName) {
    return /^[a-zA-Z_$][\w$]*$/.test(propertyName);
}
/** Returns `bar` or `"bar"` if `propertyName` isn't a safe property name. */
function safeAccessor(propertyName) {
    return isValidIdentifier(propertyName) ? propertyName : JSON.stringify(propertyName);
}
exports.safeAccessor = safeAccessor;
/**
 * Returns a snippet for reading an object's property, such as `foo.bar`, or `foo['bar']` if the property name contains unusual characters.
 * For simplicity, we don't match the ECMA 5/6 rules for valid identifiers exactly, and return array syntax liberally.
 * @param objectName
 * @param propertyName
 * @param optional
 */
function getPropertyAccessor(objectName, propertyName, optional = false) {
    return isValidIdentifier(propertyName)
        ? `${objectName}${optional ? "?" : ""}.${propertyName}`
        : `${objectName}${optional ? "?." : ""}[${safeAccessor(propertyName)}]`;
}
exports.getPropertyAccessor = getPropertyAccessor;
function impFile(options, spec) {
    return (0, ts_poet_1.imp)(`${spec}${options.importSuffix}`);
}
exports.impFile = impFile;
function impProto(options, module, type) {
    const prefix = options.onlyTypes ? "t:" : "";
    const protoFile = `${module}.proto`;
    if (options.M[protoFile]) {
        return (0, ts_poet_1.imp)(`${prefix}${type}@${options.M[protoFile]}`);
    }
    return (0, ts_poet_1.imp)(`${prefix}${type}@./${module}${options.fileSuffix}${options.importSuffix}`);
}
exports.impProto = impProto;
function tryCatchBlock(tryBlock, handleErrorBlock) {
    return (0, ts_poet_1.code) `try {
    ${tryBlock}
  } catch (error) {
    ${handleErrorBlock}
  }`;
}
exports.tryCatchBlock = tryCatchBlock;
function arrowFunction(params, body, isOneLine = true) {
    if (isOneLine) {
        return (0, ts_poet_1.code) `(${params}) => ${body}`;
    }
    return (0, ts_poet_1.code) `(${params}) => { ${body} }`;
}
exports.arrowFunction = arrowFunction;
function nullOrUndefined(options, hasProto3Optional = false) {
    return options.useNullAsOptional ? `null ${hasProto3Optional ? "| undefined" : ""}` : "undefined";
}
exports.nullOrUndefined = nullOrUndefined;
function maybeCheckIsNotNull(options, typeName, prefix) {
    return options.useNullAsOptional ? ` ${prefix} ${typeName} !== null` : "";
}
exports.maybeCheckIsNotNull = maybeCheckIsNotNull;
function maybeCheckIsNull(options, typeName, prefix) {
    return options.useNullAsOptional ? ` ${prefix} ${typeName} === null` : "";
}
exports.maybeCheckIsNull = maybeCheckIsNull;
function withOrMaybeCheckIsNotNull(options, typeName) {
    return maybeCheckIsNotNull(options, typeName, "||");
}
exports.withOrMaybeCheckIsNotNull = withOrMaybeCheckIsNotNull;
function withOrMaybeCheckIsNull(options, typeName) {
    return maybeCheckIsNull(options, typeName, "||");
}
exports.withOrMaybeCheckIsNull = withOrMaybeCheckIsNull;
function withAndMaybeCheckIsNotNull(options, typeName) {
    return maybeCheckIsNotNull(options, typeName, "&&");
}
exports.withAndMaybeCheckIsNotNull = withAndMaybeCheckIsNotNull;
function withAndMaybeCheckIsNull(options, typeName) {
    return maybeCheckIsNotNull(options, typeName, "&&");
}
exports.withAndMaybeCheckIsNull = withAndMaybeCheckIsNull;
