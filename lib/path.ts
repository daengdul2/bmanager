export function joinPath(base: string, name: string) {
    if (!base) return name;
    return `${base.replace(/\/$/, "")}/${name}`;
}