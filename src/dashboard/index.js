const Discord = require('discord.js');

const config = require('../../Controller/dashboard.json');
const port = 8000;

const express = require('express');
const app = express();

const url = require('url');
const path = require('path');

const MongoStore = require('connect-mongo');
const passport = require('passport');
const session = require('express-session');

const Strategy = require('passport-discord').Strategy
const ejs = require('ejs');
const bodyParser = require('body-parser');
const moment = require('moment');

const minifyHTML = require('express-minify-html-terser');

const rateLimit = require('express-rate-limit');
const contactCooldown = new Set();

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  statusCode: 429,
  max: 50,
  message: 'Too many requests, please try again in a minute'
});

module.exports = async client => {
  app.use(express.static('src/dashboard/static'))
  const templateDir = path.resolve('src/dashboard/templates')
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((obj, done) => done(null, obj))
  passport.use(
    new Strategy(
      {
        clientID: config.client_id,
        clientSecret: config.client_secret,
        callbackURL: `${config.domain}/callback`,
        response_type: `token`,
        scope: ['identify', 'guilds']
      },
      (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => done(null, profile))
      }
    )
  )

  app.use(rateLimiter)
  app.use(
    session({
      secret:
        'aASDASDewwfSAFasdadasdasdasdasadasdasdwqd3242323yvu4vhy234hy2343v2h4234hjv23423hjb423hjb4234hjb324234324vj324234byjdasdasdadasdad',
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: Date.now() + 2629800000 },
      store: MongoStore.create({ mongoUrl: config.mongo_database_link })
    })
  )

  app.locals.moment = moment

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    req.session.backURL = req.url
    render(res, req, 'other/login/login.ejs')
  }
}

app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  })
)

app.enable('trust proxy')
app.use(passport.initialize())
app.use(passport.session())
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

const limit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again in a minute',
  statusCode: 429
})

const render = (res, req, template, data = {}) => {
  var hostname = req.headers.host
  var pathname = url.parse(req.url).pathname
  const websiteData = {
    client: client,
    hostname: hostname,
    pathname: pathname,
    path: req.path,
    user: req.isAuthenticated() ? req.user : null,
    url: res,
    req: req,
    config: config,
    https: 'https://',
    domain: config.domain
  }
  res.render(
    path.resolve(`${templateDir}${path.sep}${template}`),
    Object.assign(websiteData, data)
  )
}

app.get(
  '/login',
  (req, res, next) => {
    if (req.user) return res.redirect('/')
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer)
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path
      }
    } else {
      req.session.backURL = '/'
    }
    next()
  },
  passport.authenticate('discord', { prompt: 'none' })
)


app.get('/discord', (req, res) => {
  res.redirect('https://discord.gg/CV3fqUWb6U')
})

//invite endpoint
app.get('/invite', (req, res) => {
  res.redirect(
    'https://discord.com/api/oauth2/authorize?client_id=904355568431542302&permissions=8&scope=applications.commands%20bot'
  )
})

//invite api
app.get('/api/invite', (req, res) => {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl
  const redirect = new URL(url).searchParams.get('guild_id')
  if (redirect) {
    res.redirect(`/panel/${redirect}`)
  } else return res.json({ error: 'No guild ID requested' })
})

//policy
app.get('/policy', (req, res) => {
  return render(res, req, 'other/policy/policy.ejs')
})

//dashboard
app.get('/panel', checkAuth, (req, res) => {
  render(res, req, 'dashboard/dashboard.ejs', {
    perms: Discord.Permissions
  })
})

// dashboard endpoint (settings)
app.get('/panel/:guildID', checkAuth, async (req, res) => {
  const guild = client.guilds.cache.get(req.params.guildID)
  if (!guild) {
    res.status(500)
    return render(res, req, 'other/error/error.ejs', {
      error: 'Invalid Guild Provided'
    })
  }

  const member = guild.members.cache.get(req.user.id)
  if (!member) {
    res.status(500)
    return render(res, req, 'other/error/error.ejs', {
      error: 'You are not a member of this Guild'
    })
  }
  if (!member.permissions.has('MANAGE_GUILD')) {
    res.status(500)
    return render(res, req, 'other/error/error.ejs', {
      error: 'You are not allowed to view this Page'
    })
  }

  render(res, req, 'dashboard/dashboard/index.ejs', {
    guild: guild
  })
})


