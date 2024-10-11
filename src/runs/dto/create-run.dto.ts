import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRunDto {
	@IsNumber()
	@IsNotEmpty()
	distanceKm: number;

	@IsNumber()
	@IsNotEmpty()
	durationSec: number;

	@IsString()
	@IsNotEmpty()
	pacePerKm: string;
}
