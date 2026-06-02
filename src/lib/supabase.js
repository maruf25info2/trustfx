import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bdgdqgewltplzmabysog.supabase.co";

const supabaseAnonKey =
  "sb_publishable_UhB_FrOWAMubuDyvpG9Q_w_lKEsYOk6";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);