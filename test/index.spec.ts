import { use } from "chai";
import * as cpr from "chai-as-promised";
import { join } from "path";
import { GeneratorOptions } from "../src";
import { CommonGrantOptions } from "../src/generators";
import {
    GreasemonkeyGrantOptions,
    GreasemonkeyGrants,
} from "../src/generators/greasemonkey/types";
import {
    TampermonkeyGrantOptions,
    TampermonkeyGrants,
} from "../src/generators/tampermonkey/types";
import {
    ViolentmonkeyGrantOptions,
    ViolentmonkeyGrants,
} from "../src/generators/violentmonkey/types";

use(cpr);

export const base = process.cwd();
export const pkg = join(base, "/package.json");
export const output = join(base, "/test/headers.js");

export const common: GeneratorOptions<CommonGrantOptions> = {
    output,
    packagePath: pkg,
};

//@see https://developer.chrome.com/docs/extensions/mv2/match_patterns/
export const allMatches: string[] = [
    "http://*/*",
    "http://*/foo*",
    "https://*.google.com/foo*bar",
    "http://example.org/foo/bar.html",
    "file:///foo*",
    "http://127.0.0.1/*",
    "*://mail.google.com/*",
    "urn:*",
    "<all_urls>",
];

export const grantsTM: TampermonkeyGrants[] = [
    "GM_getValue",
    "GM_setValue",
    "GM_deleteValue",
    "GM_listValues",
    "unsafeWindow",
    "window.close",
    "window.focus",
    "window.onurlchange",
];

export const grantsGM: GreasemonkeyGrants[] = [
    "GM.deleteValue",
    "GM.getValue",
    "GM.listValues",
    "GM.setValue",
    "unsafeWindow",
    "GM.setClipboard",
    "GM.xmlHttpRequest",
    "GM.notification",
];

export const grantsVM: ViolentmonkeyGrants[] = [
    "GM_getValue",
    "GM_setValue",
    "GM_deleteValue",
    "GM_listValues",
    "GM_download",
    "GM_notification",
    "GM_setClipboard",
    "GM_xmlhttpRequest",
    "unsafeWindow",
    "window.close",
    "window.focus",
];

export const grantOptionsCommon: CommonGrantOptions[] = [
    "get",
    "set",
    "list",
    "delete",
    "unsafe",
];

export const grantOptionsTM: TampermonkeyGrantOptions[] = [
    ...grantOptionsCommon,
    "close",
    "focus",
    "change",
];

export const grantOptionsGM: GreasemonkeyGrantOptions[] = [
    ...grantOptionsCommon,
    "clip",
    "fetch",
    "notify",
];

export const grantOptionsVM: ViolentmonkeyGrantOptions[] = [
    ...grantOptionsCommon,
    "clip",
    "fetch",
    "focus",
    "notify",
    "download",
    "style",
    "close",
];

export const directCommon: GeneratorOptions<TampermonkeyGrantOptions> = {
    ...common,
    direct: true,
};
