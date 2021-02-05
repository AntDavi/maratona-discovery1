const modal = {
    open() {
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

const Storage = {
    get () {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set (transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes () {
        let income = 0;
        Transaction.all.forEach((transaction) => {
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses () {
        let expense = 0;
        Transaction.all.forEach((transaction) => {
            if(transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total () {
        return Transaction.incomes () + Transaction.expenses ();
    },
}

const Wallet = {
    extract() {
        const transactions = Transaction.all;
        const incomes = Transaction.incomes();
        const expenses = Transaction.expenses();
        const total = Transaction.total();
     
        const currentDate = new Date();
     
        const date = {
          day: currentDate.getDay(),
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          hours: currentDate.getHours(),
          minutes: currentDate.getMinutes(),
          seconds: currentDate.getSeconds(),
        };
     
        let text = `Extrato - Data: ${`${date.day}/${date.month}/${date.year} - ${date.hours}:${date.minutes}:${date.seconds}\n`}`;
     
        text += transactions.reduce(
          (txt, transaction) =>
            (txt += `\n${transaction.date} - ${
              transaction.description
            }       ${Utils.formatCurrency(transaction.amount)}`),
          ""
        );
     
        text += `\n\nEntradas:        ${Utils.formatCurrency(incomes)}`;
        text += `\nSaídas:          ${Utils.formatCurrency(expenses)}`;
        text += `\nTotal:           ${Utils.formatCurrency(total)}`;
     
        Utils.downloadFile(text, "extrato.txt", "application/text");
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction (transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)

        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction (transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <tr>
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img onclick="Transaction.remove(${index})" src="/assets/minus.svg" alt="Remover transação">
                </td>
            </tr>
        `
        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransaction() {
        DOM.transactionsContainer.innerHTML = ""
    },
    
}

const Utils = {
    formatAmount(value) {
        value = value * 100

        return value;
    },
    formatDate(date) {
        const splitteDate = date.split("-")
        return `${splitteDate[2]}/${splitteDate[1]}/${splitteDate[0]}`
    },
    formatCurrency (value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    },
    downloadFile(data, name, type) {
        const blob = new Blob([data], {
          type: type,
        });
        const link = window.document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${name.trim().replace(/ +/g, "-")}`;
        link.click();
        window.URL.revokeObjectURL(link.href);
        return;
    },
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateField() {
        const { description, amount, date} = Form.getValues()

        if(
            description.trim() === "" || 
            amount.trim() === "" ||
            date.trim() === ""
        ) {
            throw new Error ("Por favor preencha todos os campos.")
        }
    },

    formatValues() {
        let { description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields () {
        Form.description.value=""
        Form.amount.value=""
        Form.date.value=""
    },

    submit(event) {
        event.preventDefault()

        try {
            //Verificar se todas as informaçõe foram preenchidas
            Form.validateField()
            // formatar os dados para salvar
            const transaction = Form.formatValues()
            //salvar
            Transaction.add(transaction)
            //apagar os dados do formulario
            Form.clearFields()
            // fechar Modal
            modal.close()
        } catch (error) {
            alert(error.message);
        }
    }
}

const App = {
    init () {
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload () {
        DOM.clearTransaction()

        App.init()
    },
}

App.init()

//End