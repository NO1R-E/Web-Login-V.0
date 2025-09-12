const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm_password');
const alertDiv = document.getElementById('alert_register_status');

let emailAvailable = false;
let usernameAvailable = false;

emailInput.addEventListener('input', () => {
    emailInput.style.borderColor = '#ccc';
    clearMessage;
});
usernameInput.addEventListener('input', () => {
    usernameInput.style.borderColor = '#ccc';
    clearMessage;
});
passwordInput.addEventListener('input', () =>{
    passwordInput.style.borderColor = '#ccc';
    confirmPasswordInput.style.borderColor = '#ccc';
    clearMessage;
});
confirmPasswordInput.addEventListener('input', () =>{
    passwordInput.style.borderColor = '#ccc';
    confirmPasswordInput.style.borderColor = '#ccc';
    clearMessage;
});

function showMessage(message, color = 'red') {
    alertDiv.textContent = message;
    alertDiv.style.color = color;
}
function clearMessage(){
    if (alertDiv.textContent !== '') {
        alertDiv.textContent = '';
    }
}

emailInput.addEventListener('blur', async () => {
    const email = emailInput.value.trim();
    if (!email) return;

    const res = await fetch('/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email })
    });

    const text = await res.text();
    if (text === 'exists') {
        emailAvailable = false;
        emailInput.style.borderColor = 'red';
        showMessage('Email already in use.');
    } else {
        emailAvailable = true;
        showMessage('');
    }
});

usernameInput.addEventListener('blur', async () => {
    const username = usernameInput.value.trim();
    if (!username) return;

    const res = await fetch('/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username })
    });

    const text = await res.text();
    if (text === 'exists') {
        usernameAvailable = false;
        usernameInput.style.borderColor = 'red';
        showMessage('Username already taken.');
    } else {
        usernameAvailable = true;
        showMessage('');
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!emailAvailable) return showMessage('Please use a different email.');
    if (!usernameAvailable) return showMessage('Please use a different username.');
    if (password !== confirmPassword) {
        passwordInput.style.borderColor = 'red';
        confirmPasswordInput.style.borderColor = 'red';
        return showMessage('Passwords do not match.');
    }
    const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, username, password })
    });

    const text = await res.text();
    if (text === 'success') {
        showMessage('Registration successful!', 'green');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
    } else {
        showMessage(text);
    }
});