import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etjmholcacudedgunxxx.supabase.co';
const supabaseKey = 'sb_publishable_D4KlNp-GE40n6sClCc21-Q_zqGeG_Xo';

const supabase = createClient(supabaseUrl, supabaseKey);

const allPossibleTables = [
  'campus_services',
  'campus_announcements',
  'student_cie_tests',
  'student_assignments',
  'class_schedules',
  'student_metrics',
  'attendance',
  'attendance_summary',
  'students',
  'user_roles',
  'user_department_assignments',
  'user_profiles',
  'section_subjects',
  'curriculum_subjects',
  'sections',
  'subjects',
  'program_semester_calendar',
  'program_departments',
  'academic_semesters',
  'academic_years',
  'programs',
  'departments',
  'id',
  'id_information',
  'student_ids',
];

async function clearData() {
  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  console.log(`Checking and clearing tables...\n`);

  for (const table of allPossibleTables) {
    try {
      // 1. Fetch current rows
      const { data, error } = await supabase.from(table).select('*').limit(100);

      if (error) {
        // Table might not exist or permission denied
        console.log(`[-] Table '${table}': ${error.message}`);
        continue;
      }

      console.log(`[+] Table '${table}' exists. Row count found: ${data.length}`);

      if (data.length > 0) {
        console.log(`    Sample record in '${table}':`, Object.keys(data[0]));
        // Try deleting rows
        // If table has 'id'
        if ('id' in data[0]) {
          const { error: delErr } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
          if (delErr) {
            console.log(`    Failed to delete from '${table}': ${delErr.message}`);
          } else {
            console.log(`    Successfully deleted rows from '${table}'`);
          }
        } else if ('usn' in data[0]) {
          const { error: delErr } = await supabase.from(table).delete().neq('usn', '');
          if (delErr) {
            console.log(`    Failed to delete from '${table}': ${delErr.message}`);
          } else {
            console.log(`    Successfully deleted rows from '${table}'`);
          }
        }
      }
    } catch (e) {
      console.log(`[-] Error testing table '${table}':`, e.message);
    }
  }

  console.log('\nClear process completed.');
}

clearData();
