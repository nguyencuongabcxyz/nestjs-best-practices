import { ServiceError } from 'src/shared/service-error';

export class UserNotFoundError extends ServiceError {
  constructor(id: string) {
    super('UserService', 'USER_NOT_FOUND', `User with id ${id} not found`);
  }
}
