import { ExceptionCodeBase } from '../enums/exceptions/exception-code-base';
import { DomainException } from './domain.exception';
import { CodeException } from './code.exception';

export class InvariantViolationException extends DomainException {
  constructor(_message: string | null) {
    super(
      _message || 'Invariant violation exception',
      new CodeException(ExceptionCodeBase.INVARIANT_VIOLATION),
    );
  }
}
