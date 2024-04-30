/// <reference types="node" />
/// <reference types="node" />
import { Code, Import } from "ts-poet";
import { CodeGeneratorRequest, FieldDescriptorProto, FileDescriptorProto, MethodDescriptorProto, MethodOptions } from "ts-proto-descriptors";
import ReadStream = NodeJS.ReadStream;
import { SourceDescription } from "./sourceInfo";
import { Options } from "./options";
export declare function protoFilesToGenerate(request: CodeGeneratorRequest): FileDescriptorProto[];
export declare function generateIndexFiles(files: FileDescriptorProto[], options: Options): [string, Code][];
export declare function readToBuffer(stream: ReadStream): Promise<Buffer>;
export declare function fail(message: string): never;
export declare function singular(name: string): string;
export declare function lowerFirst(name: string): string;
export declare function upperFirst(name: string): string;
/** Removes potentially harmful characters from comments and pushes it into chunks. */
export declare function maybeAddComment(options: Pick<Options, "comments">, desc: Partial<Pick<SourceDescription, "leadingComments" | "trailingComments">>, chunks: Code[], deprecated?: boolean, prefix?: string): void;
export declare function prefixDisableLinter(spec: string): string;
export declare function maybePrefixPackage(fileDesc: FileDescriptorProto, rest: string): string;
/**
 * Asserts that an object is an instance of a certain class
 * @param obj The object to check
 * @param constructor The constructor of the class to check
 */
export declare function assertInstanceOf<T>(obj: unknown, constructor: {
    new (...args: any[]): T;
}): asserts obj is T;
/**
 * A MethodDescriptorProto subclass that adds formatted properties
 */
export declare class FormattedMethodDescriptor implements MethodDescriptorProto {
    name: string;
    inputType: string;
    outputType: string;
    options: MethodOptions | undefined;
    clientStreaming: boolean;
    serverStreaming: boolean;
    private original;
    private ctxOptions;
    /**
     * The name of this method with formatting applied according to the `Options` object passed to the constructor.
     * Automatically updates to any changes to the `Options` or `name` of this object
     */
    get formattedName(): string;
    constructor(src: MethodDescriptorProto, options: Options);
    /**
     * Retrieve the source `MethodDescriptorProto` used to construct this object
     * @returns The source `MethodDescriptorProto` used to construct this object
     */
    getSource(): MethodDescriptorProto;
    /**
     * Applies formatting rules to a gRPC method name.
     * @param methodName The original method name
     * @param options The options object containing rules to apply
     * @returns The formatted method name
     */
    static formatName(methodName: string, options: Options): string;
}
export declare function getFieldJsonName(field: Pick<FieldDescriptorProto, "name" | "jsonName">, options: Pick<Options, "snakeToCamel" | "useJsonName">): string;
export declare function getFieldName(field: Pick<FieldDescriptorProto, "name" | "jsonName">, options: Pick<Options, "snakeToCamel" | "useJsonName">): string;
/** Returns `bar` or `"bar"` if `propertyName` isn't a safe property name. */
export declare function safeAccessor(propertyName: string): string;
/**
 * Returns a snippet for reading an object's property, such as `foo.bar`, or `foo['bar']` if the property name contains unusual characters.
 * For simplicity, we don't match the ECMA 5/6 rules for valid identifiers exactly, and return array syntax liberally.
 * @param objectName
 * @param propertyName
 * @param optional
 */
export declare function getPropertyAccessor(objectName: string, propertyName: string, optional?: boolean): string;
export declare function impFile(options: Options, spec: string): Import;
export declare function impProto(options: Options, module: string, type: string): Import;
export declare function tryCatchBlock(tryBlock: Code | string, handleErrorBlock: Code | string): Code;
export declare function arrowFunction(params: string, body: Code | string, isOneLine?: boolean): Code;
export declare function nullOrUndefined(options: Pick<Options, "useNullAsOptional">, hasProto3Optional?: boolean): string;
export declare function maybeCheckIsNotNull(options: Pick<Options, "useNullAsOptional">, typeName: string, prefix?: string): string;
export declare function maybeCheckIsNull(options: Pick<Options, "useNullAsOptional">, typeName: string, prefix?: string): string;
export declare function withOrMaybeCheckIsNotNull(options: Pick<Options, "useNullAsOptional">, typeName: string): string;
export declare function withOrMaybeCheckIsNull(options: Pick<Options, "useNullAsOptional">, typeName: string): string;
export declare function withAndMaybeCheckIsNotNull(options: Pick<Options, "useNullAsOptional">, typeName: string): string;
export declare function withAndMaybeCheckIsNull(options: Pick<Options, "useNullAsOptional">, typeName: string): string;