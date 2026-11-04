import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etjmholcacudedgunxxx.supabase.co';
const supabaseKey = 'sb_publishable_D4KlNp-GE40n6sClCc21-Q_zqGeG_Xo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAttendance() {
  console.log("Fetching 'attendance' table...");
  const { data, error } = await supabase.from('attendance').select('*').limit(1);
  
  if (error) {
    console.error("Error with 'attendance':", error.message);
  } else {
    console.log("Success! Data:", data);
    if (data.length > 0) {
      console.log("Columns:", Object.keys(data[0]));
    } else {
      console.log("Table exists, but it is empty.");
    }
  }
}

checkAttendance();
