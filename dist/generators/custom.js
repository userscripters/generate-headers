export const generateCustomHeaders = (custom) => {
    return custom.map((pair) => {
        const [name, value = ""] = pair.split(/\s+/);
        return [name, value];
    });
};
