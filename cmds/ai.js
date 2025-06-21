const axios = require("axios");

module.exports = {
    name: "ai",
    usePrefix: false,
    usage: "ai <your question> | <reply to an image>",
    version: "1.2",
    admin: false,
    cooldown: 2,

    execute: async ({ api, event, args }) => {
        try {
            const { threadID } = event;
            let prompt = args.join(" ");
            let imageUrl = null;

            // Utilisation de l'API ChatGPT 4.0 Free via un backend proxy (exemple)
            let apiUrl = `https://autobot.mark-projects.site/api/chatgpt-free?ask=${encodeURIComponent(prompt)}`;

            if (event.messageReply && event.messageReply.attachments.length > 0) {
                const attachment = event.messageReply.attachments[0];
                if (attachment.type === "photo") {
                    imageUrl = attachment.url;
                    apiUrl += `&imageurl=${encodeURIComponent(imageUrl)}`;
                }
            }

            const loadingMsg = await api.sendMessage("🤖 ChatGPT réfléchit... 🧠", threadID);

            const response = await axios.get(apiUrl);
            const answer = response?.data?.data?.description || response?.data?.answer;

            if (answer) {
                return api.sendMessage(`🤖 **ChatGPT 4.0**\n━━━━━━━━━━━━━━━━\n${answer}\n━━━━━━━━━━━━━━━━`, threadID, loadingMsg.messageID);
            }

            return api.sendMessage("⚠️ Aucune réponse trouvée.", threadID, loadingMsg.messageID);
        } catch (error) {
            console.error("❌ ChatGPT Error:", error.message);
            return api.sendMessage("❌ Erreur lors de la communication avec ChatGPT API.", event.threadID);
        }
    }
};