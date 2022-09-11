import { JobInterface } from '../../web3/interfaces/job.interface';

export interface ApprovalJobInterface extends JobInterface {
  returnValues: {
    owner: string;
    spender: string;
    value: string;
  };
}
