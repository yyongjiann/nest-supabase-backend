import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupabaseStorageService {
	private supabase;

	setAccessToken(token: string) {
		this.supabase = createClient(
			process.env.SUPABASE_URL,
			process.env.SUPABASE_KEY,
			{
				global: {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			},
		);
	}

	async uploadRouteImage(file: Express.Multer.File): Promise<string> {
		const bucket = 'route-images';
		const uniqueFilename = `${uuidv4()}-${file.originalname}`;

		const { data, error } = await this.supabase.storage
			.from(bucket)
			.upload(uniqueFilename, file.buffer, {
				contentType: file.mimetype,
			});

		if (error) {
			throw new Error(`Failed to upload image: ${error.message}`);
		}
		return uniqueFilename;
	}

	async getSignedUrl(filePath: string): Promise<string> {
		const { data: signedUrlData, error: signedUrlError } =
			await this.supabase.storage
				.from('route-images')
				.createSignedUrl(filePath, 60 * 60); // 1 hour expiration

		if (signedUrlError) {
			throw new Error(
				`Unable to retrieve signed URL: ${signedUrlError.message}`,
			);
		}

		if (!signedUrlData || !signedUrlData.signedUrl) {
			throw new Error('Unable to retrieve signed URL for the uploaded image.');
		}

		return signedUrlData.signedUrl;
	}
}
