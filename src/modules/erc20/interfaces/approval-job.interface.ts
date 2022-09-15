import { Erc20JobInterface } from './erc20-job.interface';

export interface ApprovalJobInterface extends Erc20JobInterface {
  returnValues: {
    owner: string;
    spender: string;
    value: string;
  };
}
