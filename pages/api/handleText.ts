// pages/api/handleText.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { text } = req.body;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // 環境変数から OpenAI API キーを取得
  });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: 'これから歴史上のイベントを自然言語で送信するので、完全に正しい拡張GeoJSONフォーマットで返却してください。\n返却時のフォーマットは [ から始めて ] で終了するJSONの配列として完全に正しい形式にしてください。そうしなかった場合、アプリケーションがエラーを引き起こしビジネス上の損害が発生します。\n[{"type":"Feature","properties":{"name":"ガンディーの誕生","year":1869,"image":"https://upload.wikimedia.org/wikipedia/commons/8/8f/Gandhi_and_Laxmidas_2.jpg"},"geometry":{"type":"Point","coordinates":[70.794922,21.641706]}}]' },
        { role: "user", content: text }
    ],
      temperature: 0,
    });
    const chatGptResponse = response.data.choices[0].message?.content.trim();
    console.log({chatGptResponse});
    const geoJson = JSON.parse(chatGptResponse)
    res.status(200).json(geoJson);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
  }
};
