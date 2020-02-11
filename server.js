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