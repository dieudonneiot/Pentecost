// Gestion de l'inscription
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const parish = document.getElementById('parish').value;
            const lastname = document.getElementById('lastname').value;
            const firstname = document.getElementById('firstname').value;
            const birthdate = document.getElementById('birthdate').value;
            const gender = document.getElementById('gender').value;
            
            // Validation
            if (password !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas');
                return;
            }
            
            // Calculer l'âge et la catégorie
            const age = calculateAge(birthdate);
            const ageCategory = getAgeCategory(age);
            
            // Créer l'utilisateur avec Firebase Auth
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Utilisateur créé avec succès
                    const user = userCredential.user;
                    
                    // Enregistrer les informations supplémentaires dans Firestore
                    return db.collection('users').doc(user.uid).set({
                        parish: parish,
                        lastname: lastname,
                        firstname: firstname,
                        birthdate: birthdate,
                        age: age,
                        ageCategory: ageCategory,
                        gender: gender,
                        email: email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        role: 'member' // Par défaut, les utilisateurs sont des membres
                    });
                })
                .then(() => {
                    // Rediriger vers le tableau de bord
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    console.error('Erreur lors de l\'inscription:', error);
                    alert('Erreur lors de l\'inscription: ' + error.message);
                });
        });
    }
    
    // Gestion de la connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Connexion réussie
                    window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                    console.error('Erreur de connexion:', error);
                    alert('Erreur de connexion: ' + error.message);
                });
        });
    }
});

// Calculer l'âge à partir de la date de naissance
function calculateAge(birthdate) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// Déterminer la catégorie d'âge
function getAgeCategory(age) {
    if (age < 13) return 'enfant';
    if (age < 18) return 'adolescent';
    if (age < 35) return 'jeune';
    if (age < 60) return 'adulte';
    return 'senior';
}