// dashboard endpoint for settings general page
app.get('/panel/:guildID/settings/', checkAuth, async (req, res) => {
  const guild = client.guilds.cache.get(req.params.guildID)
  if (!guild) {
    res.status(500)
    return render(res, req, 'other/error/error.ejs', {
      error: 'Invalid Guild Provided'
    })
  }

  const member = guild.members.cache.get(req.user.id)
  if (!member) {
    res.status(500)
    return render(res, req, 'other/error/error.ejs', {
      error: 'You are not a member of this Guild'
    })
  }
  if (!member.permissions.has('MANAGE_GUILD')) {
    res.status(500)
    return render(res, req, 'other/error/error.ejs', {
      error: 'You are not allowed to view this Page'
    })
  }

  if (!settings)
    return render(res, req, 'other/error/error.ejs', {
      error: 'Please wait a little and try again.'
    })

  render(res, req, 'dashboard/dashboard/settings/settings.ejs', {
    guild: guild,
    settings: settings,
    alert: null
  })
})

// dashboard endpoint for settings general page - post
app.post('/panel/:guildID/settings', checkAuth, async (req, res) => {
  const guild = client.guilds.cache.get(req.params.guildID)
  if (!guild) {
    res.status(500)
    return render(res, req, 'other/error/error.ejs', {
      error: 'Invalid Guild Provided'
    })
  }

  const member = guild.members.cache.get(req.user.id)
  if (!member) {
    res.status(500)
    return render(res, req, 'other/error/error.ejs', {
      error: 'You are not a member of this Guild'
    })
  }
  if (!member.permissions.has('MANAGE_GUILD')) {
    res.status(500)
    return render(res, req, 'other/error/error.ejs', {
      error: 'You are not allowed to view this Page'
    })
  }
})


// Callback endpoint
app.get(
  '/callback',
  passport.authenticate('discord', {
    failureRedirect: '/'
  }),
  (req, res) => {
    if (req.session.backURL) {
      const url = req.session.backURL
      req.session.backURL = null
      res.redirect(url)
    } else {
      res.redirect('/')
    }
  }
)

app.get('/api', function (req, res) {
  res.header('Content-Type', 'application/json')

  const obj = {
    guilds: client.guilds.cache.size,
    members: client.users.cache.size,
    roles: client.guilds.cache.size,
    channels: client.channels.cache.size,
    ping: client.ws.ping,
    uptime: client.uptime,
    ram: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
  }

  res.json(obj)
})

//status page
app.get('/status', (req, res) => {
  render(res, req, 'other/status/status.ejs', {})
});

//logout
app.get('/logout', function (req, res) {
  req.session.destroy(() => {
    req.logout()
    res.redirect('/')
  })
});

//contact
app.get('/contact', (req, res) => {
  if (!req.user) req.session.backURL = '/contact'
  render(res, req, 'other/contact/contact.ejs', {
    alert: null
  })
});

//contact post
app.post('/contact', checkAuth, (req, res) => {
  if (contactCooldown.has(req.user.id)) {
    return render(res, req, 'other/error/error.ejs', {
      error: 'You recently contacted us. Please wait a little and try again.'
    })
  };

  // Styling of the Embed being sent <username/id> + <message>
  const contact = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle(`📬 Contact Form`)
    .setDescription(`Someone just send a message to us!`)
    .addField(
      `👥 User`,
      `${req.user.username || 'Unknown'}/<@${req.user.id}> (ID: \`${req.user
        .id || 'Unknown'}\`)`
    )
    .addField(
      '📝 Message',
      `\`\`\`${req.body.message.substr(0, 2000) || 'None'}\`\`\``
    )
    .setTimestamp()

  //fill contact webhook here
  new Discord.WebhookClient(
    'webhook_id',
    'webhook_token'
  ).send({
    embeds: [contact]
  });

  // Cooldown for sending messages through the panel.
  contactCooldown.add(req.user.id)
  setTimeout(() => {
    contactCooldown.delete(req.user.id)
  }, 60000)
  render(res, req, 'other/contact/contact.ejs', {
    alert: true
  })
});

//main page
app.get('/', (req, res) => {
  render(res, req, 'index.ejs')
});

//404 page
app.use(function (req, res, next) {
  res.status(404)
  render(res, req, 'other/404/404.ejs')
});

//error page
app.use((error, req, res, next) => {
  console.warn(error.stack)
  res.status(500)
  render(res, req, 'other/500/500.ejs')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});