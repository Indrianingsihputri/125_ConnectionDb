import express from 'express'
import pg from 'pg'
const app = express()
const port = 3000
const { Pool } = pg

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: '28070605',
    port: 5432,
})

app.get('/', (req, res, next) => {
    console.log("TEST DATA : ");
    pool.query('SELECT * FROM boidata')
    .then(testData  => {
        console.log(testData);
        res.send(testData.rows);
    })
    .chatch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    })
})

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})