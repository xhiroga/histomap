import { parse } from 'jsonc-parser';
import { Configuration, OpenAIApi } from 'openai';
import { STFeature } from '../interfaces';

export const textToFeatures = async (text: string): Promise<STFeature[] | undefined> => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: 'アプリケーションの部品として、ユーザーの入力をsetGeojsonの呼び出しとその引数となる拡張GeoJSONとして解釈してください。' },
        { role: "system", content: 'edtfはExtended Date/Time Format (EDTF) Specificationを遵守して下さい。例: 8世紀→0700/0799' },
        { role: "system", content: 'GeoJSONにおけるcoordinatesは、三次元座標系に由来するため、経度・緯度の順番であることに留意してください。' },
        { role: "system", content: '返り値はparse()します。ブロッククォートは不要です。JSONのみを返してください。' },
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
                      // IDはプログラムでランダムに生成するので、ここでは指定しない
                      "name": { "type": "string" },
                      "edtf": { "type": "string" },
                      "description": { "type": "string" },
                    },
                  },
                  "geometry": {
                    "type": "object",
                    "properties": {
                      "type": { "type": "string", "enum": ["Point", "Polygon"] },
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
          "required": ["type", "features"],
        },
      }],
      temperature: 0,
      n: 1,
    });

    console.debug({ data: JSON.stringify(response.data) })

    const first = response.data.choices[0];
    const content = first?.message?.content;
    if (!content) {
      console.error('Not enough input for GeoJSON:', first);
      return;
    }
    return parse(content)['features'].map((f: any) => ({ ...f, properties: { ...f.properties, id: crypto.randomUUID() } }))
  } catch (error) {
    if (error.response) {
      console.error('Error response from OpenAI API:', error.response.data);
    } else if (error) {
      console.error('Error calling OpenAI API:', error);
    }
  }
};
