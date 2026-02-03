// Database table types
export interface ResumeProfile {
	id: string;
	created_at: string;
	updated_at: string;
	name: string;
	short_name: string;
	tagline: string;
	email: string;
	title: string;
	subtitle?: string;
	target_titles: string[];
	target_company_stages: string[];
	location: string;
	remote_preference: string;
	github_url?: string;
	linkedin_url?: string;
	twitter_url?: string;
}

export interface ResumeExperience {
	id: string;
	profile_id: string;
	created_at: string;
	company_name: string;
	title: string;
	title_progression?: string;
	team?: string;
	start_date: string;
	end_date?: string;
	is_current: boolean;
	bullet_points: string[];
	display_order: number;
}

export interface ResumeSkill {
	id: string;
	profile_id: string;
	created_at: string;
	name: string;
	category: 'strong' | 'moderate' | 'gap';
}

export interface ResumeFaqResponse {
	id: string;
	profile_id: string;
	created_at: string;
	question: string;
	answer: string;
}

export interface ResumeWeakness {
	id: string;
	profile_id: string;
	created_at: string;
	description: string;
}

export interface ResumeValuesCulture {
	id: string;
	profile_id: string;
	created_at: string;
	must_haves?: string;
	dealbreakers?: string;
}

// Public-facing types (for frontend)
export interface Profile {
	name: string;
	shortName: string;
	tagline: string;
	title: string;
	subtitle?: string;
	targetTitles: string[];
	targetCompanyStages: string[];
	location: string;
	remotePreference: string;
	githubUrl?: string;
	linkedinUrl?: string;
	twitterUrl?: string;
}

export interface Experience {
	id: string;
	name: string;
	title: string;
	titleProgression?: string;
	team?: string;
	startDate: string;
	endDate?: string;
	isCurrent: boolean;
	bulletPoints: string[];
	bullets: string[];
	order: number;
}

export interface SkillsMatrix {
	strong: string[];
	moderate: string[];
	gaps: string[];
}

export interface PageData {
	profile: Profile | null;
	experiences: Experience[];
	skills: SkillsMatrix;
	commonQuestions: string[];
}
