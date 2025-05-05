

export default function normalizeHexArray(arr: string[]): string[] {
    return arr.map(p => {
      if (typeof p !== 'string') throw new Error("Invalid proof element");
      return p.startsWith('0x') ? p : `0x${p}`;
    });
}