import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
	const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
	const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
	const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.from('resume_profile').select('*').single();
  console.log(data)

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
});
