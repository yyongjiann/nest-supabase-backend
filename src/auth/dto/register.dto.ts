import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	userName: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string;
}
