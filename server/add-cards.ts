import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken'

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
    const token = req.headers.authorization?.split(' ')[1];
    if (!name || !tags) {
      res.status(400).json({ error: "Name and tags and token are required" });
      return;
    }

    try {
      const decoded = jwt.verify(token as string, process.env.NEXTAUTH_SECRET as string);
      let user_email: string | undefined;
      if (typeof decoded === 'object' && decoded !== null && 'email' in decoded) {
        user_email = (decoded as jwt.JwtPayload).email as string;
      } else {
        res.status(401).json({ error: "Invalid token payload" });
        return;
      }

      const { error } = await supabase
        .from('cards')
        .insert([{ card_name: name, tags, user_email }]);

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



app.get('/server/fetch-card',async(req,res)=>{

    const {error,data}=await supabase.from("cards").select("*")

    if(error){
        console.log("Error in reflecting data"+error.message);
    }

    res.json({ data });

})


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});