const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for frontend requests

// Supabase client setup using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// API Route: GET /services
// Fetches all services from the services table for dropdown list
app.get('/services', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('service_name');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch services' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// API Route: GET /localities
// Fetches all localities from the localities table for dropdown list
app.get('/localities', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('localities')
      .select('locality_name');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch localities' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// API Route: POST /search-workers
// Searches workers based on service, locality, and availability filter
app.post('/search-workers', async (req, res) => {
  const { service, locality, availableOnly } = req.body;

  // Validate input
  if (!service || !locality) {
    return res.status(400).json({ error: 'Service and locality are required' });
  }

  try {
    let query = supabase
      .from('register_worker')
      .select('name, phone, profession, locality, is_available')
      .ilike('profession', `%${service}%`) // Case-insensitive match for profession
      .ilike('locality', `%${locality}%`); // Case-insensitive match for locality

    // If availableOnly is true, filter for available workers only
    if (availableOnly === true) {
      query = query.eq('is_available', true);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to search workers' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// API Route: GET /test-connection
// Tests the Supabase connection by querying the register_worker table
app.get('/test-connection', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('register_worker')
      .select('count', { count: 'exact', head: true });

    if (error) {
      return res.status(500).json({ 
        connected: false, 
        error: 'Database connection failed: ' + error.message 
      });
    }

    res.json({ 
      connected: true, 
      message: 'Successfully connected to Supabase',
      workerCount: data 
    });
  } catch (err) {
    res.status(500).json({ 
      connected: false, 
      error: 'Connection error: ' + err.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});