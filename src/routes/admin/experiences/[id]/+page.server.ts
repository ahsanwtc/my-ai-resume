import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { ResumeExperience } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	if (params.id === 'new') {
		return { experience: null };
	}

	const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);
	const { data } = await supabase
		.from('resume_experiences')
		.select('*')
		.eq('id', params.id)
		.single<ResumeExperience>();

	return { experience: data };
};

export const actions: Actions = {
	save: async ({ request, params }) => {
		const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);
		const formData = await request.formData();

		const bulletPoints = formData.getAll('bullet_points').filter((b) => b) as string[];

		const experienceData = {
			company_name: formData.get('company_name') as string,
			title: formData.get('title') as string,
			title_progression: (formData.get('title_progression') as string) || null,
			start_date: formData.get('start_date') as string,
			end_date: formData.get('is_current') === 'on' ? null : (formData.get('end_date') as string),
			is_current: formData.get('is_current') === 'on',
			on_hero_section: formData.get('on_hero_section') === 'on',
			bullet_points: bulletPoints,
			display_order: parseInt(formData.get('display_order') as string) || 0
		};

		if (params.id === 'new') {
			const { error } = await supabase.from('resume_experiences').insert(experienceData);
			if (error) return fail(500, { message: error.message });
		} else {
			const { error } = await supabase
				.from('resume_experiences')
				.update(experienceData)
				.eq('id', params.id);
			if (error) return fail(500, { message: error.message });
		}

		throw redirect(303, '/admin/experiences');
	},

	delete: async ({ params }) => {
		const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);
		const { error } = await supabase.from('resume_experiences').delete().eq('id', params.id);

		if (error) return fail(500, { message: error.message });
		throw redirect(303, '/admin/experiences');
	}
};
