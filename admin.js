// Vérifier les privilèges administrateur
auth.onAuthStateChanged(user => {
    if (user) {
        // Vérifier si l'utilisateur est administrateur
        db.collection('users').doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    if (userData.role !== 'admin') {
                        // Rediriger les non-administrateurs
                        window.location.href = 'dashboard.html';
                    } else {
                        // Charger les données administrateur
                        loadAdminData();
                    }
                }
            })
            .catch(error => {
                console.error('Erreur de vérification des privilèges:', error);
                window.location.href = 'dashboard.html';
            });
    } else {
        // Rediriger vers la page de connexion si non connecté
        window.location.href = 'login.html';
    }
});

// Charger les données administrateur
function loadAdminData() {
    loadMemberStats();
    loadMembersList();
    loadContentItems();
}

// Charger les statistiques des membres
function loadMemberStats() {
    db.collection('users').get()
        .then(snapshot => {
            const totalMembers = snapshot.size;
            document.getElementById('total-members').textContent = totalMembers;
            
            // Statistiques par paroisse
            const parishStats = {};
            // Statistiques par catégorie d'âge
            const ageStats = {};
            // Statistiques par genre
            const genderStats = {};
            
            snapshot.forEach(doc => {
                const userData = doc.data();
                
                // Compter par paroisse
                parishStats[userData.parish] = (parishStats[userData.parish] || 0) + 1;
                
                // Compter par catégorie d'âge
                ageStats[userData.ageCategory] = (ageStats[userData.ageCategory] || 0) + 1;
                
                // Compter par genre
                genderStats[userData.gender] = (genderStats[userData.gender] || 0) + 1;
            });
            
            // Afficher les statistiques par paroisse
            const parishStatsElement = document.getElementById('parish-stats');
            parishStatsElement.innerHTML = '';
            for (const parish in parishStats) {
                const statItem = document.createElement('div');
                statItem.textContent = `${parish}: ${parishStats[parish]}`;
                parishStatsElement.appendChild(statItem);
            }
            
            // Afficher les statistiques par catégorie d'âge
            const ageStatsElement = document.getElementById('age-stats');
            ageStatsElement.innerHTML = '';
            for (const category in ageStats) {
                const statItem = document.createElement('div');
                statItem.textContent = `${category}: ${ageStats[category]}`;
                ageStatsElement.appendChild(statItem);
            }
            
            // Afficher les statistiques par genre
            const genderStatsElement = document.getElementById('gender-stats');
            genderStatsElement.innerHTML = '';
            for (const gender in genderStats) {
                const statItem = document.createElement('div');
                statItem.textContent = `${gender}: ${genderStats[gender]}`;
                genderStatsElement.appendChild(statItem);
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des statistiques:', error);
        });
}

// Charger la liste des membres
function loadMembersList() {
    db.collection('users').get()
        .then(snapshot => {
            const membersTable = document.getElementById('members-table').querySelector('tbody');
            membersTable.innerHTML = '';
            
            snapshot.forEach(doc => {
                const userData = doc.data();
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${userData.lastname}</td>
                    <td>${userData.firstname}</td>
                    <td>${userData.parish}</td>
                    <td>${userData.ageCategory}</td>
                    <td>${userData.gender}</td>
                    <td>
                        <button class="btn btn-small" onclick="editMember('${doc.id}')">Modifier</button>
                        <button class="btn btn-small btn-danger" onclick="deleteMember('${doc.id}')">Supprimer</button>
                    </td>
                `;
                
                membersTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des membres:', error);
        });
}

// Fonctions pour les onglets
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove('active');
    }
    
    const tablinks = document.getElementsByClassName('tab-link');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}