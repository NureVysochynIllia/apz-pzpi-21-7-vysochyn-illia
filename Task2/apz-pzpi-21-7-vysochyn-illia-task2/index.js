const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const expressWs = require('express-ws');
const config = require("./config");
const userRouter = require("./routers/userRouter");
const clusterRouter = require("./routers/clusterRouter");
const storageRouter = require("./routers/storageRouter");
const staffRouter = require("./routers/staffRouter");
const rentRouter = require("./routers/rentRouter");
const adminRouter = require("./routers/adminRouter");
const server = expressWs(express());
const app = server.app;
app.use(express.static('public'));
const aWss = server.getWss('/');
app.use(cors());
const PORT = 5000;
app.use(express.json());
app.use("/user", userRouter);
app.use("/clusters", clusterRouter);
app.use("/storages", storageRouter);
app.use("/staff", staffRouter);
app.use("/rent", rentRouter);
app.use("/admin", adminRouter);
const start = async () =>{
    try{
        await mongoose.connect(config.connection);
        app.ws('/', function(ws, req) {
            ws.onmessage = function(msg) {
                aWss.clients.forEach(function (client) {
                    client.send(msg.data);
                });
            };
        });
        app.listen(PORT, () => console.log(`server started at port  ${PORT}`));
    } catch (e){
        console.log(e);
    }
}
start();