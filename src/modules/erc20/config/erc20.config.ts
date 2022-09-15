import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import config from '../../../config';
import { Network } from '../../web3/enums/network';
import { erc20Abi } from '@app/contracts/erc20.abi';
import { SubscribeErc20NetInterface } from '../interfaces/subscribe-erc20-net.interface';
import { Erc20ContractConfigType } from '../interfaces/erc20-contract-config.type';

@Injectable()
export class Erc20Config {
  /** Queue prefix for rabbitMQ (maybe for exchange) */
  private readonly queuePrefix = 'erc20';

  /**
   * Networks those support that Erc20, value means isSubscribe for contract
   */
  public readonly networks: SubscribeErc20NetInterface = {
    [Network.BSC]: false,
  };

  /**
   * Contract data from mainnet or testnet for erc20
   */
  public readonly erc20: Erc20ContractConfigType;

  constructor(private configService: ConfigService) {
    this.erc20 = config.server.isDev
      ? {
          /** Testnet contract address USDT */
          [Network.BSC]: {
            address: this.configService.get<string>(
              'CONTRACT_ERC20_BSC',
              '0xb638fe4c47506b0e757ff63bc1d93cd38eb8cb18',
            ),
            abi: erc20Abi,
            firstBlock: 22686004,
            queuePrefix: this.queuePrefix,
          },
        }
      : {
          /** Mainnet */
          [Network.BSC]: {
            address: this.configService.get<string>(
              'CONTRACT_ERC20_BSC',
              '0x55d398326f99059ff775485246999027b3197955',
            ),
            abi: erc20Abi,
            firstBlock: 21178068,
            queuePrefix: this.queuePrefix,
          },
        };
  }
}
