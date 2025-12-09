import type { MountView, ViewOptions } from "./types.js";
export declare function mountView<Extra extends Record<string, any> = {}>(opts: ViewOptions, extra?: Extra): MountView<Extra>;
export * as uiHelpers from "./helpers.js";
export * as infinityScroll from "./infinityScroll.js";
