const readline = require('readline');
const net = require('net');
const PIPE_PATH = '/tempcontainer/HmiRuntime';

module.exports = function (RED) {
  function HmiRuntimeSubscribeAlarmsNode(config) {
    RED.nodes.createNode(this, config);

    // JSON object for output message of this node
    const msg = { payload: {} };

    const node = this;

    let client = net.connect(PIPE_PATH, ConnectFunction);

    function ConnectFunction() {
      node.log('Socket connection to /tempcontainer/HmiRuntime successfully established.');

      //Wait 10s to reconnect with no pipe connection is possible
      client.on('end', function () {
        node.log('Socket connection has been closed. Try to reconnect.');
        setTimeout(() => {
          client = net.connect(PIPE_PATH, ConnectFunction);
        }, 10000);
      });

      subscribeAlarms();

      const rl = readline.createInterface({
        input: client,
        crlfDelay: Infinity
      });
      // Unified response
      rl.on('line', (line) => {
        msg.payload = JSON.parse(line);
        node.send(msg);
      });
      //Unified request
      function subscribeAlarms() {
        //Evaluate parameter from node
        const systemnames = config.systemname.split(' ');
        const languageIdParse = parseInt(config.languageid, 10);
        // add all user defined tags to JSON object for subscription
        const subscribeAlarmsObject = { Message: 'SubscribeAlarm', Params: { SystemNames: systemnames, Filter: config.filter, LanguageId: languageIdParse }, ClientCookie: 'NodeRedCookieForSubscribeAlarms' };
        // convert JSON object to string and add \n
        const subscribeAlarmsCmd = JSON.stringify(subscribeAlarmsObject) + '\n';
        // subscribe
        client.write(subscribeAlarmsCmd);
      }
    }
  }
    RED.nodes.registerType('hmi-subscribe-alarms', HmiRuntimeSubscribeAlarmsNode);
  };
