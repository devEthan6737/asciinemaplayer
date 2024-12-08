document.addEventListener('DOMContentLoaded', () => {
    const materiaSelect = document.getElementById('materia');
    const alumnoSelect = document.getElementById('alumno');
    const grabacionSelect = document.getElementById('grabacion');
    const grabacionInfo = document.getElementById('grabacion-info');
    const playerContainer = document.getElementById('player-container');

    materiaSelect.addEventListener('change', async () => {
        const materia = materiaSelect.value;
        alumnoSelect.innerHTML = '<option value="">Selecciona un alumno</option>';
        grabacionSelect.innerHTML = '<option value="">Selecciona una grabación</option>';
        alumnoSelect.disabled = !materia;
        grabacionSelect.disabled = true;
        grabacionInfo.innerHTML = '';
        playerContainer.innerHTML = '';

        if (materia) {
            const alumnos = JSON.parse(materiaSelect.options[materiaSelect.selectedIndex].dataset.alumnos);
            alumnos.forEach(alumno => {
                const option = document.createElement('option');
                option.value = alumno;
                option.textContent = alumno;
                alumnoSelect.appendChild(option);
            });
        }
    });

    alumnoSelect.addEventListener('change', async () => {
        const materia = materiaSelect.value;
        const alumno = alumnoSelect.value;
        grabacionSelect.innerHTML = '<option value="">Selecciona una grabación</option>';
        grabacionSelect.disabled = !alumno;
        grabacionInfo.innerHTML = '';
        playerContainer.innerHTML = '';

        if (alumno) {
            const response = await fetch(`/grabaciones/${materia}/${alumno}`);
            const grabaciones = await response.json();
            grabaciones.forEach(grabacion => {
                const option = document.createElement('option');
                option.value = grabacion.nombre;
                option.textContent = grabacion.nombre;
                option.dataset.info = JSON.stringify(grabacion);
                grabacionSelect.appendChild(option);
            });
        }
    });

    grabacionSelect.addEventListener('change', () => {
        const grabacion = grabacionSelect.value;
        grabacionInfo.innerHTML = '';
        playerContainer.innerHTML = '';

        if (grabacion) {
            const info = JSON.parse(grabacionSelect.options[grabacionSelect.selectedIndex].dataset.info);
            grabacionInfo.innerHTML = `
                <p><strong>Nombre:</strong> ${info.nombre}</p>
                <p><strong>Tamaño:</strong> ${info.tamaño}</p>
                <p><strong>Fecha:</strong> ${info.fecha}</p>
            `;

            const materia = materiaSelect.value;
            const alumno = alumnoSelect.value;
            const playerFrame = document.createElement('iframe');
            playerFrame.src = `/player/${materia}/${alumno}/${grabacion}`;
            playerFrame.style.width = '100%';
            playerFrame.style.height = '400px';
            playerFrame.style.border = 'none';
            playerContainer.appendChild(playerFrame);
        }
    });
});
