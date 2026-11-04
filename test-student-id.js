import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etjmholcacudedgunxxx.supabase.co';
const supabaseKey = 'sb_publishable_D4KlNp-GE40n6sClCc21-Q_zqGeG_Xo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  const tablesToTest = ['id', 'id information', 'id_information', 'student_ids', 'students', 'user_profiles'];
  
  for (const tableName of tablesToTest) {
    console.log(`\nFetching '${tableName}' table...`);
    const { data, error } = await supabase.from(tableName).select('*').limit(5);
    
    if (error) {
      console.error(`Error with '${tableName}':`, error.message);
    } else {
      console.log(`Success '${tableName}':`, data);
    }
  }
}

checkTable();
