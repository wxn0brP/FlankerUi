import type { fetchVQL as fetchVQLType } from "@wxn0brp/vql-client";
import type { MountView, ViewOptions } from "./types.js";
export declare function setFetchVQL(fn: typeof fetchVQLType): void;
export declare function mountView<Extra extends Record<string, any> = {}>(opts: ViewOptions, extra?: Extra): MountView<Extra>;
export * as uiHelpers from "./helpers.js";
export * as infinityScroll from "./infinityScroll.js";
