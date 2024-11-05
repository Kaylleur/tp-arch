const timeElement = document.getElementById('time');

const eventSource = new EventSource('/time');

eventSource.onmessage = (event) => {
    timeElement.textContent = event.data;
};

eventSource.onerror = (err) => {
    console.error('Erreur lors de la connexion au flux SSE:', err);
};
