import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { ResumeSkill } from '$lib/types';

const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);

export const load: PageServerLoad = async () => {
	const { data } = await supabase
		.from('resume_skills')
		.select('*')
		.order('display_order')
		.returns<ResumeSkill[]>();

	return {
		skills: {
			strong: data?.filter(s => s.category === 'strong') || [],
			moderate: data?.filter(s => s.category === 'moderate') || [],
			gap: data?.filter(s => s.category === 'gap') || []
		}
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		const { error } = await supabase.from('resume_skills').delete().eq('id', id);

		if (error) return fail(500, { message: error.message });
		return { success: true };
	},

	reorder: async ({ request }) => {
		const formData = await request.formData();
		const updates = JSON.parse(formData.get('updates') as string);

		for (const update of updates) {
			await supabase
				.from('resume_skills')
				.update({ display_order: update.order })
				.eq('id', update.id);
		}

		return { success: true };
	}
};
