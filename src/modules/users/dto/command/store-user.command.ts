import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StoreUserCommand {
  @ApiProperty({ example: 'Yan', description: 'Your name' })
  @IsNotEmpty()
  public name!: string;

  @ApiProperty({ example: false, description: 'Send notice or not' })
  public isAvailable?: boolean;
}
