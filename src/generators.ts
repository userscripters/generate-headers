import { formatAuthor, getLongest, PackageInfo, parseAuthor } from "./utils";

declare global {
  interface String {
    padEnd<T extends string>(maxLength: number, fillString?: string): T;
  }
}

export type UserScriptManagerName =
  | "tampermonkey"
  | "violentmonkey"
  | "greasemonkey";

export type HeaderGenerator = (info: PackageInfo) => string;

export type GeneratorMap = { [P in UserScriptManagerName]: HeaderGenerator };

type CommonHeaders<T extends object> = T & {
  description: string;
  exclude: string[];
  icon: string;
  include: string[];
  name: string;
  namespace: string;
  noframes: "";
  resource: string[];
  require: string[];
  version: `${number}.${number}.${number}`;
};

type CustomHeaders = { contributors: string };

type GreasemonkeyHeaders = CustomHeaders &
  CommonHeaders<{
    "grant": "none"[];
    "run-at": "document-start" | "document-end" | "document-idle";
  }>;

type TampermonkeyHeaders = CustomHeaders &
  CommonHeaders<{
    "author": string;
    "homepage": string;
    "homepageURL": string;
    "website": string;
    "source": string;
    "iconURL": string;
    "defaulticon": string;
    "icon64": string;
    "icon64URL": string;
    "updateURL": string;
    "downloadURL": string;
    "supportURL": string;
    "connect": string[];
    "run-at":
      | "context-menu"
      | "document-start"
      | "document-body"
      | "document-end"
      | "document-idle";
    "grant": (
      | "none"
      | "unsafeWindow"
      | "window.close"
      | "window.focus"
      | "window.onurlchange"
    )[];
    "antifeature": `${"ads" | "tracking" | "miner"} ${string}`[];
    "unwrap": "";
    "nocompat": "Chrome" | "Opera" | "FireFox";
  }>;

type HeaderEntries<T> = [keyof T, T[keyof T]][];

type MonkeyHeader = `// @${string} ${string}` | `// @${string}`;

const makeMonkeyTags = (
    name = "UserScript"
): readonly [openTag: string, closeTag: string] => [
    `// ==${name}==`,
    `// ==/${name}==`,
];

const makeMonkeyHeader = <K extends keyof TampermonkeyHeaders>([name, value]: [
  K,
  TampermonkeyHeaders[K]
]) => <MonkeyHeader>(value ? `// @${name} ${value}` : `// @${name}`);

//TODO: finish creating the processor
export const generateGreasemnonkeyHeaders: HeaderGenerator = () => {
    const [openTag, closeTag] = makeMonkeyTags();

    const headers: HeaderEntries<GreasemonkeyHeaders> = [];

    const parsedHeaders: MonkeyHeader[] = headers.map(makeMonkeyHeader);

    return `
${openTag}
${parsedHeaders.join("\n")}
${closeTag}
`;
};

export const generateTampermonkeyHeaders: HeaderGenerator = ({
    author,
    contributors,
    icon,
    name,
    description,
    homepage,
    bugs: { url: supportURL },
    repository: { url: source },
    version,
}) => {
    const [openTag, closeTag] = makeMonkeyTags();

    const parsedAuthor = parseAuthor(author);

    const headers: HeaderEntries<TampermonkeyHeaders> = [
        ["author", formatAuthor(parsedAuthor)],
        ["description", description],
        ["homepage", homepage],
        ["name", name],
        ["source", source],
        ["supportURL", supportURL],
        ["version", version],
    ];

    if (icon) headers.push(["icon", icon]);

    if (contributors && contributors.length) {
        const formatted = contributors.map((contributor) =>
            formatAuthor(parseAuthor(contributor))
        );
        headers.push(["contributors", formatted]);
    }

    const longest = getLongest(headers.map(([key]) => key)) + 4;

    const indentedHeaders: HeaderEntries<TampermonkeyHeaders> = headers.map(
        ([key, val]) => [key.padEnd(longest), val]
    );

    const parsedHeaders: MonkeyHeader[] = indentedHeaders.map(makeMonkeyHeader);

    //Unused headers:
    // @namespace
    // @icon64 and @icon64URL
    // @updateURL
    // @downloadURL
    // @include
    // @match
    // @exclude
    // @require
    // @resource
    // @connect
    // @run-at
    // @grant
    // @antifeature
    // @noframes
    // @unwrap
    // @nocompat

    return `
${openTag}
${parsedHeaders.join("\n")}
${closeTag}
`;
};

//TODO: finish creating the processor
export const generateViolentMonkeyHeaders: HeaderGenerator = ({}) => {
    return "";
};
