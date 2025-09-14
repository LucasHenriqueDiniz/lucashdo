declare global {
  namespace JSX {
    type Element = unknown;
    interface IntrinsicElements {
      [elemName: string]: unknown;
    }
  }
}
export {};
