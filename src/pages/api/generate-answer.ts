import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

interface generateAnswerProps {
  prompt: string;
}

const generateAnswer = async ({ prompt }: generateAnswerProps): Promise<string | undefined> => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: prompt,
        max_tokens: 2000,
        temperature: 0.2,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].text;
  } catch (err) {
    console.error(err);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;

  const answer = await generateAnswer({
    prompt,
  });

  res.status(200).json({
    answer,
  });
}
