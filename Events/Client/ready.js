const {Client} = require('discord.js')
const mongoose = require('mongoose');
const config = require("../../config.json");

module.exports = {
    name: "ready",
    once: true,
    
    async execute(client) {
        await mongoose.connect(config.mongodb || '', {
            
        });

        if (mongoose.connect) {
            console.log('Connection to MongoDB is successful.');
        }

        const loopStatus = [
            "Bot created by RTech."
        ]

        setInterval(() => {
            const randomIndex = Math.floor(Math.random() * loopStatus.length);
            const setActivity = loopStatus[randomIndex];

            client.user.setActivity(setActivity);
        }, 65_000);

        console.log(`${client.user.username} has loaded and is now online.`);
    },
};