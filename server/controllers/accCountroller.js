

module.exports =  {
    createAcc: async(req, res) => {
        const db = req.app.get('db')
        const { account_number, customer_id, account_type, balance } = req.body

        const newAccount = await db.accounts.create_account([account_number, customer_id, account_type, balance])
        res.status(200).send(newAccount); 
    },
    getAccounts: async(req, res) => {
        const db = req.app.get('db')
        const { customer_id } = req.params

        await db.accounts.get_accounts(customer_id)
        .then(response => res.status(200).send(response))
    }, 
    getTransactions: async(req, res) => {
        const db = req.app.get('db') 
        const { account_number } = req.params
        console.log('accCTRL 21 ', account_number)

        await db.transactions.get_transactions(account_number)
        .then(transactions => res.status(200).send(transactions))
    }
}