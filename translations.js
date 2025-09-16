const translations = {
    fr: {
        "home": "Accueil",
        "program": "Programme",
        "online_service": "Culte en ligne",
        "daily_message": "Message du jour",
        "announcements": "Annonces",
        "gallery": "Galerie",
        "prayer": "Prière",
        "contact": "Contact",
        "login": "Connexion",
        "logout": "Déconnexion",
        "dashboard": "Tableau de bord",
        "welcome_message": "Bienvenue dans notre communauté",
        "welcome_description": "Rejoignez-nous pour worship et fellowship",
        "join_us": "Rejoignez-nous",
        "view_program": "Voir le programme",
        "our_services": "Nos services",
        "online_worship": "Culte en ligne",
        "online_worship_desc": "Participez à nos services où que vous soyez",
        "community": "Communauté",
        "community_desc": "Rejoignez une communauté bienveillante",
        "spiritual_growth": "Croissance spirituelle",
        "spiritual_growth_desc": "Développez votre foi avec nos ressources",
        "latest_news": "Dernières actualités",
        "all_rights_reserved": "Tous droits réservés"
    },
    en: {
        "home": "Home",
        "program": "Program",
        "online_service": "Online Service",
        "daily_message": "Daily Message",
        "announcements": "Announcements",
        "gallery": "Gallery",
        "prayer": "Prayer",
        "contact": "Contact",
        "login": "Login",
        "logout": "Logout",
        "dashboard": "Dashboard",
        "welcome_message": "Welcome to our community",
        "welcome_description": "Join us for worship and fellowship",
        "join_us": "Join us",
        "view_program": "View program",
        "our_services": "Our services",
        "online_worship": "Online Worship",
        "online_worship_desc": "Join our services from anywhere",
        "community": "Community",
        "community_desc": "Join a caring community",
        "spiritual_growth": "Spiritual Growth",
        "spiritual_growth_desc": "Grow your faith with our resources",
        "latest_news": "Latest news",
        "all_rights_reserved": "All rights reserved"
    },
    ee: {
        "home": "Xɔa",
        "program": "Programme",
        "online_service": "Kuku ƒe Srɔ̃ɖoɖo",
        "daily_message": "Ŋkeke la ƒe Msẽ",
        "announcements": "Dzidzidzixɔxɔwo",
        "gallery": "Nuwɔwɔƒe",
        "prayer": "Ŋutifafa",
        "contact": "Nɔnya",
        "login": "Domi",
        "logout": "Vo dome",
        "dashboard": "Dɔwɔƒe",
        "welcome_message": "Wóe zɔ nàmi ɖe míaƒe habɔbɔ me",
        "welcome_description": "Bɔ míaƒe kukudɔwɔa kple habɔbɔ me",
        "join_us": "Bɔ na mi",
        "view_program": "Kpɔ programmea",
        "our_services": "Míaƒe dɔwɔwɔwo",
        "online_worship": "Kuku ƒe Srɔ̃ɖoɖo",
        "online_worship_desc": "Bɔ míaƒe dɔwɔwɔwo me le afi sia afi",
        "community": "Habɔbɔ",
        "community_desc": "Bɔ habɔbɔ si le kpɔdada me",
        "spiritual_growth": "Mɔkpɔkpɔ ƒe ƒuƒoƒo",
        "spiritual_growth_desc": "Dze mɔkpɔkpɔ ƒe lɔlɔ̃ na wò nunya",
        "latest_news": "Xoxoa me nyawo",
        "all_rights_reserved": "Wɔƒe wɔwɔ bliboa"
    }
};

let currentLanguage = 'fr';

function changeLanguage(lang) {
    currentLanguage = lang;
    document.getElementById('language-switcher').value = lang;
    translatePage(lang);
    // Sauvegarder la préférence de langue
    localStorage.setItem('preferredLanguage', lang);
}

function translatePage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Initialiser la langue au chargement
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'fr';
    changeLanguage(savedLanguage);
    
    // Écouter les changements de langue
    document.getElementById('language-switcher').addEventListener('change', function() {
        changeLanguage(this.value);
    });
});