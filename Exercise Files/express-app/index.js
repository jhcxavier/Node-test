import express from 'express';
import data from '../data/data.json';

const app = express();
const PORT = 3000;

//this is for public folder on path /
app.use(express.static('public'));

//this is for images folder on path images
app.use('/images', express.static('images'));

app.get('/', (req, res) =>
    //get data first
    res.json(data)
);


app.get('/item/:id', (req, res, next) =>{
    console.log('first',req.params.id);
    let user = Number(req.params.id);
    console.log(user);
    console.log(data[user]);
    res.send(data[user]);
    next();
}, (req, res) =>
    console.log('Did you get the right data?')
);


app.route('/item')
    .get((req, res) =>{
        //res.download('images/rocket.jpg')
        //res.redirect('http://www.linkedin.com')
        //res.end()
        res.send(`a get request with /item Route on port ${PORT}`)
    })
    .put((req, res) =>
        res.send(`a put request with /newItem Route on port ${PORT}`)
    )
    .delete((req, res) =>
        res.send(`a delete request with /item Route on port ${PORT}`)
);



app.listen(PORT, () => {
    console.log(`Your server is running on port ${PORT}`);
    console.log(data);
});

