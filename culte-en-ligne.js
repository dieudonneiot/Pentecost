// Charger les services en ligne
document.addEventListener('DOMContentLoaded', function() {
    checkLiveStream();
    loadPastSermons();
});

// Vérifier s'il y a un direct en cours
function checkLiveStream() {
    const now = new Date();
    
    db.collection('live_streams')
        .where('startTime', '<=', now)
        .where('endTime', '>=', now)
        .limit(1)
        .get()
        .then(snapshot => {
            const livePlayer = document.getElementById('live-player');
            const noLive = document.getElementById('no-live');
            
            if (snapshot.empty) {
                livePlayer.style.display = 'none';
                noLive.style.display = 'block';
                return;
            }
            
            snapshot.forEach(doc => {
                const stream = doc.data();
                livePlayer.style.display = 'block';
                noLive.style.display = 'none';
                
                // Mettre à jour l'iframe YouTube
                const youtubeIframe = document.getElementById('youtube-player');
                youtubeIframe.src = `https://www.youtube.com/embed/${stream.youtubeId}?autoplay=1`;
            });
        })
        .catch(error => {
            console.error('Erreur lors de la vérification du direct:', error);
        });
}

// Charger les sermons passés
function loadPastSermons() {
    db.collection('sermons')
        .orderBy('date', 'desc')
        .limit(10)
        .get()
        .then(snapshot => {
            const sermonsContainer = document.getElementById('sermons-container');
            sermonsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                sermonsContainer.innerHTML = '<p data-translate="no_sermons">Aucun sermon disponible</p>';
                translatePage(currentLanguage);
                return;
            }
            
            snapshot.forEach(doc => {
                const sermon = doc.data();
                const sermonElement = document.createElement('div');
                sermonElement.className = 'sermon-item';
                
                const sermonDate = sermon.date.toDate();
                const formattedDate = sermonDate.toLocaleDateString();
                
                sermonElement.innerHTML = `
                    <div class="sermon-thumbnail">
                        <img src="${sermon.thumbnail || 'images/default-sermon.jpg'}" alt="${sermon.title}">
                    </div>
                    <div class="sermon-details">
                        <h4>${sermon.title}</h4>
                        <p><small>${formattedDate} - ${sermon.preacher}</small></p>
                        <p>${sermon.description.substring(0, 100)}...</p>
                        <button class="btn btn-small" onclick="playSermon('${sermon.videoId}')" data-translate="watch">Regarder</button>
                    </div>
                `;
                
                sermonsContainer.appendChild(sermonElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des sermons:', error);
        });
}

// Jouer un sermon
function playSermon(videoId) {
    const livePlayer = document.getElementById('live-player');
    const noLive = document.getElementById('no-live');
    
    livePlayer.style.display = 'block';
    noLive.style.display = 'none';
    
    // Mettre à jour l'iframe YouTube
    const youtubeIframe = document.getElementById('youtube-player');
    youtubeIframe.src = `https://www.youtube.com/embed/${videoId}`;
    
    // Faire défiler jusqu'au lecteur
    livePlayer.scrollIntoView({ behavior: 'smooth' });
}