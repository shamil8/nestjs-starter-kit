import { Network } from '../enums/network';

interface BaseSendTransactionInterface {
  contractAddress: string;
  net: Network;
}

export interface SendEncodeTransactionInterface
  extends BaseSendTransactionInterface {
  encodeData: string;
}

export interface SendTransactionInterface extends BaseSendTransactionInterface {
  data: Uint8Array;
}
