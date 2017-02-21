'use strict'

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.addResponse('provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('provide/instructions')

      client.updateConversationState({
        helloSent: true
      })

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
    client.addResponse('greeting', {name: "randy"})
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

const handleConfirmation = client.createStep({
satisfied() {
  return false
},

prompt() {
  client.addResponse('client_add/confirm', {company_name: "xyz"})
  client.done()
}
})

const handleSalesConfirmation = client.createStep({
satisfied() {
  return false
},

prompt() {
  client.addResponse('client_sale/confirmation', {company_name: "xyz"})
  console.log(client.addResponse)
  client.done()
}
})

const handleExpenseConfirmation = client.createStep({
satisfied() {
  return false
},

prompt() {
  console.log("MESSAGE PART", JSON.stringify(client.getEntities(client.getMessagePart(), 'company_name'), null, 4));
  client.addResponse('client_expense/confirmation', {company_name: "xyz"})
  client.done()
  //client.getmessageparts()
}
})

const handleThanks = client.createStep({
  satisfied() {
    return false
  },

  prompt() {
    client.addResponse('thanks')
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
    clientAdd: handleConfirmation,
    clientSale: handleSalesConfirmation,
    clientExpense:handleExpenseConfirmation,
    welcome: handleThanks,
    main: 'onboarding',
    onboarding: [sayHello],
    end: [untrained]
  }
})
}
