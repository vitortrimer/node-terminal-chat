export default class CliConfig {

  constructor({ username, hostUri, room }) {
    this.room = room;
    this.username = username;

    const { hostname, port, protocol } = new URL(hostUri);
    this.port = port;
    this.host = hostname;
    this.protocol = protocol.replace(/\W/, '');
  }

  static parseArgs(commands) {
    
    const cmd = new Map();
    for(const key in commands) {
      
      const index = parseInt(key);
      const command = commands[key];

      const commandPrefix = '--';
      if(!command.includes(commandPrefix)) continue;

      cmd.set(
        command.replace(commandPrefix, ''),
        commands[index + 1]
      );
    }

    return new CliConfig(Object.fromEntries(cmd));
  }
}