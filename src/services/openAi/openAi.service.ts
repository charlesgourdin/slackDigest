import OpenAI  from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function createChatCompletion({model, systemPrompt, userPrompt}: Record<any, any>) {
    try {
        const response = await openai.chat.completions.create({
            model,
            messages: [
                {   role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        throw new Error('Error creating chat completion');
    }
}
