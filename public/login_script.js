const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const alertDiv = document.getElementById('alert_login_status');

usernameInput.addEventListener('input', clearMessage);
passwordInput.addEventListener('input', clearMessage);

function showMessage(message, color = 'red') {
    alertDiv.textContent = message;
    alertDiv.style.color = color;
}

function clearMessage() {
    if (alertDiv.textContent !== '') {
        alertDiv.textContent = '';
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ username, password })
        });

        const text = await res.text();

        if (res.ok) {
            showMessage('Login successful!', 'green');
            setTimeout(() => {
                window.location.href = '/main.html';
            }, 1000);
        } else {
            showMessage(text || 'Invalid username or password.');
        }
    } catch (err) {
        showMessage('Something went wrong. Please try again.');
    }
});
