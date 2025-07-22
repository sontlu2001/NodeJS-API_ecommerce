const app = require("./src/app");
const {app:{port}} = require("./src/configs/config");
const PORT = port||3056;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`);
});
process.on('SIGINT',()=>{
    server.close(() => console.log('Exit Server'))
})