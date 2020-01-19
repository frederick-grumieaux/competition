let id = 1;
export function nextId(): string {
    return '[ID:'+ (id++)+']'
}

export default nextId;