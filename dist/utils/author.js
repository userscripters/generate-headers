export const formatAuthor = ({ name, email, url, }) => name + (email ? ` <${email}>` : "") + (url ? ` (${url})` : "");
export const parseAuthor = (info) => {
    if (typeof info === "object")
        return info;
    const authorRegex = /(\w+(?:\s\w+)?)(?:\s<(.+?)>)?(?:\s\((.+?)\))?$/i;
    const match = authorRegex.exec(info);
    if (!match)
        throw new Error(`unable to parse author field: ${info}`);
    const [, name, email, url] = match;
    return {
        name,
        email,
        url,
    };
};
