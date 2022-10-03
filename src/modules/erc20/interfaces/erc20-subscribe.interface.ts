import { Network } from '../../web3/enums/network';
import { ContractInterface } from '../../web3/interfaces/contract-web3.interface';
import { JobInterface } from '../../web3/interfaces/job.interface';

export interface Erc20SubscribeInterface {
  [Network.BSC]: boolean;
}

export type Erc20NetType = keyof Erc20SubscribeInterface;

export type Erc20SubscribeNetType = [net: Erc20NetType, isSubscribe: boolean][];

export type Erc20ConfigType = { [net in Erc20NetType]: ContractInterface };

export interface Erc20JobInterface extends JobInterface {
  net: Erc20NetType;
}
