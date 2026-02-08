const express = require('express');
const { middleware, errorMiddleware } = require('@envoy/envoy-integrations-sdk');
const app = express();
app.use(middleware());

// Validation
app.post('/validate-me', (req, res) => {
  const envoy = req.envoy;
  const payload = envoy.payload;
  const num_minutes = payload.num_minutes;
  
  if (isNaN(num_minutes) || num_minutes < 0 || num_minutes > 180) 
  {
    res.sendFailed('Minutes must be a number between 0 and 180');
  }
  else
  {
    res.send({ num_minutes, bar: 'Success',});
  }


});

// Sign-in
app.post('/visitor-sign-in', async (req, res) => {
  
  const envoy = req.envoy;
  const job = envoy.job;
  const num_minutes = envoy.meta.config.num_minutes;
   
  res.send({ num_minutes });
});

// Sign out - Show a message indicating whether the visitor stayed within the allotted time or not
app.post('/visitor-sign-out', async (req, res) => {
  const envoy = req.envoy; 
  const job = envoy.job;
  const visitor = envoy.payload;
  const num_minutes = envoy.meta.config.num_minutes;          // Number of minutes allowed from the config
  const signed_in = visitor.attributes['signed-in-at'];   // Signed-in time
  const signed_out = visitor.attributes['signed-out-at']; // Signed-out time
  const start = new Date(signed_in);  
  const end = new Date(signed_out);
  const diffMinutes = Math.floor((end - start) / (1000 * 60)); // Calculating the difference in minutes

  const message = `Visitor stayed within the allotted time  - ${diffMinutes} {signed_in} {signed_out} {num_minutes} {start} {end}`;
  if(diffMinutes > num_minutes)
  {
    message = `Visitor stayed over the allotted time  - ${diffMinutes}`;
  } 

  await job.attach({ label: 'Visitor Details', value: message });
  
 // res.send({ num_minutes });
});



app.use(errorMiddleware());

const listener = app.listen(process.env.PORT || 0, () => {
  console.log(`Listening on port ${listener.address().port}`);
});

