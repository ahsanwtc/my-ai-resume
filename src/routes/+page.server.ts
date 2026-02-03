import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';
import type {
	PageData,
	ResumeProfile,
	ResumeExperience,
	ResumeSkill,
	ResumeFaqResponse
} from '$lib/types';

export const load: PageServerLoad = async (): Promise<PageData> => {
	const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);

	// Fetch all data in parallel
	const [profileRes, experiencesRes, skillsRes, faqRes] = await Promise.all([
		supabase.from('resume_profile').select('*').single<ResumeProfile>(),
		supabase.from('resume_experiences').select('*').order('display_order').returns<ResumeExperience[]>(),
		supabase.from('resume_skills').select('*').returns<ResumeSkill[]>(),
		supabase.from('resume_faq_responses').select('*').returns<ResumeFaqResponse[]>()
	]);

	// Public data for rendering
	const publicData: PageData = {
		profile: profileRes.data
			? {
					name: profileRes.data.name,
					shortName: profileRes.data.short_name,
					tagline: profileRes.data.tagline,
					title: profileRes.data.title,
					subtitle: profileRes.data.subtitle,
					targetTitles: profileRes.data.target_titles || [],
					targetCompanyStages: profileRes.data.target_company_stages || [],
					location: profileRes.data.location || '',
					remotePreference: profileRes.data.remote_preference || '',
					githubUrl: profileRes.data.github_url,
					linkedinUrl: profileRes.data.linkedin_url,
					twitterUrl: profileRes.data.twitter_url
				}
			: null,

		experiences:
			experiencesRes.data
				?.map((exp) => ({
					id: exp.id,
					name: exp.company_name,
					title: exp.title,
					titleProgression: exp.title_progression,
					team: exp.team,
					startDate: exp.start_date,
					endDate: exp.end_date,
					isCurrent: exp.is_current,
					bulletPoints: exp.bullet_points || [],
					bullets: exp.bullet_points || [],
					order: exp.display_order
				}))
				.sort((a, b) => a.order - b.order) || [],

		skills: {
			strong: skillsRes.data?.filter((s) => s.category === 'strong').map((s) => s.name) || [],
			moderate: skillsRes.data?.filter((s) => s.category === 'moderate').map((s) => s.name) || [],
			gaps: skillsRes.data?.filter((s) => s.category === 'gap').map((s) => s.name) || []
		},

		commonQuestions: faqRes.data?.map((faq) => faq.question) || []
	};

	return publicData;
};
