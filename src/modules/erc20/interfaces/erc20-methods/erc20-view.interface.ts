import { CallOptions } from 'web3-eth-contract';

import { ViewMethodType } from '../../../web3/interfaces/contract-method.interface';

export interface Erc20ViewInterface {
  /** View methods */
  readonly decimals: ViewMethodType;
  readonly name: ViewMethodType;
  readonly symbol: ViewMethodType;
  readonly balanceOf: (account: string) => {
    call(options?: CallOptions): Promise<string>;
  };
}
