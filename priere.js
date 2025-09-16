// Charger les demandes de prière
document.addEventListener('DOMContentLoaded', function() {
    loadPrayerRequests();
    
    // Gestion du formulaire de demande de prière
    const prayerForm = document.getElementById('prayer-request-form');
    if (prayerForm) {
        prayerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitPrayerRequest();
        });
    }
});

// Charger les demandes de prière
function loadPrayerRequests() {
    auth.onAuthStateChanged(user => {
        let query = db.collection('prayers').where('public', '==', true).orderBy('date', 'desc');
        
        // Si l'utilisateur est connecté, il peut voir ses propres demandes même si elles ne sont pas publiques
        if (user) {
            query = db.collection('prayers')
                .where('public', '==', true)
                .orderBy('date', 'desc');
        }
        
        query.get()
            .then(snapshot => {
                const prayersContainer = document.getElementById('prayer-requests-list');
                prayersContainer.innerHTML = '';
                
                if (snapshot.empty) {
                    prayersContainer.innerHTML = '<p data-translate="no_prayers">Aucune demande de prière</p>';
                    translatePage(currentLanguage);
                    return;
                }
                
                snapshot.forEach(doc => {
                    const prayer = doc.data();
                    const prayerElement = document.createElement('div');
                    prayerElement.className = 'prayer-request';
                    
                    const prayerDate = prayer.date.toDate();
                    const formattedDate = prayerDate.toLocaleDateString();
                    
                    prayerElement.innerHTML = `
                        <h4>${prayer.title}</h4>
                        <p><small>${formattedDate}</small></p>
                        <div class="prayer-content">${prayer.content}</div>
                        <button class="btn btn-small" onclick="prayForRequest('${doc.id}')" data-translate="pray_for_this">Prier pour cette intention</button>
                        <span class="prayer-count">${prayer.prayerCount || 0} <span data-translate="prayers">prières</span></span>
                    `;
                    
                    prayersContainer.appendChild(prayerElement);
                });
            })
            .catch(error => {
                console.error('Erreur lors du chargement des demandes de prière:', error);
            });
    });
}

// Soumettre une demande de prière
function submitPrayerRequest() {
    auth.onAuthStateChanged(user => {
        if (!user) {
            alert('Veuillez vous connecter pour soumettre une demande de prière');
            window.location.href = 'login.html';
            return;
        }
        
        const title = document.getElementById('prayer-title').value;
        const content = document.getElementById('prayer-content').value;
        const isPublic = document.getElementById('prayer-public').checked;
        
        db.collection('prayers').add({
            title: title,
            content: content,
            public: isPublic,
            userId: user.uid,
            date: new Date(),
            prayerCount: 0
        })
        .then(() => {
            alert('Demande de prière soumise avec succès');
            document.getElementById('prayer-request-form').reset();
            loadPrayerRequests();
        })
        .catch(error => {
            console.error('Erreur lors de la soumission de la demande de prière:', error);
            alert('Erreur lors de la soumission: ' + error.message);
        });
    });
}

// Prier pour une intention
function prayForRequest(prayerId) {
    auth.onAuthStateChanged(user => {
        if (!user) {
            alert('Veuillez vous connecter pour prier pour cette intention');
            return;
        }
        
        // Incrémenter le compteur de prières
        const prayerRef = db.collection('prayers').doc(prayerId);
        
        db.runTransaction(transaction => {
            return transaction.get(prayerRef).then(doc => {
                if (!doc.exists) {
                    throw new Error('Document does not exist!');
                }
                
                const newPrayerCount = (doc.data().prayerCount || 0) + 1;
                transaction.update(prayerRef, { prayerCount: newPrayerCount });
                
                return newPrayerCount;
            });
        })
        .then(newPrayerCount => {
            // Mettre à jour l'affichage
            const prayerElement = document.querySelector(`[onclick="prayForRequest('${prayerId}')"]`).parentElement;
            const prayerCountElement = prayerElement.querySelector('.prayer-count');
            prayerCountElement.textContent = `${newPrayerCount} prières`;
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour du compteur de prières:', error);
        });
    });
}