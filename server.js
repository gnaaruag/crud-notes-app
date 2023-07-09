const Note = require('./models/Note.js');
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const connectDB = require('./database/db.js')
connectDB();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//API section


app.get('/', (req,res) => 
{
    res.sendFile(__dirname + '/public/main.html');
});

app.get('/create', (req,res) => 
{
    res.sendFile(__dirname + '/public/create.html');
});

app.post('/create', (req,res) => 
{
    console.log(`title:${req.body.title}\ncontent: ${req.body.content}`);
    Note.create(req.body)
    .then(note => res.sendFile(__dirname + '/public/notecreated.html'))
    .catch(err => res.status(400).json({error:'cant add note'}));
    // res.sendFile(__dirname + '/public/notecreated.html')
});

app.get('/read', (req,res) => 
{
    Note.find({})
    .then(foundItems => 
        {
            
            const html = generateHTMLForReadPage(foundItems);
            res.send(html);

        })
        .catch(err => 
            {
                console.log(err);
            })

    // res.render(__dirname + '/public/read.html');
});

app.post('/delete/:id', async (req,res) => 
{
    await Note.deleteOne({_id: req.params.id});
    return res.redirect('/read');

});

app.get('/update/:id', async (req,res) =>
{
    await Note.findById({_id: req.params.id})
    .then((ele => {
        const html = generateHTMLForUpdatePage(ele);
        res.send(html);
    }
    ));
});

app.post('/update/submit/:id', async (req,res) => 
{
    const {title, content,} = req.body;
    const lastEditedAt = Date.now();
    const createdOn = Date.now();
    console.log(req.params.id)
    console.log(req.body.title);
    console.log(req.body.content);
    await Note.findByIdAndUpdate(req.params.id,{title, content, createdOn, lastEditedAt});
    return res.redirect('/read');
});

function generateHTMLForReadPage(data) {
    let html = '<!DOCTYPE html>';
    html += '<html>';
    html += '<head>';
    html += '<title>Notes</title>';
    html += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">'
    html += '<style> body { display: flex; flex-direction: column; justify-content: center; align-items: center;} .note { padding: 1em 0 } .UD { display: flex; }</style> ';
    html += '</head>';
    html += '<body>';
    html += '<h1 class="text=center">Notes</h1>';
    html += '<a href="/"><button class="btn btn-primary">home</button></a>';
    
    if (data.listen === 0) {
        html += '<p class="text=center>No notes found.</p>';
    }
    else {
        
        html += '<div class="container">';
        data.forEach((item) => {
            html += `<div div class="container note"><h3>${item.title}</h3>`;
            html += `<form action = "/update/${item.id}" method="get"><button class="btn btn-primary">Update</button></form><form action = "/delete/${item.id}" method="post"><button class="btn btn-danger">Delete</button></form></div>`
            html += `<p>date created: ${item.createdOn}    last updated: ${item.lastEditedAt} </p>`;
            html += `<p> ${item.content} </p></div>`;
        });
        html += '</div>';
    }
    html += '</body>';
    html += '</html>';

    
    return html;
}

/*<form action="/create" method="post">
      <div class="form-group">
        <input type="text" name="title" class="form-control" placeholder="Input field">
      </div>
      <div class="form-group">
        <textarea class="form-control" name="content" placeholder="Textarea"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>*/ 

function generateHTMLForUpdatePage(data) {

    
    let html = '<!DOCTYPE html>';
    html += '<html>';
    html += '<head>';
    html += '<title>Notes</title>';
    html += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">'
    html += '<style> body { display: flex; flex-direction: column; justify-content: center; align-items: center;} .note { padding: 1em 0 } .UD { display: flex; }</style> ';
    html += '</head>';
    html += '<body>';
    html += `<h1 class="text=center">Update Note: ${data.title}</h1>`;
    html += `<form action="/update/submit/${data.id}" method="post">`;
    html += `<div class="form-group">`;
    html += `<input type="text" name="title" class="form-control" value="${data.title}" placeholder="Input field"></div>`;
    html += `<div class="form-group">`;
    html += `<textarea class="form-control" name="content" "placeholder="Textarea">${data.content}</textarea></div>`;
    html += `<button type="submit" class="btn btn-primary">Submit</button></form>`;
    html += '</body>';
    html += '</html>';

    
    return html

}

app.listen(3000, () =>
{
    console.log('running at 3000');
});

