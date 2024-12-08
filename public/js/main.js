document.addEventListener('DOMContentLoaded', () => {
    const materiaSelect = document.getElementById('materia');
    const alumnoSelect = document.getElementById('alumno');
    const grabacionSelect = document.getElementById('grabacion');
    const grabacionInfo = document.getElementById('grabacion-info');
    const playerContainer = document.getElementById('player-container');

    // Poblar el select de materias
    Object.keys(estructura).forEach(materia => {
        const option = document.createElement('option');
        option.value = materia;
        option.textContent = materia;
        materiaSelect.appendChild(option);
    });

    materiaSelect.addEventListener('change', () => {
        const materia = materiaSelect.value;
        alumnoSelect.innerHTML = '<option value="">Selecciona un alumno</option>';
        grabacionSelect.innerHTML = '<option value="">Selecciona una grabación</option>';
        grabacionInfo.innerHTML = '';
        playerContainer.innerHTML = '';

        if (materia) {
            Object.keys(estructura[materia]).forEach(alumno => {
                const option = document.createElement('option');
                option.value = alumno;
                option.textContent = alumno;
                alumnoSelect.appendChild(option);
            });
        }
    });

    alumnoSelect.addEventListener('change', () => {
        const materia = materiaSelect.value;
        const alumno = alumnoSelect.value;
        grabacionSelect.innerHTML = '<option value="">Selecciona una grabación</option>';
        grabacionInfo.innerHTML = '';
        playerContainer.innerHTML = '';

        if (alumno) {
            estructura[materia][alumno].forEach(grabacion => {
                const option = document.createElement('option');
                option.value = grabacion;
                option.textContent = grabacion;
                grabacionSelect.appendChild(option);
            });
        }
    });

    grabacionSelect.addEventListener('change', async () => {
        const materia = materiaSelect.value;
        const alumno = alumnoSelect.value;
        const grabacion = grabacionSelect.value;

        if (grabacion) {
            await cargarInformacionGrabacion(materia, alumno, grabacion);
            cargarReproductor(materia, alumno, grabacion);
        } else {
            grabacionInfo.innerHTML = '';
            playerContainer.innerHTML = '';
        }
    });

    async function cargarInformacionGrabacion(materia, alumno, grabacion) {
        try {
            const response = await fetch(`/grabacion/${materia}/${alumno}/${grabacion}`);
            if (!response.ok) {
                throw new Error('No se pudo cargar la información de la grabación');
            }
            const info = await response.json();
            grabacionInfo.innerHTML = `
                <p><strong>Nombre:</strong> ${info.nombre}</p>
                <p><strong>Tamaño:</strong> ${info.tamaño}</p>
                <p><strong>Fecha:</strong> ${info.fecha}</p>
            `;
        } catch (error) {
            console.error('Error al cargar la información de la grabación:', error);
            grabacionInfo.innerHTML = '<p class="error">Error al cargar la información de la grabación</p>';
        }
    }

    function cargarReproductor(materia, alumno, grabacion) {
        playerContainer.innerHTML = '';
        const playerFrame = document.createElement('iframe');
        playerFrame.src = `/player/${materia}/${alumno}/${grabacion}`;
        playerFrame.style.width = '100%';
        playerFrame.style.height = '400px';
        playerFrame.style.border = 'none';
        playerContainer.appendChild(playerFrame);
    }
});
