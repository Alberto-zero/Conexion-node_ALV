//declaramos una cariable para ocupar el framework express
const express = require("express")
const mysql= require("mysql2")
var bodyParser=require('body-parser')
var app=express()
var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'n0m3l0',
    database:'5IV8'
})
con.connect();
//crud create, read, update, delete
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}))
//en public esta todo el front
app.use(express.static('public'))

//crud para agregar un usuario      
app.post('/agregarUsuario',(req,res)=>{
        let nombre=req.body.nombre
        let id=req.body.id

        con.query('INSERT INTO usuario (id, nombre) VALUES (?, ?)', [id, nombre], (err, respuesta, fields) => {
            if (err) {
                console.log("Error al conectar", err);
                //mandamos un mensaje de error al cliente 500 (error interno del servidor)
                return res.status(500).send("Error al conectar");
            }
            //concatenar una variable con el nombre del usuario
            return res.send(`<h1>Nombre:</h1> ${nombre}`);
        });
})
//puerto de escucha del servidor
app.listen(5500,()=>{
    console.log('Servidor escuchando en el puerto 5500')
})

//funcion consultar               abajo funcion flecha  
app.get('/obtenerUsuario',(req,res)=>{
    con.query('select * from usuario', (err,respuesta, fields)=>{
        if(err)return console.log('ERROR: ', err);
        var userHTML=``;
        var i=0;

        respuesta.forEach(user => {
            i++;
            //*= es un operacion de iteracion = x=x+5 o que es lo mismo x+=5
            userHTML+= `<tr><td>${i}</td><td>${user.nombre}</td></tr>`;
        });

        return res.send(`<table>
                <tr>
                    <th>id</th>
                    <th>Nombre:</th>
                <tr>
                ${userHTML}
                </table>`
        );


    });
});

app.post('/borrarUsuario', (req, res) => {
    const id = req.body.id; // El ID del usuario a eliminar viene en el cuerpo de la solicitud
    console.log("hola")
    con.query('DELETE FROM usuario WHERE id = ?', [id], (err, resultado, fields) => {

        if (err) {
            console.error('Error al borrar el usuario:', err);
            return res.status(500).send("Error al borrar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con ID ${id} borrado correctamente`);
    });
});

app.post('/actualizarUsuario', (req, res) => {
    const id = req.body.id; // El ID del usuario a actualizar viene en el cuerpo de la solicitud
    const nuevoNombre = req.body.nombre; // El nuevo nombre del usuario viene en el cuerpo de la solicitud

    con.query('UPDATE usuario SET nombre = ? WHERE id = ?', [nuevoNombre, id], (err, resultado, fields) => {
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            return res.status(500).send("Error al actualizar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con ID ${id} actualizado correctamente`);
    });
});


