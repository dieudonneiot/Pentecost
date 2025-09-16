// Initialiser Firebase Storage
const storage = firebase.storage();

// Charger la galerie
document.addEventListener('DOMContentLoaded', function() {
    loadGallery('all');
    
    // Ajouter les écouteurs d'événements pour les filtres
    document.querySelectorAll('.gallery-filters button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.gallery-filters button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            loadGallery(category);
        });
    });
});

// Charger la galerie selon la catégorie
function loadGallery(category) {
    let query = db.collection('gallery').orderBy('date', 'desc');
    
    if (category !== 'all') {
        query = query.where('category', '==', category);
    }
    
    query.get()
        .then(snapshot => {
            const galleryContainer = document.getElementById('gallery-container');
            galleryContainer.innerHTML = '';
            
            if (snapshot.empty) {
                galleryContainer.innerHTML = '<p data-translate="no_media">Aucun média disponible</p>';
                translatePage(currentLanguage);
                return;
            }
            
            snapshot.forEach(doc => {
                const media = doc.data();
                const mediaElement = document.createElement('div');
                mediaElement.className = 'gallery-item';
                
                const mediaDate = media.date.toDate();
                const formattedDate = mediaDate.toLocaleDateString();
                
                if (media.type === 'image') {
                    mediaElement.innerHTML = `
                        <img src="${media.url}" alt="${media.title}" onclick="openModal('${media.url}', 'image')">
                        <div class="gallery-item-info">
                            <h4>${media.title}</h4>
                            <p><small>${formattedDate}</small></p>
                            <p>${media.description}</p>
                        </div>
                    `;
                } else if (media.type === 'video') {
                    mediaElement.innerHTML = `
                        <video controls>
                            <source src="${media.url}" type="video/mp4">
                            Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                        <div class="gallery-item-info">
                            <h4>${media.title}</h4>
                            <p><small>${formattedDate}</small></p>
                            <p>${media.description}</p>
                        </div>
                    `;
                }
                
                galleryContainer.appendChild(mediaElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement de la galerie:', error);
        });
}

// Ouvrir une modal pour afficher l'image en grand
function openModal(url, type) {
    if (type !== 'image') return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <img src="${url}" alt="Image en grand">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fermer la modal en cliquant à l'extérieur
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Fermer la modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}