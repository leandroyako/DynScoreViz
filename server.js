// export constructor function that must be called to initialize this module
module.exports = function(app) {

    const server = app.listen(3000 || process.env.PORT, () => {
        console.log('App listening on port 3000!');
    });
    return server;
};