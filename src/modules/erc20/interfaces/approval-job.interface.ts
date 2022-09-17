import { Erc20JobInterface } from './erc20-subscribe.interface';

export interface ApprovalJobInterface extends Erc20JobInterface {
  returnValues: {
    owner: string;
    spender: string;
    value: string;
  };
}
