import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SECRET_KEY } from '$env/static/private';
import type { ResumeFaqResponse } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);

export const load: PageServerLoad = async ({ params }) => {
	if (params.id === 'new') {
		return { faq: null };
	}

	const { data: faq } = await supabase
		.from('resume_faq_responses')
		.select('*')
		.eq('id', params.id)
		.single<ResumeFaqResponse>();

	return { faq: faq || null };
};

export const actions: Actions = {
	save: async ({ request, params }) => {
		const formData = await request.formData();

		const faqData = {
			question: formData.get('question') as string,
			answer: formData.get('answer') as string,
			is_common_question: formData.get('is_common_question') === 'on',
			display_order: parseInt(formData.get('display_order') as string) || 0
		};

		if (params.id === 'new') {
			const { error } = await supabase.from('resume_faq_responses').insert(faqData);

			if (error) {
				return fail(500, { message: error.message });
			}
		} else {
			const { error } = await supabase
				.from('resume_faq_responses')
				.update(faqData)
				.eq('id', params.id);

			if (error) {
				return fail(500, { message: error.message });
			}
		}

		throw redirect(303, resolve('/admin/faq'));
	},

	delete: async ({ params }) => {
		const { error } = await supabase.from('resume_faq_responses').delete().eq('id', params.id);

		if (error) {
			return fail(500, { message: error.message });
		}

		throw redirect(303, resolve('/admin/faq'));
	}
};
