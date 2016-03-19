FlameBot
===

###Introduction

I made a bot that interfaces with the Tinder API where it auto-likes potential matches and periodically sends initial messages to new uncontacted matches. I mainly did this as a thought experiment and as a way to get more familiar with node.js. I in no way intend to use this code for monetary gain, but just as a time-saving personal enterprise.

###Acknowledgements

I want to thank the people responsible for [tinderjs](https://github.com/alkawryk/tinderjs), [tinderauth](https://github.com/tinderjs/tinderauth), and [underscore-node](https://www.npmjs.com/package/underscore-node). Their projects have saved me countless hours getting this operational.

###Caveats

Tinder needs your Facebook credentials which this code obtains in a programmatic way. Know that this might violate both Tinder's and Facebook's terms of service. In fact the node module I use to achieve this [tinderauth](https://github.com/tinderjs/tinderauth) warns it's users about this possiblity.

###System Dependencies

You will need the following on your system:

* Node.js
* Npm

###Setup

Once the system dependencies are installed go into the root of the project and run:

```bash
npm install
```
You wil also need to setup your Facebook login information as environmental variables in your .bashrc file which is described in the [tinderauth](https://github.com/tinderjs/tinderauth) README.

In order to run the messaging service successfully you will need to create a messages.json file in the root of the project which you can put in an array of messages which the bot will randomly select one to send to a new match. An example json file can be seen below:

```javascript
{
   "textChoices": [
      "Hi ;)",
      "Enjoying the weather?"
   ]
}
``` 

###Running the Bot

You can run the bot by issuing this command when you are in the root of the project:

```bash
node bot.js
```

This will run two services. The first service will request recommendations from the Tinder API and "like" the recs returned. There are console.logs in place where you can see the JSON payloads of the users found and when the bot has liked them. The second service will periodically request your user data and iterate through your past matches and send an initial message if no previous interaction has occured.

### CLI Options

Running 

```bash
node bot.js msg
```

Will just run the messaging service once and then terminate the bot.

###Contributing

I am open to contributors to this project and would love input on how to make it better. Please read through the existing issues before posting yours to avoid duplicates. Feel free to issue pull requests and I will be sure to review them promptly.
