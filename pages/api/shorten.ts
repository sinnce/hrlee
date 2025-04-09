import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import { supabase } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // 짧은 ID 생성
    const id = nanoid(6);

    // Supabase에 저장
    const { data, error } = await supabase
      .from('urls')
      .insert([{ id, original_url: url, created_at: new Date().toISOString() }])
      .select();

    if (error) {
      console.error('Error saving URL:', error);
      return res.status(500).json({ message: 'Failed to create short URL' });
    }

    return res.status(200).json({ short: id });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}