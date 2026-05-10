let style = document.createElement("style");

style.textContent = `

.TopBar{
    background-color: rgb(63, 138, 153);
    color: black;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 6px;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.toprow{
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
}

.toprow h1{
    justify-self: center;
    grid-column: 2;
    font-size: 45px;
}

.profile{
    justify-self: end;
    grid-column: 3;
    margin-top: 10px;
}

.nav{
    display: flex;
    gap: 70px;
    justify-content: center;
}

.nav button{
    background-color: powderblue;
    color: black;
    padding: 5px;
    border-radius: 8px;
    margin-top: 10px;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    border: none;
}

.nav button:hover{
    background-color: lightgoldenrodyellow;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.3);
}

body{
    margin: 0;
    padding: 0;
    background-color: powderblue;
}

body::before{
    content: "";
    position: fixed;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background-image: url("saidaleya.png");
    background-repeat: no-repeat;
    background-position: center 120px;
    background-size: 700px;

    opacity: 0.2;

    z-index: -1;
}

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.profile-icon{
    color: white;
    text-decoration: none;
}

.profile-icon:visited{
    color: white;
}

.profile-icon .material-icons{
    font-size: 40px;
}

`;

document.head.appendChild(style);



let topbar = document.createElement("div");
topbar.className = "TopBar";

topbar.innerHTML = `
    <div class="toprow">

        <h1>Pharmacy</h1>

        <div class="profile">
            <a href="login.html" class="profile-icon">
                <span class="material-icons">account_circle</span>
            </a>
        </div>

    </div>

    <div class="nav">
        <button type="button" onclick="location.href='#'">Dashboard</button>
        <button type="button" onclick="location.href='inventory.html'">Inventory</button>
        <button type="button" onclick="location.href='sales.html'">Sales</button>
        <button type="button" onclick="location.href='reports.html'">Reports</button>
    </div>
`;

document.body.insertBefore(topbar, document.body.firstChild);