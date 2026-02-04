import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);

	const [experiencesRes, skillsRes, faqRes] = await Promise.all([
		supabase.from('resume_experiences').select('id'),
		supabase.from('resume_skills').select('id'),
		supabase.from('resume_faq_responses').select('id')
	]);

	return {
		stats: {
			experiences: experiencesRes.data?.length || 0,
			skills: skillsRes.data?.length || 0,
			faqs: faqRes.data?.length || 0
		}
	};
};
