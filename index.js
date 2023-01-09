/*Módulos externos*/

    const express = require('express')
    const exphbs = require('express-handlebars')

    /*Conexão do banco de dados*/
    const pool = require('./db/conn')

/*Constante para chamar o express*/

    const app = express()

/*Leitura dos dados do body*/

    app.use(
        express.urlencoded({
            extended: true,
        })
    )

/*Transformar os dados em Json*/

    app.use(express.json())

/*Configuração da pasta de partials*/

    const hbs = exphbs.create({
        partialsDir: ['views/partials']
    })

/*Setup do handlebars e view engine*/

    app.engine('handlebars', hbs.engine)
    app.set('view engine', 'handlebars')

/*Setup da pasta estática public, para armazenar CSS, JS e imagens*/

    app.use(express.static('public'))

/*Rotas*/

    app.get('/', (req, res) => {
        res.render('home')
    })

/*Adicionar um livro*/

    app.post('/books/insertbook', (req, res) => {
        const title = req.body.title
        const pageqty = req.body.pageqty
        const sql = `INSERT INTO books (??, ??) VALUES (?,?)`
        const data = ['title', 'pageqty', title, pageqty]
        pool.query(sql, data, function(err){
            if(err){
                console.log(err)
                return
            }
            res.redirect('/books')
        })
    })

/*Listar todos livros*/

    app.get('/books', (req, res) => {
        const sql = `SELECT * FROM books`
        pool.query(sql, function(err, data){
            if(err){
                console.log(err)
                return
            }
            const books = data
            res.render('books', {books})
        })
    })

/*Consultar dados de um livro*/

    app.get('/books/:id', (req, res) => {
        const id = req.params.id
        const sql = `SELECT * FROM books WHERE ?? = ?`
        const data = ['id', id]
        pool.query(sql, data, function(err, data){
            if(err){
                console.log(err)
                return
            }
            const book = data[0]
            res.render('book', {book})
        })
    })

/*Atualizar dados do livro*/

    app.get('/books/edit/:id', (req, res) => {
        const id = req.params.id
        const sql = `SELECT * FROM books WHERE ?? = ?`
        const data = ['id', id]
        pool.query(sql, data, function(err, data){
            if(err){
                console.log(err)
                return
            }
            const book = data[0]
            res.render('edit-book', {book})
        })
    })

    app.post('/books/update-book', (req, res) => {
        const id = req.body.id
        const title = req.body.title
        const pageqty = req.body.pageqty
        const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
        const data = ['title', title, 'pageqty', pageqty, 'id', id]
        pool.query(sql, data, function(err, data){
            if(err){
                console.log(err)
                return
            }
            res.redirect('/books')
        })
    })

/*Deletar livro*/

    app.post('/books/remove/:id', (req, res) => {
        const id = req.params.id
        const sql = `DELETE FROM books WHERE ?? = ?`
        const data = ['id', id]
        pool.query(sql, data, function(err){
            if(err){
                console.log(err)
                return
            }
            res.redirect('/books')
        })
    })

/*Porta do servidor*/
    app.listen(3000)