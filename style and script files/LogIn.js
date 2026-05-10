const doctorUsername = "Yahia";
const doctorPassword = "123456";

document.getElementById("LoginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === doctorUsername && password === doctorPassword) {

        localStorage.setItem("currentDoctor", username);
        window.location.href = "dashboard.html";

    }
    else {
        document.getElementById("message").textContent = "Wrong username or password";
    }

});



