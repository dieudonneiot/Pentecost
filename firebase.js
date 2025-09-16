// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBG66KEzjphdyCziwHuSoGHuATV7r5IdDQ",
  authDomain: "pentecost-93938.firebaseapp.com",
  projectId: "pentecost-93938",
  storageBucket: "pentecost-93938.firebasestorage.app",
  messagingSenderId: "38688939514",
  appId: "1:38688939514:web:40828fe159ddf4d6e15843",
  measurementId: "G-1C78FSSG1B"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Initialiser les services
const auth = firebase.auth();
const db = firebase.firestore();

// Gestion de l'état d'authentification
auth.onAuthStateChanged(user => {
    const authLink = document.getElementById('auth-link');
    if (user) {
        // Utilisateur connecté
        authLink.innerHTML = `<a href="dashboard.html" data-translate="dashboard">Tableau de bord</a> 
                              <a href="#" onclick="logout()" data-translate="logout">Déconnexion</a>`;
    } else {
        // Utilisateur non connecté
        authLink.innerHTML = '<a href="login.html" data-translate="login">Connexion</a>';
    }
    
    // Traduire à nouveau après modification du DOM
    if (typeof translatePage === 'function') {
        translatePage(currentLanguage);
    }
});

// Fonction de déconnexion
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Erreur de déconnexion:', error);
    });
}