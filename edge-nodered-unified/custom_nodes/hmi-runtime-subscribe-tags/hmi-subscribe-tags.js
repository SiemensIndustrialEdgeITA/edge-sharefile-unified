const readline = require('readline');
const net = require('net');
const PIPE_PATH = '/tempcontainer/HmiRuntime';

module.exports = function (RED) {
  function HmiRuntimeSubscribeTagsNode(config) {
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

      subscribeTags();

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
      function subscribeTags() {
        // add all user defined tags to JSON object for subscription
        const tags = config.tags.split(' ');
        const subscribeTagsObject = { Message: 'SubscribeTag', Params: { Tags: tags }, ClientCookie: 'NodeRedCookieForSubscribeTags' };
        // convert JSON object to string and add \n
        const subscribeTagsCmd = JSON.stringify(subscribeTagsObject) + '\n';
        // subscribe
        client.write(subscribeTagsCmd);
      }
    }
  }

  RED.nodes.registerType('hmi-subscribe-tags', HmiRuntimeSubscribeTagsNode);
};

