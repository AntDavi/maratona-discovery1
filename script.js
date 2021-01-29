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

const transaction = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021'
    },
    {
        id: 2,
        description: 'Website',
        amount: 5000000,
        date: '23/01/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021'
    },
]

const Transaction = {
    incomes () {
        //somar as entradas
    },
    expenses () {
        //somar as saídas
    },
    total () {
        //entradas - saídas
    }
}

const DOM = {
    addTransaction (transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
    },
    innerHTMLTransaction (transaction) {

        

        const html = `
            <tr>
                <td class="description">Luz</td>
                <td class="expense">- R$ 500,00</td>
                <td class="date">23/01/2021</td>
                <td>
                    <img src="/assets/minus.svg" alt="Remover transação">
                </td>
            </tr>
        `
        return html
     }
}

DOM.addTransaction(transaction[0])