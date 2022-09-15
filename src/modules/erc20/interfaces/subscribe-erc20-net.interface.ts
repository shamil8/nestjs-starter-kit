import { Network } from '../../web3/enums/network';

export interface SubscribeErc20NetInterface {
  [Network.BSC]: boolean;
}

export type Erc20NetType = keyof SubscribeErc20NetInterface;

export type SubscribeErc20NetType = [net: Erc20NetType, isSubscribe: boolean][];
