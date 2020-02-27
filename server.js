const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const ip = getIPAdress();
const port = 8000

//連接指定的MongoDB
const main = async () => {
    try{
        await mongoose.connect('mongodb+srv://ts03085781:ts03085782@testdb-7kn7i.gcp.mongodb.net/userDB',{useNewUrlParser:true,useUnifiedTopology:true},()=>{console.log('db created')});
    }catch(err){
        console.log('DB link false!!', err)
    }
};
main();

//取得本地當前ip位置的函式 
function getIPAdress() { 
    var interfaces = require('os').networkInterfaces();　　 
    for (var devName in interfaces) {　　　　 
        var iface = interfaces[devName];　　　　　　 
        for (var i = 0; i < iface.length; i++) { 
            var alias = iface[i]; 
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) { 
                return alias.address; 
            } 
        }　　 
    } 
} 

//開啟所有request限制條件
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//建立DB數據模板
const user1 = mongoose.model('user1',mongoose.Schema({name:String,point:Number}));
const game_ranks = mongoose.model('game_ranks',mongoose.Schema({name:String,frequency:Number,comment:String}));

//監聽8000窗口
app.listen(port,ip, ()=>{console.log(`SERVER created at ${ip}`);})

//對所有請求解析其body
app.use(bodyParser.json())

//增加 mongoDB 內的 document
app.post('/api/post', async (req,res) =>{
    const checkData = await user1.find({name:req.body.name})
    if(checkData.length>0){
        res.send(`重複資料!,資料庫內已存有"${req.body.name}"`)
    }else{
        const newData = new user1({
            name:req.body.name,
            point:req.body.point,
        });
        await newData.save();
        res.send(`已成功添加${req.body.name},${req.body.point}公斤`)
    }
})

// 刪除指定name
app.delete('/api/delete/:name', async (req, res) =>{
    await user1.deleteOne({name:req.params.name})
    res.send(`name:${req.params.name} is deleted`)
})

//刪除全部
app.delete('/api/delete/all', async (req, res) =>{
    await user1.remove({})
    res.send(`all deleted`)
})

//查詢全部name
app.get('/api/get/all', async (req,res) =>{
    const data = await user1.find()
    res.json(data)
})

//查詢單一name
app.get('/api/get/:name', async (req,res) =>{
    const data = await user1.find({name:req.params.name})
    res.json(data)
})

//修改原有資料
app.put('/api/update', async (req, res)=>{
    const data = await user1.update({name:req.body.name},{$set:{point:req.body.point}})
    res.json(data)
})

//點擊遊戲rank加入名單
app.post('/api/clickGame/post', async (req,res) =>{
    const newGameData = new game_ranks({
        name:req.body.name,
        frequency:req.body.frequency,
        comment:req.body.comment,
    });
    await newGameData.save();
    res.send(`已成功加入rank排名公斤`)
})

app.get('/api/clickGame/get/all', async (req,res) =>{
    const data = await game_ranks.find().sort({frequency:-1})
    res.json(data)
})



//將 express 放進 http 中開啟 Server 的 3000 port ，正確開啟後會在 console 中印出訊息
const server = require('http').Server(app).listen(5000,ip,()=>{console.log('open WS!')})
//引入 io
const socket = require('socket.io')
//將啟動的 Server 送給 socket.io 處理
const io = socket(server)

//監聽 Server 連線後的所有事件，並捕捉事件 socket 執行
io.on('connection', (socket) => {
    //經過連線後在 console 中印出訊息
    console.log('success connect at SERVER!')

    //以下的 getMessage, getMessageAll, getMessageLess, addRoom 皆為自訂監聽 message 類型
    //監聽透過 connection 傳進來的事件
    socket.on('getMessage', message => {
        //只回傳 message 給發送訊息的 Client
        socket.emit('getMessage', message)
    })

    socket.on('getMessageAll', message => {
        //回傳 message 給所有連結著的 client
        io.sockets.emit('getMessageAll', message)
    })

    socket.on('getMessageLess', message => {
        //回傳 message 給除了發送者外所有連結著的 client
        socket.broadcast.emit('getMessageLess', message)
    })

    socket.on('addRoom', room => {
        //加入前檢查是否已有所在房間
        const nowRoom = Object.keys(socket.rooms).find(room =>{
            return room !== socket.id
        })

        //有的話要先離開
        if(nowRoom){
            socket.leave(nowRoom)
        }

        //.join 為非同步,如確認要在 .join 執行完後做事,請以 callback function 的形式寫在第二參數 
        socket.join(room,()=>{console.log(`有人已加入${room}聊天室`, socket.rooms)})
        //(1)發送給在同一個 room 中除了自己外的 Client
        socket.to(room).emit('addRoom', `已有新人加入${room}聊天室！`)
        //(2)發送給在 room 中所有的 Client
        io.sockets.in(room).emit('addRoom', `已加入${room}聊天室！`)
    })

    socket.on('roomTalk', message => {
        const nowRoom = Object.keys(socket.rooms).find(room =>{
            return room !== socket.id
        })
        io.sockets.in(socket.rooms[nowRoom]).emit('roomTalk', message)
    })

    //送出中斷申請時先觸發此事件
    socket.on('disConnection', userId => {
        const room = Object.keys(socket.rooms).find(room => {
            return room !== socket.id
        })
        //先通知同一 room 的其他 Client
        socket.to(room).emit('leaveRoom', `${userId} 已離開聊天！`)
        //再送訊息讓 Client 做 .close()
        socket.emit('disConnection', '')
    })

    //中斷後觸發此監聽
    socket.on('disconnect', () => {
        console.log('disconnection')
    })
})