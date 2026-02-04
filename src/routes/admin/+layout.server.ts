import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { session } = await locals.safeGetSession();
	
	if (!session && !url.pathname.includes('/admin/login')) {
		throw redirect(303, '/admin/login');
	}

	return { session };
};
