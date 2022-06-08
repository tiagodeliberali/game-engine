export {};
declare global {
  namespace jest {
    interface Matchers<R> {
      cellToBe(expectedCell: Cell): R;
    }
  }
}
