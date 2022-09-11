import {
  CallOptions,
  EstimateGasOptions,
  SendOptions,
} from 'web3-eth-contract';
import { PromiEvent, TransactionReceipt } from 'web3-core';

export interface TransactionMethodInterface {
  _method: { name: string };

  send(
    options: SendOptions,
    callback?: (err: Error, transactionHash: string) => void,
  ): PromiEvent<TransactionReceipt>;

  estimateGas(options: EstimateGasOptions): Promise<number>;
}

export type ViewDefaultMethodType = () => {
  call(options?: CallOptions): Promise<string>;
};
