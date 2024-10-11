import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	ParseIntPipe,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { RunsService } from './runs.service';
import { CreateRunDto } from './dto/create-run.dto';
import { getUser } from 'src/auth/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseStorageService } from 'src/supabase/supabase-storage.service';

@Controller('runs')
export class RunsController {
	constructor(
		private readonly runsService: RunsService,
		private readonly supabaseStorageService: SupabaseStorageService,
	) {}

	@Post()
	@UseInterceptors(FileInterceptor('routeImage')) // Handle the image upload
	async create(
		@getUser('userId') userId: number,
		@Body() createRunDto: CreateRunDto,
		@UploadedFile() routeImage: Express.Multer.File,
	) {
		// Upload image to Supabase Storage
		const routeImagePath =
			await this.supabaseStorageService.uploadRouteImage(routeImage);

		// Save run metadata and image URL
		return this.runsService.create(userId, createRunDto, routeImagePath);
	}

	@Get()
	findAll(@getUser('userId') userId: number) {
		return this.runsService.findAll(userId);
	}

	@Get(':id')
	findOne(
		@getUser('userId') userId: number,
		@Param('id', ParseIntPipe) runId: number,
	) {
		return this.runsService.findOne(userId, runId);
	}
}
