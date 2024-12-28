const {loadFiles} = require("../Functions/fileLoader");

async function loadCommands(client) {
    console.time("Commands loaded");

    client.commands = new Map();
    const commands = new Array();

    const files = await loadFiles("Commands");

    for (const file of files) {
        try {
            const command = require(file);
            const execute = (...args) => command.execute(...args, client);
            const target = command.rest ? client.rest : client;

            target[command.once ? "once" : "on"](command.name, execute);
            client.commands.set(command.data.name, command);

            commands.push({Command: command.name, Status: "✅"});
        } catch (error) {
            commands.push({Command: file.split("/").pop().slice(0, -3), Status: "❗"});
        }
    }

    console.table(commands, ["Command", "Status"]);
    console.info("\n\x1b[36m%s\x1b[0m", "Successfully loaded commands!");
    console.timeEnd("Commands loaded")
}

module.exports = {loadCommands};