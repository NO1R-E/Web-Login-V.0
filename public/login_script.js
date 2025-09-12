document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
    .then(response => {
      if (response.ok) {
        window.location.href = '/main.html';
        return response.text();
      } else {
        throw new Error('Login failed');
      }
    })
    .then(data => {
      messageDiv.style.color = 'green';
      messageDiv.textContent = data;
    })
    .catch(err => {
      messageDiv.style.color = 'red';
      messageDiv.textContent = 'Invalid username or password.';
    });
});
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('message');

function clearMessage() {
    if (messageDiv.textContent !== '') {
        messageDiv.textContent = '';
    }
}

usernameInput.addEventListener('input', clearMessage);
passwordInput.addEventListener('input', clearMessage);
