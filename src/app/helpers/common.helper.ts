export class CommonHelper {

  // cyrb53 from https://stackoverflow.com/a/52171480/4255158
  public static hash(str: string, seed = 0): string {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString();
  }

  public static getStyle(inboxId: string) {
    const r = inboxId.slice(0, 2);
    const g = inboxId.slice(2, 4);
    const b = inboxId.slice(6, 8);
    return "background-color: rgb(" + r + ", " + g + ", " + b + "); text-shadow: 1px 1px 2px white; mix-blend-mode: difference;"
  }
}
