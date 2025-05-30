import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://thokzroqjgrgmphxdtuh.supabase.co'  // ضع هنا رابط مشروع Supabase الخاص بك
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRob2t6cm9xamdyZ21waHhkdHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjM5MTgsImV4cCI6MjA2NDE5OTkxOH0.m2o5CdZmGwz7Bl5CGKpMqt8pn11ryQEnGqGyU7ccGPA'           // ضع هنا المفتاح العمومي anon

export const supabase = createClient(supabaseUrl, supabaseKey)
