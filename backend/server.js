const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"surendra@123",
  database:"insta_clone"
});

/* USERS */
app.post("/createUser",(req,res)=>{
  db.query("INSERT INTO users(name) VALUES (?)",[req.body.name],()=>res.send("ok"));
});

app.get("/users",(req,res)=>{
  db.query("SELECT * FROM users",(e,r)=>res.json(r));
});

/* POSTS */
app.get("/posts",(req,res)=>{
  let name=req.query.name;
  let sql="SELECT * FROM posts";
  let params=[];

  if(name){
    sql+=" WHERE user_name=?";
    params.push(name);
  }

  sql+=" ORDER BY id DESC";

  db.query(sql,params,(e,r)=>res.json(r));
});

app.post("/addPost",(req,res)=>{
  let {user_name,title,description,content}=req.body;

  db.query(
    "INSERT INTO posts(user_name,title,description,content) VALUES (?,?,?,?)",
    [user_name,title,description,content],
    ()=>res.send("ok")
  );
});

/* COMMENTS */
app.post("/comment",(req,res)=>{
  let {post_id,user,comment}=req.body;

  db.query(
    "INSERT INTO comments(post_id,user,comment) VALUES (?,?,?)",
    [post_id,user,comment],
    ()=>res.send("ok")
  );
});

app.get("/comments/:id",(req,res)=>{
  db.query(
    "SELECT * FROM comments WHERE post_id=? ORDER BY id DESC",
    [req.params.id],
    (e,r)=>res.json(r)
  );
});

/* WRITERS */
app.get("/writers",(req,res)=>{
  db.query(`
    SELECT user_name, COUNT(*) as total_posts
    FROM posts
    GROUP BY user_name
  `,(e,r)=>res.json(r));
});

app.listen(3000,()=>console.log("Server Running 🚀"));