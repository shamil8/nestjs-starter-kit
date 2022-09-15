import { CallOptions } from 'web3-eth-contract';

import {
  TransactionMethodInterface,
  ViewDefaultMethodType,
} from '../../web3/interfaces/contract-method.interface';
import { Erc20NetType } from './subscribe-erc20-net.interface';

interface Erc20MethodInterface {
  /** View methods */
  readonly decimals: ViewDefaultMethodType;
  readonly name: ViewDefaultMethodType;
  readonly symbol: ViewDefaultMethodType;
  readonly balanceOf: (account: string) => {
    call(options?: CallOptions): Promise<string>;
  };

  /** transaction (non payable) methods */
  readonly transfer: (
    recipient: string,
    amount: string,
  ) => TransactionMethodInterface;
}

export type Erc20NetMethodType = {
  [key in Erc20NetType]: Erc20MethodInterface;
};
