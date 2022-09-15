import { JobInterface } from '../../web3/interfaces/job.interface';
import { Erc20NetType } from './subscribe-erc20-net.interface';

export interface Erc20JobInterface extends JobInterface {
  net: Erc20NetType;
}
