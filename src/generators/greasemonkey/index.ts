import { HeaderEntries, HeaderGenerator } from "..";
import { finalizeMonkeyHeaders } from "../common/monkey";
import { GreasemonkeyHeaders } from "./types";

//TODO: finish creating the processor
export const generateGreasemonkeyHeaders: HeaderGenerator = () => {
    const headers: HeaderEntries<GreasemonkeyHeaders> = [];
    return finalizeMonkeyHeaders(headers, 4);
};
