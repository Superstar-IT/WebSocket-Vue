export default {
  apis: {
    gus: {
      url: 'https://gus.rmcloud.com'
    },
    grandcentral: {
       url: 'https://voucher.rmcloud.com',
       wsUrl: 'wss://sockets.rmcloud.com'
    },
    auth0: {
      domain: 'redman.auth0.com',
      clientId: '4EgT2VamatiuGM9vT8FfNKJ58qIUC2nT',
      redirectUri: 'https://gus.rmcloud.com/login/admin/auth0/callback'
    }
  },
  notifications: {
    displayDuration: 1000 * 2 // 2 seconds
  },
  transitions: {
    duration: {
      fast: 150,
      medium: 300
    },
    elasticity: 250
  },
  initialCallDelay: 1000 * 2, // 2 seconds
  pingWebsocketInterval: Math.random() * (35000 - 20000) + 20000 // produce a random val between 20-35 seconds
}
