const transactionForm = document.getElementById('transaction-form')
const transBtn = document.getElementById('trans-btn')
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const listUpdate = document.getElementById('list-form')
const balanceEl = document.getElementById('balance')
const incomeEl = document.getElementById('income')
const expensesEl = document.getElementById('expenses')


let transactions = JSON.parse(localStorage.getItem('transactions')) || []

transactionForm.addEventListener('submit',addTransaction)

function addTransaction(e){
    e.preventDefault()

    const description = descriptionEl.value.trim()
    const amount = parseFloat(amountEl.value)

    transactions.push({    //[1,'airpods',30]
        id: Date.now(),
        description,
        amount,
    })

    localStorage.setItem('transactions',JSON.stringify(transactions))

    updateTransactionList()
    updateSummary()

    transactionForm.reset()

}

function updateTransactionList(){
   listUpdate.innerHTML = ''
   const sortedTransaction = [...transactions].reverse()
   sortedTransaction.forEach((transaction)=>{
    const transactionEl = createTransactionEl(transaction)
    listUpdate.appendChild(transactionEl)
   })
}

function createTransactionEl(transaction){
   const liEl = document.createElement('li')
  
    liEl.className =
        'border border-gray-200 rounded-sm p-5 flex justify-between items-center relative group shadow-sm max-w-sm bg-white';
   
   liEl.innerHTML = `
    <span>${transaction.description}</span>
          
          <div class="flex items-center space-x-2">
          <span>${formatCurrency(transaction.amount)}</span>
          <button class="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500 cursor-pointer" onclick="removeTransaction(${transaction.id})">
            ✕
          </button>
          <div class="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-green-400 to-green-600 rounded-r-xl"></div>
   `

   return liEl
}

function updateSummary(){
const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  // update ui 
  balanceEl.textContent = formatCurrency(balance);
  incomeEl.textContent = formatCurrency(income);
  expensesEl.textContent = formatCurrency(expenses);
}

function formatCurrency(number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
}

function removeTransaction(id) {
  // filter out the one we wanted to delete
  transactions = transactions.filter((transaction) => transaction.id !== id);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();
}
updateTransactionList();
updateSummary();