// index.js is used to setup and configure your bot

// Import required packages
const restify = require("restify");
const path = require("path");

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } = require("botbuilder");

const { Bot } = require("./bot")
// const { TeamsBot } = require("./teamsBot");
// const { MainDialog } = require("./dialogs/mainDialog");

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
  appId: process.env.BOT_ID,
  appPassword: process.env.BOT_PASSWORD,
});


adapter.onTurnError = async (context, error) => {
  // This check writes out errors to console log .vs. app insights.
  // NOTE: In production environment, you should consider logging this to Azure
  //       application insights. See https://aka.ms/bottelemetry for telemetry
  //       configuration instructions.
  console.error(`\n [onTurnError] unhandled error: ${error}`);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
    "OnTurnError Trace",
    `${error}`,
    "https://www.botframework.com/schemas/error",
    "TurnError"
  );

  // Send a message to the user
  await context.sendActivity(`The bot encountered an unhandled error:\n ${error.message}`);
  await context.sendActivity("To continue to run this bot, please fix the bot source code.");
  // Clear out state
  // await conversationState.delete(context);
};

// Define the state store for your bot.
// See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state storage system to persist the dialog and user state between messages.
// const memoryStorage = new MemoryStorage();

// // For a distributed bot in production,
// // this requires a distributed storage to ensure only one token exchange is processed.
// const dedupMemory = new MemoryStorage();

// // Create conversation and user state with in-memory storage provider.
// const conversationState = new ConversationState(memoryStorage);
// const userState = new UserState(memoryStorage);

// // Create the main dialog.
// const dialog = new MainDialog(dedupMemory);
// Create the bot that will handle incoming messages.
const bot = new Bot();

// Create HTTP server.
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log(`\nBot started, ${server.name} listening to ${server.url}`);
});

// Listen for incoming requests.
server.post("/api/messages", async (req, res) => {
  await adapter
    .processActivity(req, res, async (context) => {
      await bot.run(context);
    })
    .catch((err) => {
      // Error message including "412" means it is waiting for user's consent, which is a normal process of SSO, sholdn't throw this error.
      if (!err.message.includes("412")) {
        throw err;
      }
    });
});

server.get(
  "/auth-*.html",
  restify.plugins.serveStatic({
    directory: path.join(__dirname, "public"),
  })
);

// Gracefully shutdown HTTP server
["exit", "uncaughtException", "SIGINT", "SIGTERM", "SIGUSR1", "SIGUSR2"].forEach((event) => {
  process.on(event, () => {
    server.close();
  });
});
