import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://juizyixapxughdyuncdz.supabase.co'  // ضع هنا رابط مشروع Supabase الخاص بك
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aXp5aXhhcHh1Z2hkeXVuY2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMzk0MDgsImV4cCI6MjA2NDcxNTQwOH0.w6C6Nhqqskd930StE_GVrFwPfu5dKaIl4lk-GyTu4no'           // ضع هنا المفتاح العمومي anon

export const supabase = createClient(supabaseUrl, supabaseKey)

