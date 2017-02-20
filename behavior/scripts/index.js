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
    client.addResponse('greeting', {name: "Penis"})
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


const handleConfirmation = client.createStep({
satisfied() {
  return false
},

prompt() {
  client.addResponse('client_add/confirm', {company_name: "xyz"})
  client.done()
}
})

client.runFlow({
  classifications: {
    goodbye: 'goodbye',
    greeting: 'greeting',
    "add/client": 'addClient'
    },

  streams: {
    goodbye: handleGoodbye,
    greeting: handleGreeting,
    addClient: handleConfirmation,
    main: 'onboarding',
    onboarding: [sayHello],
    end: [untrained]
  }
})
}
