// Charger les événements du programme
document.addEventListener('DOMContentLoaded', function() {
    loadEvents('week');
    
    // Ajouter les écouteurs d'événements pour les filtres
    document.querySelectorAll('.calendar-filters button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.calendar-filters button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            const period = this.getAttribute('data-period');
            loadEvents(period);
        });
    });
});

// Charger les événements selon la période
function loadEvents(period) {
    const today = new Date();
    let endDate;
    
    if (period === 'week') {
        endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
        // Pour le mois, on ajoute environ 30 jours
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    }
    
    db.collection('events')
        .where('date', '>=', today)
        .where('date', '<=', endDate)
        .orderBy('date')
        .get()
        .then(snapshot => {
            const eventsList = document.getElementById('events-list');
            eventsList.innerHTML = '';
            
            if (snapshot.empty) {
                eventsList.innerHTML = '<p data-translate="no_events">Aucun événement à venir</p>';
                translatePage(currentLanguage);
                return;
            }
            
            let currentDate = null;
            
            snapshot.forEach(doc => {
                const event = doc.data();
                const eventDate = event.date.toDate();
                const formattedDate = eventDate.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                // Ajouter un en-tête de date si nécessaire
                if (!currentDate || currentDate !== formattedDate) {
                    currentDate = formattedDate;
                    const dateHeader = document.createElement('h3');
                    dateHeader.textContent = formattedDate;
                    eventsList.appendChild(dateHeader);
                }
                
                const eventElement = document.createElement('div');
                eventElement.className = 'event-item';
                
                eventElement.innerHTML = `
                    <div class="event-time">${event.time}</div>
                    <div class="event-details">
                        <h4>${event.title}</h4>
                        <p>${event.location}</p>
                        <p>${event.description}</p>
                    </div>
                    <div class="event-actions">
                        <button class="btn btn-small" onclick="registerForEvent('${doc.id}')" data-translate="register">S'inscrire</button>
                    </div>
                `;
                
                eventsList.appendChild(eventElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des événements:', error);
        });
}

// S'inscrire à un événement
function registerForEvent(eventId) {
    auth.onAuthStateChanged(user => {
        if (!user) {
            alert('Veuillez vous connecter pour vous inscrire à un événement');
            window.location.href = 'login.html';
            return;
        }
        
        db.collection('event_registrations').add({
            eventId: eventId,
            userId: user.uid,
            registrationDate: new Date(),
            status: 'confirmed'
        })
        .then(() => {
            alert('Inscription réussie!');
        })
        .catch(error => {
            console.error('Erreur lors de l\'inscription:', error);
            alert('Erreur lors de l\'inscription: ' + error.message);
        });
    });
}