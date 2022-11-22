import { TransactionMethodInterface } from '../../../web3/interfaces/contract-method.interface';
import { Erc20NetType } from '../erc20-subscribe.interface';
import { Erc20ViewInterface } from './erc20-view.interface';

export interface Erc20MethodInterface extends Erc20ViewInterface {
  /** transaction (non payable) methods */
  readonly transfer: (
    recipient: string,
    amount: string,
  ) => TransactionMethodInterface;
}

export type Erc20NetMethodType = {
  [net in Erc20NetType]: Erc20MethodInterface;
};
