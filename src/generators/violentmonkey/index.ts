import { CommonGrantOptions, HeaderEntries, HeaderGenerator } from "..";
import { finalizeMonkeyHeaders } from "../common/monkey";
import { ViolentMonkeyHeaders } from "./types";

//TODO: finish creating the processor
export const generateViolentMonkeyHeaders: HeaderGenerator<CommonGrantOptions> =
    ({}) => {
        const headers: HeaderEntries<ViolentMonkeyHeaders> = [];
        return finalizeMonkeyHeaders(headers, 4);
    };
