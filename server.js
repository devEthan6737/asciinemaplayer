const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    const materias = ['SIOPR', 'SEGIN'];
    const alumnos = {};

    materias.forEach(materia => {
        const materiaPath = path.join(__dirname, 'grabaciones', materia);
        alumnos[materia] = fs.readdirSync(materiaPath).filter(file => fs.statSync(path.join(materiaPath, file)).isDirectory());
    });

    res.render('index', { materias, alumnos });
});

app.get('/grabaciones/:materia/:alumno', (req, res) => {
    const { materia, alumno } = req.params;
    const alumnoPath = path.join(__dirname, 'grabaciones', materia, alumno);
    const grabaciones = fs.readdirSync(alumnoPath).filter(file => path.extname(file) === '.cast');

    const grabacionesInfo = grabaciones.map(grabacion => {
        const filePath = path.join(alumnoPath, grabacion);
        const stats = fs.statSync(filePath);
        return {
            nombre: grabacion,
            tamaño: (stats.size / 1024).toFixed(2) + ' KB',
            fecha: stats.mtime.toLocaleDateString()
        };
    });

    res.json(grabacionesInfo);
});

app.get('/player/:materia/:alumno/:grabacion', (req, res) => {
    const { materia, alumno, grabacion } = req.params;
    const grabacionPath = path.join(__dirname, 'grabaciones', materia, alumno, grabacion);
    res.render('player', { materia, alumno, grabacion, grabacionPath });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
