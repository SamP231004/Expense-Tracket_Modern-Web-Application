const loginButton = document.querySelector('.login');
const signUpButton = document.querySelector('.signUp');
const authenticationBox = document.getElementById('authen');
const closeButton = document.querySelector('.close');
const authTitle = document.getElementById('authTitle');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('submitAuth');
const message = document.getElementById('message');
let logoutButton;

loginButton.addEventListener('click', () => {
    authenticationBox.style.display = 'flex';
    authTitle.textContent = 'Login';
    submitButton.textContent = 'Login';
});

signUpButton.addEventListener('click', () => {
    authenticationBox.style.display = 'flex';
    authTitle.textContent = 'Sign Up';
    submitButton.textContent = 'Sign Up';
});

closeButton.addEventListener('click', () => {
    authenticationBox.style.display = 'none';
    message.textContent = "";
    emailInput.value = "";
    passwordInput.value = "";
});

submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const isSignUp = authTitle.textContent === 'Sign Up';

    if (!email || !password) {
        message.textContent = "Please enter both email and password.";
        message.style.color = "red";
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        message.textContent = "Invalid email format.";
        message.style.color = "red";
        return;
    }

    authenticateUser(email, password, isSignUp)
        .then(response => {
            if (response.success) {
                message.textContent = "Authentication successful!";
                message.style.color = "green";
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);

                setTimeout(() => {
                    authenticationBox.style.display = "none";
                    emailInput.value = "";
                    passwordInput.value = "";
                    loginButton.style.display = 'none';
                    signUpButton.style.display = 'none';

                    logoutButton = document.createElement('button');
                    logoutButton.textContent = 'Logout';
                    logoutButton.classList.add('logout');
                    document.querySelector('.authentication').appendChild(logoutButton);
                    logoutButton.addEventListener('click', logout);

                    loadExpenses(email);
                }, 2000);
            } 
            else {
                message.textContent = response.message;
                message.style.color = "red";
            }
        })
        .catch(error => {
            message.textContent = "An error occurred. Please try again later.";
            message.style.color = "red";
            console.error(error);
        });
});

function authenticateUser(email, password, isSignUp) {
    return new Promise((resolve) => {
        const url = isSignUp
            ? 'http://localhost:8000/signup.php' 
            : 'http://localhost:8000/login.php';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', email);
                    resolve(data);
                } 
                else {
                    resolve(data); 
                }
            })
            .catch(error => {
                resolve({ success: false, message: "Request failed. Please try again." });
                console.error("Fetch error:", error);
            });
    });
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    loginButton.style.display = 'block';
    signUpButton.style.display = 'block';
    if (logoutButton) logoutButton.remove();
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        loginButton.style.display = 'none';
        signUpButton.style.display = 'none';

        logoutButton = document.createElement('button');
        logoutButton.textContent = 'Logout';
        logoutButton.classList.add('logout');
        document.querySelector('.authentication').appendChild(logoutButton);
        logoutButton.addEventListener('click', logout);

        loadExpenses(localStorage.getItem('userEmail'));
    }
});

document.getElementById('expense-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const data = {
        type: document.getElementById('type').value,
        amount: document.getElementById('amount').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
        email: localStorage.getItem('userEmail')
    };

    console.log("User email from localStorage: ", localStorage.getItem('userEmail'));

    console.log("Data being sent to backend: ", data);

    fetch('http://localhost:8000/submit_expense.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(responseData => {
            alert(responseData.message);
            loadExpenses(data.email);
            document.getElementById('expense-form').reset();
        })
        .catch(error => console.error('Error:', error));
});

function loadExpenses(userEmail) {
    fetch(`http://localhost:8000/get_expenses.php?email=${userEmail}`)
        .then(response => response.json())
        .then(expenses => {
            const table = document.getElementById('expense-table');
            table.innerHTML = "";
            expenses.forEach(expense => {
                const row = table.insertRow();
                Object.values(expense).forEach(text => {
                    const cell = row.insertCell();
                    cell.textContent = text;
                });
            });
        })
        .catch(error => console.error("Error loading expenses:", error));
}
