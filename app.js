//declaramos una cariable para ocupar el framework express
const express = require("express")
const mysql= require("mysql2")
var bodyParser=require('body-parser')
var app=express()
var con=mysql.createConnection({
    host: process.env.DB_HOST,  // NO debe ser 'localhost'
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: true }
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
        if(nombre==""){
            return res.send(`
            <script>
                alert("Faltan datos");
                window.history.back(); // regresa a la página anterior
            </script>
            `);
        }else{
            con.query('INSERT INTO usuario (id, nombre) VALUES (?, ?)', [id, nombre], (err, respuesta, fields) => {
            if (err) {
                console.log("Error al conectar", err);
                //mandamos un mensaje de error al cliente 500 (error interno del servidor)
                return res.status(500).send("Error al conectar");
            }
            //concatenar una variable con el nombre del usuario
            return res.send(
                `<html>
                    <head>
                    <style>
                        body {
                            min-height: 100vh;
                            margin: 0;
                            padding: 40px 0;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            background: linear-gradient(135deg, #1f9bcf 0%, #4bbf73 100%);
                            color: #fff;
                            font-family: 'Nunito Sans', Arial, sans-serif;
                            font-size: 18px;
                            font-weight: 600;}
                            input[type="text"], input[type="submit"] {
                            margin: 8px 0;
                            padding: 10px;
                            border-radius: 6px;
                            border: none;
                            width: 100%;
                            box-sizing: border-box;
                        }
                        h1 {
                            color: #fff;
                            font-size: 30px;
                            text-align: center;
                        }
                    </style>
                    </head>
                    <body>
                    <h1>Nombre: ${nombre}</h1>
                    </body>
                </html>`
            );
        });
        }
        
})
//puerto de escucha del servidor
app.listen(3306,()=>{
    console.log('Servidor escuchando en el puerto 3306')
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
            userHTML+= `
                    <html>
                    <head>
                    <style>
                        body {
                            min-height: 100vh;
                            margin: 0;
                            padding: 40px 0;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            background: linear-gradient(135deg, #1f9bcf 0%, #4bbf73 100%);
                            color: #fff;
                            font-family: 'Nunito Sans', Arial, sans-serif;
                            font-size: 18px;
                            font-weight: 600;}
                            input[type="text"], input[type="submit"] {
                            margin: 8px 0;
                            padding: 10px;
                            border-radius: 6px;
                            border: none;
                            width: 100%;
                            box-sizing: border-box;
                        }
                        tr {
                            background: linear-gradient(135deg, #1f9bcf 0%, #4bbf73 100%);
                            color: white;
                        }

                        td {
                            padding: 10px 15px;
                            border: 1px solid #e0e0e0;
                            color: white;
                            font-family: Arial, sans-serif;
                            font-size: 14px;
                        }
                    </style>
                    </head>
                    <body>
                    <tr><td>${user.id}</td><td>${user.nombre}</td></tr>
                    </body>
                </html>
            `;
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
    if(id=="" || isNaN(id)){
        return res.send(`
            <script>
                alert("Faltan datos");
                window.history.back(); // regresa a la página anterior
            </script>
        `);
    }else{
        con.query('DELETE FROM usuario WHERE id = ?', [id], (err, resultado, fields) => {

        if (err) {
            console.error('Error al borrar el usuario:', err);
            return res.status(500).send("Error al borrar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`
            <html>
                    <head>
                    <style>
                        body {
                            min-height: 100vh;
                            margin: 0;
                            padding: 40px 0;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            background: linear-gradient(135deg, #1f9bcf 0%, #4bbf73 100%);
                            color: #fff;
                            font-family: 'Nunito Sans', Arial, sans-serif;
                            font-size: 18px;
                            font-weight: 600;}
                            input[type="text"], input[type="submit"] {
                            margin: 8px 0;
                            padding: 10px;
                            border-radius: 6px;
                            border: none;
                            width: 100%;
                            box-sizing: border-box;
                        }
                        h1 {
                            color: red;
                            font-size: 30px;
                            text-align: center;
                        }
                    </style>
                    </head>
                    <body>
                    <h1>Usuario con ID ${id} borrado correctamente</h1>
                    </body>
                </html>`);
        });
    }
    
});

app.post('/actualizarUsuario', (req, res) => {
    const id = req.body.id; 
    const nuevoNombre = req.body.nombre; 

    if(nuevoNombre=="" || isNaN(id)){
        return res.send(`
            <script>
                alert("Faltan datos");
                window.history.back(); // regresa a la página anterior
            </script>
        `);
    }else{
    con.query('UPDATE usuario SET nombre = ? WHERE id = ?', [nuevoNombre, id], (err, resultado, fields) => {
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            return res.status(500).send("Error al actualizar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`
                <html>
                    <head>
                    <style>
                        body {
                            min-height: 100vh;
                            margin: 0;
                            padding: 40px 0;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            background: linear-gradient(135deg, #1f9bcf 0%, #4bbf73 100%);
                            color: #fff;
                            font-family: 'Nunito Sans', Arial, sans-serif;
                            font-size: 18px;
                            font-weight: 600;}
                            input[type="text"], input[type="submit"] {
                            margin: 8px 0;
                            padding: 10px;
                            border-radius: 6px;
                            border: none;
                            width: 100%;
                            box-sizing: border-box;
                        }
                        h1 {
                            color: #fff;
                            font-size: 30px;
                            text-align: center;
                        }
                    </style>
                    </head>
                    <body>
                    <h1>Usuario con ID ${id} actualizado correctamente</h1>
                    </body>
                </html>`);
    });
    }
});


