import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SESSION_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SESSION_KEY environment variables');
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);



app.post('/server/add-card', async (req, res) => {
    const { name, tags } = req.body;

  if (!name || !tags) {
    res.status(400).json({ error: "Name and tags are required" });
    return;
  }

  try {
    const { error } = await supabase
      .from('cards')
      .insert([{ card_name: name, tags }]);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'Card added successfully' });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});