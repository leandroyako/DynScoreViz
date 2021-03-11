// export constructor function that must be called to initialize this module
module.exports = (app) => {
    //const host = 'localhost'
    const host = '0.0.0.0'
    const port = 3000 || process.env.port

    const httpServer = require("http")
        .createServer(app)
        .listen(port, host, () => {
            const host = httpServer.address().address;
            const port = httpServer.address().port;
            console.log(`App listening at http://${host}:${port}`);
        });
    return httpServer;
};