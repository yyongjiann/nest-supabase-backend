import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateRunDto } from './dto/create-run.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseStorageService } from 'src/supabase/supabase-storage.service';

@Injectable()
export class RunsService {
	constructor(
		private prisma: PrismaService,
		private readonly supabaseStorageService: SupabaseStorageService,
	) {}
	async create(
		userId: number,
		createRunDto: CreateRunDto,
		routeImagePath: string,
	) {
		try {
			const run = await this.prisma.run.create({
				data: {
					...createRunDto,
					routeImagePath,
					userId,
				},
			});

			return { message: 'Successfully added run.' };
		} catch (error) {
			throw error;
		}
	}

	async findAll(userId: number) {
		const runs = await this.prisma.run.findMany({
			where: {
				userId,
			},
		});

		if (!runs) {
			throw new Error('No runs found');
		}

		// Map over the runs to include the signed URL for each run
		const runsWithUrls = await Promise.all(
			runs.map(async (run) => {
				const signedUrl = await this.supabaseStorageService.getSignedUrl(
					run.routeImagePath,
				);
				return {
					...run,
					signedUrl,
				};
			}),
		);
		return runsWithUrls;
	}

	async findOne(userId: number, runId: number) {
		const run = await this.prisma.run.findUnique({
			where: {
				id: runId,
			},
		});

		// If the run does not exist, throw a 404 Not Found error
		if (!run) {
			throw new NotFoundException('Run not found');
		}

		// If the run exists but does not belong to the user, throw a 403 Forbidden error
		if (run.userId !== userId) {
			throw new ForbiddenException('You do not have access to this run');
		}

		const signedUrl = await this.supabaseStorageService.getSignedUrl(
			run.routeImagePath,
		);
		return {
			...run,
			signedUrl,
		};
	}
}
