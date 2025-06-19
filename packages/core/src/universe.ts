export interface LivingNumber {
  value: bigint;
}

export class MathematicalUniverse {
  constructor() {}

  number(n: bigint): LivingNumber {
    return { value: n };
  }
}
