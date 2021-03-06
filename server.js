const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const ip = 'localhost'
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

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//建立DB數據模板
const testDb = mongoose.model('user1',mongoose.Schema({name:String,point:Number}));
//監聽80窗口
app.listen(port,ip, ()=>{console.log('SERVER created');})
//對所有請求解析其body
app.use(bodyParser.json())

//增加 mongoDB 內的 document
app.post('/api/post', async (req,res) =>{
    const newData = new testDb({
        name:req.body.name,
        point:req.body.point,
    });
    const savedInfo = await newData.save();
    res.json(savedInfo)
})
// 刪除指定name
app.delete('/api/delete/:name', async (req, res) =>{
    await testDb.deleteOne({name:req.params.name})
    res.send(`name:${req.params.name} is deleted`)
})
//刪除全部
app.delete('/api/delete/all', async (req, res) =>{
    await testDb.remove({})
    res.send(`name:${req.params.name} is deleted`)
})
//查詢全部name
app.get('/api/get/all', async (req,res) =>{
    const data = await testDb.find()
    res.json(data)
})
//查詢單一name
app.get('/api/get/:name', async (req,res) =>{
    const data = await testDb.find({name:req.params.name})
    res.json(data)
})