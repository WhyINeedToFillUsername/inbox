export class CommonHelper {

  // cyrb53 from https://stackoverflow.com/a/52171480/4255158
  public static shorthash(str: string, seed = 0): string {
    let h1 = 0xdeadbeef ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    return (h1 >>> 0).toString();
  }

  public static getStyle(url: string) {
    let hash = this.shorthash(url);
    const r = hash.slice(0, 2);
    const g = hash.slice(2, 4);
    const b = hash.slice(6, 8);
    return "background-color: rgb(" + r + ", " + g + ", " + b + "); text-shadow: 1px 1px 2px white; mix-blend-mode: difference;"
  }
}
