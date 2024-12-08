const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}

function getFiles(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(file => fs.statSync(path.join(srcpath, file)).isFile() && path.extname(file) === '.cast');
}

app.get('/', (req, res) => {
    const grabacionesPath = path.join(__dirname, 'grabaciones');
    const materias = getDirectories(grabacionesPath);
    const estructura = {};

    materias.forEach(materia => {
        const materiaPath = path.join(grabacionesPath, materia);
        const alumnos = getDirectories(materiaPath);
        estructura[materia] = {};

        alumnos.forEach(alumno => {
            const alumnoPath = path.join(materiaPath, alumno);
            const grabaciones = getFiles(alumnoPath);
            estructura[materia][alumno] = grabaciones;
        });
    });

    res.render('index', { estructura: JSON.stringify(estructura) });
});

app.get('/grabacion/:materia/:alumno/:grabacion', (req, res) => {
    const { materia, alumno, grabacion } = req.params;
    const grabacionPath = path.join(__dirname, 'grabaciones', materia, alumno, grabacion);
    
    if (fs.existsSync(grabacionPath)) {
        const stats = fs.statSync(grabacionPath);
        res.json({
            nombre: grabacion,
            tamaño: (stats.size / 1024).toFixed(2) + ' KB',
            fecha: stats.mtime.toLocaleDateString()
        });
    } else {
        res.status(404).json({ error: 'Grabación no encontrada' });
    }
});

app.get('/player/:materia/:alumno/:grabacion', (req, res) => {
    const { materia, alumno, grabacion } = req.params;
    const grabacionPath = `/grabaciones/${materia}/${alumno}/${grabacion}`;
    res.render('player', { materia, alumno, grabacion, grabacionPath });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
