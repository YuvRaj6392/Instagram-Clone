//we initialized express which is a nodejs framework to help manage server and routes
const express=require('express');
const db=require('./models/index')
const bodyParser=require('body-parser');
const cors=require('cors');
const app=express();
const PORT= process.env.PORT || 8080;
var corsOption={
  origin:"http://localhost:3000"
};
app.use(cors(corsOption));
db.mongoose.connect(db.url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(()=>{
    console.log('connected to mongodb')
  }).catch((ex)=>{
    console.log(ex)
    console.log('Failed to connect to the database')
    process.exit()
    //By calling process.exit(), the Node.js process is terminated, and the application will stop running. This is a common approach to handle critical errors that cannot be recovered from, ensuring that the application does not continue to run in an undefined state.
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

require('./routes/user.route')(app);
require('./routes/post.route')(app);
require('./routes/showUserProfile.route')(app);
app.listen(PORT,()=>{
    console.log(`The server is listening at PORT ${PORT}`)
})