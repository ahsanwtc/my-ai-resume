import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SECRET_KEY } from '$env/static/private';
import type { ResumeFaqResponse } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);

export const load: PageServerLoad = async () => {
	const { data: faqs } = await supabase
		.from('resume_faq_responses')
		.select('*')
		.order('display_order', { ascending: true })
		.returns<ResumeFaqResponse[]>();

	return {
		faqs: faqs || []
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		const { error } = await supabase.from('resume_faq_responses').delete().eq('id', id);

		if (error) {
			return fail(500, { message: error.message });
		}

		return { success: true };
	},

	reorder: async ({ request }) => {
		const formData = await request.formData();
		const updates = JSON.parse(formData.get('updates') as string);

		for (const update of updates) {
			await supabase
				.from('resume_faq_responses')
				.update({ display_order: update.display_order })
				.eq('id', update.id);
		}

		return { success: true };
	}
};
