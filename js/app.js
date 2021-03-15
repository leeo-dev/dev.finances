const Modal = {
  toggle() { // Abrir modal
    document.querySelector(".modal-overlay").classList.toggle("active");
  }
}

const Storage = {
  get(){
    return JSON.parse(localStorage.getItem("dev.fincances:transactions")) || [];
  },
  set(transaction){
    localStorage.setItem("dev.fincances:transactions", JSON.stringify(transaction));
  }
}

const Transactions = {
  all: Storage.get(),
  add(transaction){
      Transactions.all.push(transaction)
      App.reload();
  },
  remove(index){
    Transactions.all.splice(index, 1);
    App.reload();
  },
  incomes() {
    let incomesTotal = 0;
    Transactions.all.forEach((transaction)=>{
      if(transaction.amount > 0){
        incomesTotal += transaction.amount;
      }
    });
    return incomesTotal;
  },
  expenses() {
    let expensesTotal = 0;
    Transactions.all.forEach((transaction)=>{
    if(transaction.amount < 0){
      expensesTotal += transaction.amount;
    }
    });
    return expensesTotal;
  },
  total() {
    let total = Transactions.incomes() + Transactions.expenses()
    return Utils.formatCurrency(total);
  }
}

const Utils = {
  formatAmount(amount){
    amount = Number(amount);
    return amount;
  },

    formatDate(date){
    const splittedDate = date.split("-");
    date = splittedDate.reverse();
    return date.join("/");

  },
  formatCurrency(amount){
    return amount.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});
  }
}

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),
  addTransaction(transaction, index) {
    const tr = document.createElement('tr');  
    tr.innerHTML = DOM.inneHTMLTransaction(transaction, index)
    tr.dataset.index = index;
    DOM.transactionsContainer.appendChild(tr);

  },
  inneHTMLTransaction(transaction, index) {
    const cssClass = transaction.amount > 0 ? "income" : "expense"
    const amount = Utils.formatCurrency(transaction.amount);
    const html = `
              
              <td class="description">${
      transaction["description"]
    }</td>
              <td class="${cssClass}">${amount}</td>
              <td class="date">${
      transaction["date"]
    }</td>
              <td class="date"><img onclick="Transactions.remove(${index})" src="./assets/minus.svg" alt="Remover Transação"></td>
            `
    return html;
  },
  updateBalance(){
    document.querySelector("#incomeDisplay").innerHTML = Utils.formatCurrency(Transactions.incomes());
    document.querySelector("#expenseDisplay").innerHTML = Utils.formatCurrency(Transactions.expenses());
    document.querySelector("#totalDisplay").innerHTML = Utils.formatCurrency(Transactions.total());
  },
  clearTransactions(){
    DOM.transactionsContainer.innerHTML = "";
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues(){
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields(){
    const {description, amount, date} = Form.getValues();
    if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
      throw new Error("Por favor preencha todos os campos!");
    }
  },
  formatValue(){
    let {description, amount, date} = Form.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {description, amount, date}
    
  },
  saveTransaction(transaction){
    Transactions.add(transaction)
  },
  clearFileds(){
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },
  submit(event){
    event.preventDefault();
    //Verificar se informações foram preenchidas
    try{
    Form.validateFields();
    //Formatar os Formulários
    const transaction = Form.formatValue();
    //Salvar Dados
    Form.saveTransaction(transaction)
    //Apagar Formulário
    Form.clearFileds();
    //Fechar Modal
    Modal.toggle();
    }catch(error){
      alert(error.message)
    }

  }


}

const App = {
  init(){
    document.querySelector("#formSubmit").addEventListener("submit", Form.submit);
    document.querySelector(".button.new").addEventListener("click", Modal.toggle);
    document.querySelector(".button.cancel").addEventListener("click", Modal.toggle);


  Transactions.all.forEach(DOM.addTransaction)
  DOM.updateBalance();

  Storage.set(Transactions.all)
  },
  reload(){
    DOM.clearTransactions();
    App.init()
  }
}
App.init();

