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
      model: "gpt-3.5-turbo-0613",
      messages: [
        { role: "user", content: text }
      ],
      functions: [{
        "name": "setGeojson",
        "description": "Append new GeoJSON to GeoJSON map provided by Leaflet.js.",
        // function parameter in chat completion is defined as a JSON schema([API Reference](https://platform.openai.com/docs/api-reference/chat/create))
        "parameters": {
          "type": "object",
          "properties": {
            "type": { "type": "string", "enum": ["FeatureCollection"] },
            "features": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "type": { "type": "string", "enum": ["Feature"] },
                  "properties": {
                    "type": "object",
                    "properties": {
                      "name": { "type": "string" },
                      "year": { "type": "number" },
                      "image": { "type": "string" },
                    },
                  },
                  "geometry": {
                    "type": "object",
                    "properties": {
                      "type": { "type": "string", "enum": ["Point"] },
                      "coordinates": {
                        "type": "array",
                        "items": {
                          "type": "number"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "required": ["geometry"],
        },
      }],
      temperature: 0,
      n: 1,
    });

    console.debug({ data: JSON.stringify(response.data) })

    const first = response.data.choices[0];
    const functionCall = first?.message?.function_call;
    if (!functionCall) {
      res.status(400).json({ message: 'Not enough input for GeoJSON' });
      return;
    }
    const geoJson = JSON.parse(functionCall?.arguments)
    res.status(200).json(geoJson);
  } catch (error) {
    if (error.response) {
      console.error('Error response from OpenAI API:', error.response.data);
    } else if (error) {
      console.error('Error calling OpenAI API:', error);
    }
  }
};
