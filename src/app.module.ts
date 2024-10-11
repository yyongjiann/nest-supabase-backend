import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RunsModule } from './runs/runs.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard';

@Module({
	imports: [UsersModule, RunsModule, PrismaModule, AuthModule],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
