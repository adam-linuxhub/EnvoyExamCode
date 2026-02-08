const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');
const app = express();
app.use(middleware());


app.post('/validate-me', (req, res) => {
  const {
    envoy: {
      payload: {
        num_minutes,
      },
    }
  } = req;

  if (isNaN(num_minutes) || num_minutes < 0 || num_minutes > 180) 
  {
    res.sendFailed('Minutes must be a number between 0 and 180');
  }
  else
  {
    res.send({ num_minutes, bar: 'Success',});
  }


});

app.post('/visitor-sign-in', async (req, res) => {
  const envoy = req.envoy; // our middleware adds an "envoy" object to req.
  const job = envoy.job;
  const hello = envoy.meta.config.HELLO;
  const num_minutes = envoy.meta.config.num_minutes;
  const visitor = envoy.payload;
  const visitorName = visitor.attributes['full-name'];
  
  const message = `${num_minutes} ${visitorName}!`;; // our custom greeting
  await job.attach({ label: 'Hello', value: message }); // show in the Envoy dashboard.
  
  res.send({ hello });
});

app.post('/visitor-sign-out', async (req, res) => {
  const envoy = req.envoy; // our middleware adds an "envoy" object to req.
  const job = envoy.job;
  const goodbye = 'aaaaaaaaa';//envoy.meta.config.GOODBYE;
  const visitor = envoy.payload;
  const visitorName = visitor.attributes['full-name'];

  const message = 'user stayed later';//`${goodbye} ${visitorName}!`;
  await job.attach({ label: 'Goodbye', value: message });
  
  res.send({ goodbye });
});



app.use(errorMiddleware());

const listener = app.listen(process.env.PORT || 0, () => {
  console.log(`Listening on port ${listener.address().port}`);
});

