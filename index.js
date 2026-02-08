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


app.post('/visitor-sign-out', async (req, res) => {
  const envoy = req.envoy; // our middleware adds an "envoy" object to req.
  const job = envoy.job;
  const goodbye = envoy.meta.config.GOODBYE;
  const visitor = envoy.payload;
  const visitorName = visitor.attributes['full-name'];

  const message = `${goodbye} ${visitorName}!`;
  await job.attach({ label: 'Goodbye', value: 'User stayed past their allotted time' });
  
  res.send({ goodbye });
});



app.use(errorMiddleware());

const listener = app.listen(process.env.PORT || 0, () => {
  console.log(`Listening on port ${listener.address().port}`);
});

