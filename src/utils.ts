import { readFile } from "fs/promises";

export type PackageInfo = {
  author:
    | string
    | {
        name: string;
        email?: string;
        url?: string;
      };
  license: string;
  homepage: string;
  name: string;
  version: `${number}.${number}.${number}`;
  description: string;
  bugs: {
    url: string;
  };
  repository: {
    type: "git" | "https";
    url: string;
  };
};

export const getPackage = async (path: string): Promise<PackageInfo | null> => {
  try {
    const contents = await readFile(path, { encoding: "utf-8" });
    return JSON.parse(contents);
  } catch (error) {
    return null;
  }
};

export const scase = (text: string) =>
  `${text[0].toUpperCase()}${text.slice(1).toLowerCase()}`;

export const mdLink = (lbl: string, href: string) => `[${lbl}](${href})`;

export const parseAuthor = (
  info: PackageInfo["author"]
): Exclude<PackageInfo["author"], string> => {
  if (typeof info === "object") return info;

  const authorRegex = /(\w+\s\w+)(?:\s<(.+?)>)?(?:\s\((.+?)\))?$/i;

  const [_full, name, email, url] = authorRegex.exec(info)!;

  return {
    name,
    email,
    url,
  };
};
