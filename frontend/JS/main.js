document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const type = document.getElementById('type').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    
    const table = document.getElementById('expense-table');
    const row = table.insertRow();
    row.insertCell(0).textContent = type;
    row.insertCell(1).textContent = `${amount}`;
    row.insertCell(2).textContent = category;
    row.insertCell(3).textContent = date;
    
    document.getElementById('expense-form').reset();
});