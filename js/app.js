const Modal = {
  toggle() { // Abrir modal
    document.querySelector(".modal-overlay").classList.toggle("active");
  }
}

const Transactions = {
  all: [
  {
    description: 'Luz',
    amount: -500,
    date: '29/01/2021'
  }, {
    description: 'WebSite',
    amount: 5000,
    date: '08/02/2021'
  }, {
    description: 'Internet',
    amount: 200,
    date: '14/03/2021'
  },
  {
    description: 'Aluguel',
    amount: -400,
    date: '08/03/2021'
  },
],
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
    return Ultius.formatCurrency(total);
  }
}

const Ultius = {
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
    tr.innerHTML = DOM.inneHTMLTransaction(transaction)
    DOM.transactionsContainer.appendChild(tr);

  },
  inneHTMLTransaction(transaction) {
    const cssClass = transaction.amount > 0 ? "income" : "expense"
    const amount = Ultius.formatCurrency(transaction.amount);
    const html = `
              
              <td class="description">${
      transaction["description"]
    }</td>
              <td class="${cssClass}">${amount}</td>
              <td class="date">${
      transaction["date"]
    }</td>
              <td class="date"><img src="./assets/minus.svg" alt="Remover Transação"></td>
            `
    return html;
  },
  updateBalance(){
    document.querySelector("#incomeDisplay").innerHTML = Ultius.formatCurrency(Transactions.incomes());
    document.querySelector("#expenseDisplay").innerHTML = Ultius.formatCurrency(Transactions.expenses());
    document.querySelector("#totalDisplay").innerHTML = Ultius.formatCurrency(Transactions.total());
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
    formatData(){
    
  },
  submit(event){
    event.preventDefault();
    //Verificar se informações foram preenchidas
    try{
    Form.validateFields();
    //Formatar os Formulários
    Form.formatData();
    //Salvar Dados
    //Apagar Formulário
    //Fechar Modal
    //Atualizar a Aplicação
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
  Transactions.all.forEach((transaction)=>{
  DOM.addTransaction(transaction);
});
  DOM.updateBalance();
  },
  reload(){
    DOM.clearTransactions();
    App.init()
  }
}
App.init();

