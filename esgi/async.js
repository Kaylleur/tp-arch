const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send({message: 'ok ça arrive'});
    setTimeout(() => {
        console.log('Long traitement')
        io.emit('fin detache', {idFinDetache:1})
    }, 10000);
});


app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});

