export const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (
    key: U,
) => obj[key];
