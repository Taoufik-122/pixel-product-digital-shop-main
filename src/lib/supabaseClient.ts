import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,       // ✅ لحفظ الجلسة في المتصفح
      autoRefreshToken: true,     // ✅ لتحديث التوكن تلقائيًا
      detectSessionInUrl: true,   // ✅ لتأكيد الجلسة من الرابط بعد التأكيد مثل /#access_token=
    },
  }
);
