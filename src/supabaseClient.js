import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://harygyrocaakzzhyixuz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhcnlneXJvY2Fha3p6aHlpeHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMTM1NTYsImV4cCI6MjA3MTU4OTU1Nn0.REWvK-XWoslP03nXJ5u2oQ1EYU-f3UjSH-oNs_PNJXY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
