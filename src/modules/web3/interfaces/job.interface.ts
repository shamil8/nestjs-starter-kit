import { EventContractInterface } from './event-data.interface';

export interface JobInterface extends EventContractInterface {
  isWs: boolean;
}
