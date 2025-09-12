const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const alertDiv = document.getElementById('message');

usernameInput.addEventListener('input', clearMessage);
passwordInput.addEventListener('input', clearMessage);

function clearMessage() {
    if (alertDiv.textContent !== '') {
        alertDiv.textContent = '';
    }
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const alertDiv = document.getElementById('alert_login_status');

    fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
      alertDiv.style.color = 'green';
      alertDiv.textContent = data;
    })
    .catch(err => {
      alertDiv.style.color = 'red';
      alertDiv.textContent = 'Invalid username or password.';
    });
});
