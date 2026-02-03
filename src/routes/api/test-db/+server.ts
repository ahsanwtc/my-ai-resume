import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { json } from '@sveltejs/kit';

export async function GET() {
	const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);

	// Test connection by listing tables
	const { data, error, count } = await supabase.from("resume_profile").select("*", { count: 'exact' });
	console.log('Data:', data);
	console.log('Count:', count);
	console.log('Error:', error);

	if (error) {
		return json({ success: false, error: error.message, details: error }, { status: 500 });
	}

	return json({ success: true, message: 'Supabase connected!', count, data });
}
