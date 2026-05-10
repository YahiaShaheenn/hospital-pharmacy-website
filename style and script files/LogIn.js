
document.getElementById("LoginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const doctors =JSON.parse(localStorage.getItem("doctors")) || [];
    const foundDoctor = doctors.find(user =>user.username === username && user.password === password

);

    if (foundDoctor) {
        sessionStorage.setItem("currentDoctor", username);
        window.location.href = "dashboard.html";

    }
    else {
        document.getElementById("message").textContent = "Wrong username or password";
    }

});



