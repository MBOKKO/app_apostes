// Funció per guardar una aposta
document.getElementById('formulariApostes').addEventListener('submit', function(e) {
    e.preventDefault();

    const importAposta = parseFloat(document.getElementById('import').value);
    const quota = parseFloat(document.getElementById('quota').value);
    const esport = document.getElementById('esport').value;
    const resultat = document.getElementById('resultat').value;

    // Càlcul del guany o pèrdua
    const guany = resultat === 'guanyat' ? importAposta * (quota - 1) : -importAposta;

    // Crear l'objecte aposta
    const aposta = { importAposta, quota, esport, resultat, guany };

    // Guardar en Local Storage
    let apostes = JSON.parse(localStorage.getItem('apostes')) || [];
    apostes.push(aposta);
    localStorage.setItem('apostes', JSON.stringify(apostes));

    alert('Aposta guardada!');
    mostrarApostes();
    mostrarGràfic();
    actualitzarBalançTotal();
});

// Funció per mostrar les apostes guardades
function mostrarApostes() {
    const apostes = JSON.parse(localStorage.getItem('apostes')) || [];
    const taula = document.getElementById('historialApostes');
    taula.innerHTML = apostes.map((a, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${a.importAposta} €</td>
            <td>${a.quota}</td>
            <td>${a.esport}</td>
            <td>${a.resultat}</td>
            <td>${a.guany.toFixed(2)} €</td>
            <td><button class="eliminar" data-index="${index}">Eliminar</button></td>
        </tr>
    `).join('');

    document.querySelectorAll('.eliminar').forEach(boto => {
        boto.addEventListener('click', eliminarAposta);
    });
}

// Funció per eliminar una aposta
function eliminarAposta(e) {
    const index = parseInt(e.target.getAttribute('data-index'), 10);
    let apostes = JSON.parse(localStorage.getItem('apostes')) || [];

    apostes.splice(index, 1);
    localStorage.setItem('apostes', JSON.stringify(apostes));

    mostrarApostes();
    mostrarGràfic();
    actualitzarBalançTotal();
}

// Funció per mostrar el gràfic
function mostrarGràfic() {
    const apostes = JSON.parse(localStorage.getItem('apostes')) || [];
    const balanços = apostes.map((_, i) => 
        apostes.slice(0, i + 1).reduce((acc, aposta) => acc + aposta.guany, 0)
    );

    const ctx = document.getElementById('graficaBalanç').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: apostes.map((_, i) => `Aposta ${i + 1}`),
            datasets: [{
                label: 'Balanç acumulat',
                data: balanços,
                borderColor: 'blue',
                fill: false,
            }]
        }
    });
}

// Funció per actualitzar el balanç total
function actualitzarBalançTotal() {
    const apostes = JSON.parse(localStorage.getItem('apostes')) || [];
    const balançTotal = apostes.reduce((acc, aposta) => acc + aposta.guany, 0);

    const balançElement = document.getElementById('balançTotal');
    balançElement.textContent = `${balançTotal.toFixed(2)} €`;

    if (balançTotal > 0) {
        balançElement.style.color = 'green';
    } else if (balançTotal < 0) {
        balançElement.style.color = 'red';
    } else {
        balançElement.style.color = '#333';
    }
}

// Inicialitzar
mostrarApostes();
mostrarGràfic();
actualitzarBalançTotal();
