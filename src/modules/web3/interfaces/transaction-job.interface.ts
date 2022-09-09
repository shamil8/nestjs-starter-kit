import { Transaction } from 'web3-core';

export interface TransactionJobInterface extends Transaction {
  walletAddress: string;
}
