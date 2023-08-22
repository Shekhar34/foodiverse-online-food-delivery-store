const express =require('express')
const bodyparser=require('body-parser')
const mysql=require('mysql2')
const notifier=require('node-notifier')
const app=express();


app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: true }));

const connection=mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Foodieverse"
})

connection.connect(function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("connected");
    }
})

app.post('/signup',(req,res)=>{
  var first=req.body.fname;
  var last=req.body.lname;
  var username=req.body.username;
  var email=req.body.email;
  var num=req.body.number;
  var password=req.body.password;
  var sql=`insert into customer_details values("${first}","${last}","${username}","${num}","${email}","${password}")`;
  connection.query(sql,function(err,result){
      if(err){
        throw err;
      }
      else{
        console.log('insertion successfull');
        res.redirect("login.html");
      };
  })
});
app.post('/login',(req,res)=>{
    var Username =req.body.username;
    var passw=req.body.password;

    connection.query('SELECT * FROM customer_details WHERE User_name = ?', [Username], function(err, results) {
        if (err) throw err;
        else{
            const val1=results[0].User_name;
            const val2=results[0].password;

            if(Username.trim()==val1 && passw.trim()==val2){
                console.log("data found");
                res.redirect("index.html");
            }
            else{
               console.log('Data not found');
               res.redirect("login.html");
               notifier.notify({
                title: 'Error while login',
                message: 'please check your username or passwsord',
                icon: 'path/to/icon.png', // Path to your notification icon
                sound: true, // Play a sound when the notification is shown
                wait: true // Wait with callback until user action is taken on the notification
              });
            }
        }
    })
})

app.post('/cardpay',(req,res)=>{
    var name=req.body.name;
    var email=req.body.email;
    var address=req.body.address;
    var city=req.body.city;
    var state=req.body.state;
    var zipcode=req.body.zipcode;
    var cardno=req.body.cardno;
    var expmonth=req.body.expmonth
    var expyear=req.body.expyear;
    var cvv=req.body.cvv;  

    const que=`insert into card_order values("${name}","${email}","${address}","${city}","${state}","${zipcode}","${cardno}",
    "${expmonth}","${expyear}","${cvv}")`;
    connection.query(que,function(err,result){
if(err){
         console.log(err);
       } 
       else{
          console.log("Order payment done");
          res.redirect('Conformation.html');
       }
    })
})



app.listen(3000,function(err){ if(err){ throw err; } else{ console.log("running on port:3000"); }
})

