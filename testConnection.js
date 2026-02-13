require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// create client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDB() {
  console.log("Testing database connection...");

  const { data, error } = await supabase
    .from('register_worker')   // change table if needed
    .select('*')
    .limit(3);

  if (error) {
    console.error("Connection FAILED ❌");
    console.error(error.message);
  } else {
    console.log("Connection SUCCESS ✅");
    console.log("Rows:", data);
  }
}

testDB();
