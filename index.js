require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} está online`);
});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  const mentioned = message.mentions.has(client.user);

  if (!mentioned) return;

  await message.channel.sendTyping();

  try {

    const completion =
      await openai.chat.completions.create({

      model: "openrouter/free",

     messages: [
  {
    role: "system",
    content:
      "Você é HirakiAI, um assistente inteligente do Discord. Responda naturalmente, seja amigável e útil. Nunca diga que é o Bot do Luigi."
  },
  {
    role: "user",
    content: message.content
  }
]

    });

    const reply =
      completion.choices[0].message.content;

    await message.reply(reply);

  } catch (error) {

    console.log(error);

    await message.reply(
      "❌ " + error.message
    );
  }

});

client.login(process.env.DISCORD_TOKEN);