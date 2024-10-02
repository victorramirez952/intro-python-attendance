let passwordSetted;

function showPasswordPrompt() {
    var passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
    passwordModal.show();
}

function submitPassword() {
    password = document.getElementById('passwordInput').value;
    var passwordModal = bootstrap.Modal.getInstance(document.getElementById('passwordModal'));
    passwordModal.hide();
    if (password === passwordSetted) {
        exportJSON();
    } else {
        alert('Contraseña incorrecta');
    }
}

function exportJSON() {
    showSpinner();
    const table = document.querySelector("table");
    const rows = Array.from(table.querySelectorAll('tr')).slice(1); 
    const alumnos = rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        return {
            index: cells[0]?.innerText || '',
            matricula: cells[1]?.innerText || '',
            nombres: cells[2]?.innerText || '',
            asistencia: cells[3]?.querySelector('.btn-success') !== null,
            falta: cells[4]?.querySelector('.btn-success') !== null,
            faltaJustificada: cells[5]?.querySelector('.btn-success') !== null
        };
    }).filter(row => row !== null);

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    const data = {
        fecha: `${year}-${month}-${day}`, // Current date in YYYY-MM-DD format
        alumnos: alumnos
    };

    const json = JSON.stringify(data, null, 4);
    
    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: json
    })
    .then(response => {
        if (response.ok) {
            // If the response is OK, reload the page
            window.location.href = '/';
        } else {
            return response.json().then(data => {
                console.error('Error:', data);
            });
        }
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    // const blob = new Blob([json], {type: 'application/json'});
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'data.json';
    // a.click();
}

function toggleButton(button) {
    const row = button.parentElement.parentElement;
    const buttons = row.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.classList.remove('btn-success');
        btn.classList.add('btn-light');
    });
    button.classList.remove('btn-light');
    button.classList.add('btn-success');
}

function todosAsistencia() {
    const table = document.querySelector("table");
    const rows = Array.from(table.querySelectorAll('tr')).slice(1); 
    rows.forEach(row => {
        const buttons = row.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.classList.remove('btn-success');
            btn.classList.add('btn-light');
        });
        buttons[0].classList.remove('btn-light');
        buttons[0].classList.add('btn-success');
    });
}

function showSpinner() {
    var spinnerModal = new bootstrap.Modal(document.getElementById('spinnerModal'));
    spinnerModal.show();
}

function hideSpinner() {
    var spinnerModal = bootstrap.Modal.getInstance(document.getElementById('spinnerModal'));
    spinnerModal.hide();
}

// document.addEventListener('DOMContentLoaded', (event) => {
//     var spinnerModal = new bootstrap.Modal(document.getElementById('spinnerModal'));
//     spinnerModal.show();
// });

document.addEventListener('DOMContentLoaded', function() {
    fetch('/set-password-cookie', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        // console.log(data.password);
        passwordSetted = data.password;
    })
    .catch(error => console.error('Error setting cookie:', error));
});