import { Erc20NetType } from './subscribe-erc20-net.interface';
import { ContractInterface } from '../../web3/interfaces/contract-web3.interface';

export type Erc20ContractConfigType = {
  [key in Erc20NetType]: ContractInterface;
};
