function login() {

    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let found = users.find(u => u.username === user && u.password === pass);

    if (found) {

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", user);

        alert("Login Successful");

        window.location.href = "dashboard.html";

    } else {

        document.getElementById("msg").innerHTML = "Invalid Username or Password";

    }

}
function register() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username == "" || password == "") {
        alert("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let exists = users.find(u => u.username === username);

    if (exists) {
        alert("Username already exists");
        return;
    }

    users.push({
        username: username,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful");

    window.location.href = "login.html";
}