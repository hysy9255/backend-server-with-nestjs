import { InputType } from '@nestjs/graphql';

@InputType()
export class DeleteDishInput {
  id: string;
}
