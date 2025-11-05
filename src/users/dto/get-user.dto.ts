export class GetUserDto {
  /**
   * The ID of the user
   * @example '123'
   */
  id: string;
  /**
   * The name of the user
   */
  name: string | null;
}
