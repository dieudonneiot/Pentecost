// Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendContactMessage();
        });
    }
});

// Envoyer un message de contact
function sendContactMessage() {
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    
    db.collection('contact_messages').add({
        name: name,
        email: email,
        subject: subject,
        message: message,
        date: new Date(),
        read: false
    })
    .then(() => {
        alert('Message envoyé avec succès! Nous vous répondrons dès que possible.');
        document.getElementById('contact-form').reset();
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi du message:', error);
        alert('Erreur lors de l\'envoi du message: ' + error.message);
    });
}
