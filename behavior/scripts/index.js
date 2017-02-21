'use strict'
var axios = require('axios')
var hostName = 'https://decode-bot-project-sql-ajdez.c9users.io'

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.addResponse('provide/documentation', {documentation_link: 'http://docs.init.ai'})
      client.addResponse('provide/instructions')

      client.updateConversationState({helloSent: true})

      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('apology/untrained')
      client.done()
    }
  })

  const handleGreeting = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('greeting')
      client.done()
    }
  })

  const handleGoodbye = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('goodbye')
      client.done()
    }
  })

  const handleAddClient = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('add/client')
      client.done()
    }
  })

  const handleAddConfirmation = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      const company = client.getFirstEntityWithRole(client.getMessagePart(), 'company_name')
      client.addResponse('client_add/confirm', {company_name:company.value})
      client.done()
    }
  })

  const handleSalesConfirmation = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      const company = client.getFirstEntityWithRole(client.getMessagePart(), 'company_name')
      const amount = client.getFirstEntityWithRole(client.getMessagePart(), 'amount_of_money')
      console.log('XXXXXXXXXX', company, amount);
      client.addResponse('client_sale/confirmation', {company_name:company.value, amount_of_money:amount.value})
      client.done()
    }
  })

  const handleExpenseConfirmation = client.createStep({

    satisfied() {
      return false
    },
    prompt() {
      const company = client.getFirstEntityWithRole(client.getMessagePart(), 'company_name')
      const amount = client.getFirstEntityWithRole(client.getMessagePart(), 'amount_of_money')
      axios.get(`${hostName}/company?name=${company.value}`)
      .then(function(res){
        //assuming some data structure on res
        var companies = res.data
        console.log(companies)
        if(companies.length < 1){
          client.addResponse('You dumbnutz');
          client.done();
        }
        if (companies.length === 1){
          var companyID = companies[0].id
          axios.post('/companies/:id/expenses' , {companyID:companyID , amount: amount.value})
          client.addResponse('client_expense/confirmation', {company_name:company.value, amount_of_money:amount.value})
          client.done()
        }
        if (companies.length > 1) {

        }
      })
      .catch(err => console.log(err))

      /*
      1. Find the company ID based on the name (GET /companies?name={comapny1})
        2a: if there is no company, addResponse to tell the user hes stupid
        2b: if there is only one, then get its ID and move to step 3
        2c: if tehre are more than one, then give the user some opshunz with addResponseWithButtons
      3. Inser the expense by POST /companies/:id/expenses or POST /expenses {companyId: 1, amount: 100}
      4. Respond with a confirmation
      */

    }
  })

  const handleThanks = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('thanks Boo')
      client.done()
    }
  })

  client.runFlow({
    classifications: {
      goodbye: 'goodbye',
      greeting: 'greeting',
      "add/client": 'clientAdd',
      "client/sale": 'clientSale',
      "client/expense": 'clientExpense',
      thanks: 'welcome'

    },

    streams: {
      goodbye: handleGoodbye,
      greeting: handleGreeting,
      clientAdd: handleAddConfirmation,
      clientSale: handleSalesConfirmation,
      clientExpense: handleExpenseConfirmation,
      welcome: handleThanks,
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained]
    }
  })
}
