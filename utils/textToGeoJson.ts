import { Configuration, OpenAIApi } from 'openai';
import { STFeature } from '../interfaces';

export const textToFeatures = async (text: string): Promise<STFeature[] | undefined> => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // 環境変数から OpenAI API キーを取得
  });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: [
        { role: "system", content: 'アプリケーションの部品として、ユーザーの入力をsetGeojsonの呼び出しとその引数となる拡張GeoJSONとして解釈してください。' },
        { role: "system", content: 'GeoJSONにおけるcoordinatesは、三次元座標系に由来するため、経度・緯度の順番であることに留意してください。' },
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
                      "edtf": { "type": "string" },
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
    const functionArguments = first?.message?.function_call?.arguments;
    if (!functionArguments) {
      console.error('Not enough input for GeoJSON:', first);
      return;
    }
    return JSON.parse(functionArguments)['features'].map((f: any) => ({ ...f, properties: { ...f.properties, id: crypto.randomUUID() } }))
  } catch (error) {
    if (error.response) {
      console.error('Error response from OpenAI API:', error.response.data);
    } else if (error) {
      console.error('Error calling OpenAI API:', error);
    }
  }
};
