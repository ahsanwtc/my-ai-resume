import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { ResumeSkill } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	if (params.id === 'new') {
		return { skill: null };
	}

	const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);
	const { data } = await supabase
		.from('resume_skills')
		.select('*')
		.eq('id', params.id)
		.single<ResumeSkill>();

	return { skill: data };
};

export const actions: Actions = {
	save: async ({ request, params }) => {
		const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);
		const formData = await request.formData();

		const skillData = {
			name: formData.get('name') as string,
			category: formData.get('category') as string,
			self_rating: formData.get('self_rating') ? parseInt(formData.get('self_rating') as string) : null,
			evidence: (formData.get('evidence') as string) || null,
			honest_notes: (formData.get('honest_notes') as string) || null,
			years_experience: formData.get('years_experience') ? parseFloat(formData.get('years_experience') as string) : null,
			in_use: formData.get('in_use') === 'on',
			last_used: formData.get('in_use') === 'on' ? null : (formData.get('last_used') as string) || null,
			display_order: parseInt(formData.get('display_order') as string) || 0
		};

		if (params.id === 'new') {
			const { error } = await supabase.from('resume_skills').insert(skillData);
			if (error) return fail(500, { message: error.message });
		} else {
			const { error } = await supabase
				.from('resume_skills')
				.update(skillData)
				.eq('id', params.id);
			if (error) return fail(500, { message: error.message });
		}

		throw redirect(303, '/admin/skills');
	},

	delete: async ({ params }) => {
		const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);
		const { error } = await supabase.from('resume_skills').delete().eq('id', params.id);

		if (error) return fail(500, { message: error.message });
		throw redirect(303, '/admin/skills');
	}
};
