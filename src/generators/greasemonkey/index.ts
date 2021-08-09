import { HeaderEntries, HeaderGenerator } from "..";
import {
    makeMonkeyHeader,
    makeMonkeyTags,
    MonkeyHeader,
} from "../common/monkey";
import { GreasemonkeyHeaders } from "./types";

//TODO: finish creating the processor
export const generateGreasemonkeyHeaders: HeaderGenerator = () => {
    const [openTag, closeTag] = makeMonkeyTags();

    const headers: HeaderEntries<GreasemonkeyHeaders> = [];

    const parsedHeaders: MonkeyHeader[] = headers.map(makeMonkeyHeader);

    return `
${openTag}
${parsedHeaders.join("\n")}
${closeTag}
`;
};
