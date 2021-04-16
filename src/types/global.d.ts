export { }

declare global {
  // interface ID extends String { _doNotUse: boolean; }
  interface ID extends number { _doNotUse: boolean; }
}

/*
declare interface ID2 extends String { _doNotUse: boolean; }

declare global {
  namespace NodeJS {
    interface Global {
        interface ID3 extends String { _doNotUse: boolean; }
    }
  }
}
export interface Global {
 myProp: string;
}
*/