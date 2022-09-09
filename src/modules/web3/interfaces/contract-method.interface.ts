import {
  CallOptions,
  EstimateGasOptions,
  SendOptions,
} from 'web3-eth-contract';
import { PromiEvent, TransactionReceipt } from 'web3-core';

export interface ContractMethodInterface {
  _method: { name: string };

  send(
    options: SendOptions,
    callback?: (err: Error, transactionHash: string) => void,
  ): PromiEvent<TransactionReceipt>;

  call(
    options?: CallOptions,
    callback?: (err: Error, result: any) => void,
  ): Promise<any>;

  estimateGas(options: EstimateGasOptions): Promise<number>;
}

export type ContractMethodType = {
  [key: string]: (...data: any) => ContractMethodInterface;
};
