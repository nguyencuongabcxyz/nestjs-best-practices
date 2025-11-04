import { IsInt, IsOptional, Min } from 'class-validator';

export class GetUsersQueryDto {
  /**
   * The page number
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  /**
   * The number of results per page
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
