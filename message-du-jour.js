// Charger le message du jour
document.addEventListener('DOMContentLoaded', function() {
    loadTodaysMessage();
    loadPreviousMessages();
});

// Charger le message d'aujourd'hui
function loadTodaysMessage() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Mettre à jour le sélecteur de date
    document.getElementById('message-date').valueAsDate = today;
    
    loadMessageByDate(today);
}

// Charger le message par date
function loadMessageByDate(date) {
    const selectedDate = date || new Date(document.getElementById('message-date').value);
    selectedDate.setHours(0, 0, 0, 0);
    
    db.collection('messages')
        .where('date', '==', selectedDate)
        .limit(1)
        .get()
        .then(snapshot => {
            const messageContainer = document.getElementById('message-container');
            messageContainer.innerHTML = '';
            
            if (snapshot.empty) {
                messageContainer.innerHTML = '<p data-translate="no_message">Aucun message pour cette date</p>';
                translatePage(currentLanguage);
                return;
            }
            
            snapshot.forEach(doc => {
                const message = doc.data();
                const messageElement = document.createElement('div');
                messageElement.className = 'daily-message';
                
                const messageDate = message.date.toDate();
                const formattedDate = messageDate.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                messageElement.innerHTML = `
                    <h3>${message.title}</h3>
                    <p class="message-date">${formattedDate}</p>
                    <div class="message-content">${message.content}</div>
                    ${message.bibleVerse ? `<p class="bible-verse">${message.bibleVerse}</p>` : ''}
                    ${message.imageUrl ? `<img src="${message.imageUrl}" alt="${message.title}" class="message-image">` : ''}
                `;
                
                messageContainer.appendChild(messageElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement du message:', error);
        });
}

// Charger les messages précédents
function loadPreviousMessages() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    db.collection('messages')
        .where('date', '<', today)
        .orderBy('date', 'desc')
        .limit(10)
        .get()
        .then(snapshot => {
            const previousMessagesList = document.getElementById('previous-messages-list');
            previousMessagesList.innerHTML = '';
            
            if (snapshot.empty) {
                previousMessagesList.innerHTML = '<p data-translate="no_previous_messages">Aucun message précédent</p>';
                translatePage(currentLanguage);
                return;
            }
            
            snapshot.forEach(doc => {
                const message = doc.data();
                const messageElement = document.createElement('div');
                messageElement.className = 'previous-message-item';
                
                const messageDate = message.date.toDate();
                const formattedDate = messageDate.toLocaleDateString();
                
                messageElement.innerHTML = `
                    <h4>${message.title}</h4>
                    <p><small>${formattedDate}</small></p>
                    <p>${message.content.substring(0, 100)}...</p>
                    <button class="btn btn-small" onclick="loadMessageByDate(new Date('${messageDate.toISOString()}'))" data-translate="read">Lire</button>
                `;
                
                previousMessagesList.appendChild(messageElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des messages précédents:', error);
        });
}