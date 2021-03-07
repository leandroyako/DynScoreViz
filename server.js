// export constructor function that must be called to initialize this module
module.exports = (app) => {
    const httpServer = require("http")
        .createServer(app)
        .listen(3000 || process.env.port, "127.0.0.1", () => {
            const host = httpServer.address().address;
            const port = httpServer.address().port;
            console.log(`App listening at http://${host}:${port}`);
        });
    return httpServer;
};