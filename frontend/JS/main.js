const loginButton = document.querySelector('.login');
const signUpButton = document.querySelector('.signUp');
const authenticationBox = document.getElementById('authen');
const closeButton = document.querySelector('.close');
const authTitle = document.getElementById('authTitle');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('submitAuth');
const message = document.getElementById('message');

loginButton.addEventListener('click', () => {
  authenticationBox.style.display = 'flex';
  authTitle.textContent = 'Login';
});

signUpButton.addEventListener('click', () => {
  authenticationBox.style.display = 'flex';
  authTitle.textContent = 'Sign Up';
});

closeButton.addEventListener('click', () => {
  authenticationBox.style.display = 'none';
  message.textContent = "";
  emailInput.value = "";
  passwordInput.value = "";
});

submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

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

    simulateServerAuthentication(email, password)
        .then(response => {
            if (response.success) {
                message.textContent = "Authentication successful!";
                message.style.color = "green";
                setTimeout(() => {
                    authenticationBox.style.display = "none";
                    message.textContent = "";
                    emailInput.value = "";
                    passwordInput.value = "";
                    loginButton.style.display = 'none';
                    signUpButton.style.display = 'none';
                }, 2000);
            } else {
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

function simulateServerAuthentication(email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (email === "test@example.com" && password === "password") {
                resolve({ success: true });
            } else {
                resolve({ success: false, message: "Invalid email or password." });
            }
        }, 1000);
    });
}

document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const type = document.getElementById('type').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    const data = {
        type: type,
        amount: amount,
        category: category,
        date: date
    };

    fetch('submit_expense.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        
        const table = document.getElementById('expense-table');
        const row = table.insertRow();
        row.insertCell(0).textContent = type;
        row.insertCell(1).textContent = amount;
        row.insertCell(2).textContent = category;
        row.insertCell(3).textContent = date;
        
        document.getElementById('expense-form').reset(); 
    })
    .catch(error => console.error('Error:', error));
});
