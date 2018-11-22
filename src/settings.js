const settings = {};

settings.port = process.env.PORT || 3000;
settings.mongoUri = process.env.MONGO_URI || 'localhost';
settings.logging = process.env.LOGGING === 'true' || false;

module.exports = settings;
