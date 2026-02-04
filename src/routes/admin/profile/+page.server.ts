import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { ResumeProfile } from '$lib/types';

export const load: PageServerLoad = async () => {
	const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);
	const { data } = await supabase.from('resume_profile').select('*').single<ResumeProfile>();
	return { profile: data };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);
		const formData = await request.formData();

		const targetTitles = formData.getAll('target_titles').filter((t) => t) as string[];
		const targetCompanyStages = formData.getAll('target_company_stages').filter((s) => s) as string[];

		const profileId = "1";

		const updateData = {
			name: formData.get('name') as string,
			short_name: formData.get('short_name') as string,
			tagline: formData.get('tagline') as string,
			title: formData.get('title') as string,
			subtitle: (formData.get('subtitle') as string) || null,
			target_titles: targetTitles,
			target_company_stages: targetCompanyStages,
			location: (formData.get('location') as string) || null,
			remote_preference: (formData.get('remote_preference') as string) || null,
			github_url: (formData.get('github_url') as string) || null,
			linkedin_url: (formData.get('linkedin_url') as string) || null,
			twitter_url: (formData.get('twitter_url') as string) || null,
			updated_at: new Date().toISOString()
		};

		console.log('Updating profile:', profileId, updateData);

		const { error } = await supabase
			.from('resume_profile')
			.update(updateData)
			.eq('id', profileId);

		console.log('Update error:', error);

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true };
	}
};
