import { NextApiRequest, NextApiResponse } from "next";

const generateAnswer = async ({ prompt }: any) => {
  try {
    const response = await fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });
    const data = await response.json();

    return data.choices[0].text;
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
