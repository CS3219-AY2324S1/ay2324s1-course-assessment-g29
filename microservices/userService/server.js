const app = require('./src/app');

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

module.exports = server;