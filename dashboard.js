// Charger les données du tableau de bord
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        // Charger les informations utilisateur
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    document.getElementById('user-name').textContent = `${userData.firstname} ${userData.lastname}`;
                    document.getElementById('user-parish').textContent = `Paroisse: ${userData.parish}`;
                }
            })
            .catch(error => {
                console.error('Erreur lors du chargement des données utilisateur:', error);
            });
        
        // Charger les prochains événements
        loadNextEvents();
        
        // Charger les dernières annonces
        loadLatestAnnouncements();
        
        // Charger le message du jour
        loadDailyMessage();
        
        // Charger les demandes de prière
        loadPrayerRequests();
    });
});

// Charger les prochains événements
function loadNextEvents() {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    db.collection('events')
        .where('date', '>=', today)
        .where('date', '<=', nextWeek)
        .orderBy('date')
        .limit(3)
        .get()
        .then(snapshot => {
            const eventsContainer = document.getElementById('next-events');
            eventsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                eventsContainer.innerHTML = '<p data-translate="no_events">Aucun événement à venir</p>';
                translatePage(currentLanguage);
                return;
            }
            
            snapshot.forEach(doc => {
                const event = doc.data();
                const eventElement = document.createElement('div');
                eventElement.className = 'event-item';
                
                const eventDate = event.date.toDate();
                const formattedDate = eventDate.toLocaleDateString();
                
                eventElement.innerHTML = `
                    <h5>${event.title}</h5>
                    <p>${formattedDate} - ${event.time}</p>
                    <p>${event.location}</p>
                `;
                
                eventsContainer.appendChild(eventElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des événements:', error);
        });
}

// Charger les dernières annonces
function loadLatestAnnouncements() {
    db.collection('announcements')
        .orderBy('date', 'desc')
        .limit(3)
        .get()
        .then(snapshot => {
            const announcementsContainer = document.getElementById('latest-announcements');
            announcementsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                announcementsContainer.innerHTML = '<p data-translate="no_announcements">Aucune annonce</p>';
                translatePage(currentLanguage);
                return;
            }
            
            snapshot.forEach(doc => {
                const announcement = doc.data();
                const announcementElement = document.createElement('div');
                announcementElement.className = 'announcement-item';
                
                const announcementDate = announcement.date.toDate();
                const formattedDate = announcementDate.toLocaleDateString();
                
                announcementElement.innerHTML = `
                    <h5>${announcement.title}</h5>
                    <p><small>${formattedDate}</small></p>
                    <p>${announcement.content.substring(0, 100)}...</p>
                `;
                
                announcementsContainer.appendChild(announcementElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des annonces:', error);
        });
}

// Charger le message du jour
function loadDailyMessage() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    db.collection('messages')
        .where('date', '==', today)
        .limit(1)
        .get()
        .then(snapshot => {
            const messageContainer = document.getElementById('daily-message');
            messageContainer.innerHTML = '';
            
            if (snapshot.empty) {
                messageContainer.innerHTML = '<p data-translate="no_message">Aucun message pour aujourd\'hui</p>';
                translatePage(currentLanguage);
                return;
            }
            
            snapshot.forEach(doc => {
                const message = doc.data();
                const messageElement = document.createElement('div');
                messageElement.className = 'message-item';
                
                messageElement.innerHTML = `
                    <h5>${message.title}</h5>
                    <p>${message.content.substring(0, 150)}...</p>
                `;
                
                messageContainer.appendChild(messageElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement du message du jour:', error);
        });
}

// Charger les demandes de prière
function loadPrayerRequests() {
    db.collection('prayers')
        .where('public', '==', true)
        .orderBy('date', 'desc')
        .limit(3)
        .get()
        .then(snapshot => {
            const prayersContainer = document.getElementById('prayer-requests');
            prayersContainer.innerHTML = '';
            
            if (snapshot.empty) {
                prayersContainer.innerHTML = '<p data-translate="no_prayers">Aucune demande de prière</p>';
                translatePage(currentLanguage);
                return;
            }
            
            snapshot.forEach(doc => {
                const prayer = doc.data();
                const prayerElement = document.createElement('div');
                prayerElement.className = 'prayer-item';
                
                const prayerDate = prayer.date.toDate();
                const formattedDate = prayerDate.toLocaleDateString();
                
                prayerElement.innerHTML = `
                    <h5>${prayer.title}</h5>
                    <p><small>${formattedDate}</small></p>
                    <p>${prayer.content.substring(0, 100)}...</p>
                `;
                
                prayersContainer.appendChild(prayerElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des demandes de prière:', error);
        });
}