import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { ResumeExperience } from '$lib/types';

export const load: PageServerLoad = async () => {
	const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);
	
	const { data } = await supabase
		.from('resume_experiences')
		.select('*')
		.order('display_order')
		.returns<ResumeExperience[]>();

	return { experiences: data || [] };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);
		const formData = await request.formData();
		const id = formData.get('id');

		const { error } = await supabase.from('resume_experiences').delete().eq('id', id);

		if (error) return fail(500, { message: error.message });
		return { success: true };
	}
};
