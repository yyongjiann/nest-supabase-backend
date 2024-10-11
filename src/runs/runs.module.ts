import { Module } from '@nestjs/common';
import { RunsService } from './runs.service';
import { RunsController } from './runs.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
	imports: [SupabaseModule],
	controllers: [RunsController],
	providers: [RunsService],
})
export class RunsModule {}
