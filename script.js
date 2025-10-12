// PEGA AQUÍ DENTRO LA URL QUE TE DIO JSONBIN.IO
const jsonBinUrl = 'https://api.jsonbin.io/v3/b/68eb7f41ae596e708f0f8a8a/latest'; 

// Esperamos a que todo el contenido de la página se haya cargado
document.addEventListener('DOMContentLoaded', () => {

  async function cargarPostulaciones() {
    const tbody = document.querySelector('#tabla tbody');
    tbody.innerHTML = ''; // Limpiamos la tabla por si acaso

    try {
      const response = await fetch(jsonBinUrl);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const jsonBinData = await response.json();
      // JSONBin envuelve tus datos en un objeto llamado "record"
      const datos = jsonBinData.record; 

      if (!datos || datos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No hay postulaciones para mostrar.</td></tr>`;
        return;
      }

      datos.forEach(p => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${p.posicion}</td>
          <td>${p.cv_url ? `<a href="${p.cv_url}" target="_blank">Ver CV</a>` : '-'}</td>
          <td>${p.pregunta_1 || '-'}</td>
          <td>${p.pregunta_2 || '-'}</td>
          <td>${p.pregunta_3 || '-'}</td>
          <td>${p.estado_revision}</td>
        `;
        tbody.appendChild(fila);
      });

    } catch (error) {
      console.error('Error al cargar datos:', error);
      tbody.innerHTML = `<tr><td colspan="6">No se pudieron cargar los datos. Revisa la consola para más detalles.</td></tr>`;
    }
  }

  // Llamamos a la función para que se ejecute cuando la página esté lista
  cargarPostulaciones();

});
