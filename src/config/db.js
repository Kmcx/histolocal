const mongoose = require('mongoose');

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        if (this.connection) {
            console.log('Already connected to MongoDB');
            return this.connection;
        }

        try {
            this.connection = await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB connected');
            return this.connection;
        } catch (error) {
            console.error('MongoDB connection error:', error.message);
            process.exit(1); 
        }
    }

    async disconnect() {
        if (!this.connection) {
            console.log('No active MongoDB connection to close');
            return;
        }

        try {
            await mongoose.disconnect();
            console.log('MongoDB connection closed');
            this.connection = null;
        } catch (error) {
            console.error('Error while disconnecting MongoDB:', error.message);
        }
    }
}

module.exports = new Database();
