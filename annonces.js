// Charger les annonces
document.addEventListener('DOMContentLoaded', function() {
    loadAnnouncements();
});

// Charger toutes les annonces
function loadAnnouncements() {
    db.collection('announcements')
        .orderBy('date', 'desc')
        .get()
        .then(snapshot => {
            const announcementsContainer = document.getElementById('announcements-container');
            announcementsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                announcementsContainer.innerHTML = '<p data-translate="no_announcements">Aucune annonce disponible</p>';
                translatePage(currentLanguage);
                return;
            }
            
            snapshot.forEach(doc => {
                const announcement = doc.data();
                const announcementElement = document.createElement('div');
                announcementElement.className = 'announcement';
                
                const announcementDate = announcement.date.toDate();
                const formattedDate = announcementDate.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                announcementElement.innerHTML = `
                    <h3>${announcement.title}</h3>
                    <p class="announcement-date">${formattedDate}</p>
                    <div class="announcement-content">${announcement.content}</div>
                    ${announcement.imageUrl ? `<img src="${announcement.imageUrl}" alt="${announcement.title}" class="announcement-image">` : ''}
                    ${announcement.attachmentUrl ? `<a href="${announcement.attachmentUrl}" target="_blank" class="btn btn-small" data-translate="download_attachment">Télécharger la pièce jointe</a>` : ''}
                `;
                
                announcementsContainer.appendChild(announcementElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des annonces:', error);
        });
}