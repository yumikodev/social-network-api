import { IsAlphanumeric, IsNotEmpty, IsString } from "class-validator";
import { LoginDto } from "./login.dto";

export class RegisterDto extends LoginDto {
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;
}
