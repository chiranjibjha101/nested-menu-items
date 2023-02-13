
const express=require('express');
const sql=require('mysql');
const app=express();
app.use(express.urlencoded({extended:true}));
const port=5000;

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/menu-view',(req,res) =>{
    res.sendFile('page1.html',{root:__dirname});

});
app.get('/menu-admin',(req,res)=>{
    res.sendFile('page2.html',{root:__dirname});
});

///post  data 
app.post('/add-item',(req,res)=>{
    const itemName=req.body.itemName;
    const parentId=req.body.parentId;
    const query = `INSERT INTO menuItems (ItemName, ParentId) VALUES ('${itemName}', ${parentId});`;

    const con=sql.createConnection({
        user : 'root',
        port:3306,
        password : 'new_password',
        host : '127.0.0.1',
        database: 'nestedmenu',

    });
    con.connect(err =>{
        if(err) console.log(err);
        con.query(query,(err,result)=>{
            if(err) console.log(err);
            res.send('Item added');
            con.destroy();
        });
    });

});

app.get('/menu-items',(req,res)=>{
    const query=`
    WITH RECURSIVE MenuCTE AS
    (
        SELECT ItemId,ItemName,ParentId,0 AS Level
        FROM menuitems
        WHERE ParentId IS NULL
        UNION ALL
        SELECT m.ItemId,m.ItemName,m.ParentId,Level+1
        FROM menuitems m 
        JOIN MenuCTE cte ON m.ParentId=cte.ItemId
    )
    SELECT ItemId,ItemName,ParentId,Level
    FROM MenuCTE 
    ORDER BY Level,ItemId;`;
    const con=sql.createConnection({
        user : 'root',
        port:3306,
        password : 'new_password',
        host : 'localhost',
        database: 'nestedmenu',

    });
    con.connect(err =>{
        if(err) console.log(err);
        con.query(query,(err,result)=>{
            if(err) console.log(err);
            res.send(result);
            con.destroy();
        });
    });


});



app.listen(port,() =>{
    console.log('page running');
})