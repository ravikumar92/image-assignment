const dbClient = (db) => {
    return (req, res, next) => {
        req.dbClient = db;
        next();
    };
}

module.exports = dbClient;