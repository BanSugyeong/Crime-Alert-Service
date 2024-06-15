
document.addEventListener('DOMContentLoaded', function() {
    fetch('/is-authenticated')
        .then(response => response.json())
        .then(data => {
            const nav = document.getElementById('navbar-nav');
            if (data.authenticated) {
                nav.innerHTML += '<li class="nav-item"><a class="nav-link" href="map.html">Map</a></li>';
                nav.innerHTML += '<li class="nav-item"><a class="nav-link" href="#" onclick="logout()">Log out</a></li>';
                document.getElementById('mapLink').addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = 'map.html';
                });
            } else {
                nav.innerHTML += '<li class="nav-item"><a class="nav-link" href="login.html">Sign in</a></li>';
                nav.innerHTML += '<li class="nav-item"><a class="nav-link" href="signup.html">Sign up</a></li>';
            }
        });
});

function logout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'index.html';
        } else {
            alert('Logout failed. Please try again.');
        }
    });
}
