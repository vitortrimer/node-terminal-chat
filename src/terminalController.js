import ComponentsBuilder from './components.js';
import { constants } from './constants.js';


export default class TerminalController {
  #usersColors = new Map();

  constructor() {}

  #pickColor() {
    return '#' + ((1 << 24) * Math.random() | 0).toString(16) + '-fg';
  };

  #getUserColor(userName) {
    if(this.#usersColors.has(userName)) {
      return this.#usersColors.get(userName)
    }

    const color = this.#pickColor();
    this.#usersColors.set(userName, color);

    return color
  }

  #onInputReceived(eventEmitter) {
    return function() {
      const message = this.getValue();
      this.clearValue();
    }
  };

  #onMessageReceived({ screen, chat }) {
    return msg => {
      const { userName, message } = msg;
      const color = this.#getUserColor(userName);

      chat.addItem(`{${color}}{bold}${userName}{/}: ${message}`);
      screen.render();
    };
  };

  #onLogChanged({ screen, activityLog }) {
    return msg => {
      const [userName] = msg.split(/\s/);
      const color = this.#getUserColor(userName);

      activityLog.addItem(`{${color}}{bold}${msg.toString()}{/}`);

      screen.render();
    };
  };

  #onStatusChanged({ screen, status }) {
    return users => {
      const { content } = status.items.shift();
      status.clearItems();
      status.addItem(content);

      users.forEach(userName => {
        const color = this.#getUserColor(userName);
        status.addItem(`{${color}}{bold}${userName}{/}`);
      });

      screen.render();
    };
  };

  #registerEvents(eventEmitter, components) {
    eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components));
    eventEmitter.on(constants.events.app.ACTIVITY_LOG_UPDATED, this.#onLogChanged(components));
    eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components));
  };

  async initializeTable(eventEmitter) {
    const components = new ComponentsBuilder()
      .setScreen({title: 'Dollars Chat'})
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponent()
      .setActivityLogComponent()
      .setStatusComponent()
      .build();

    this.#registerEvents(eventEmitter, components);

    components.input.focus();
    components.screen.render();

    setInterval(() => {
      eventEmitter.emit(constants.events.app.ACTIVITY_LOG_UPDATED, 'vtr joined');
      eventEmitter.emit(constants.events.app.ACTIVITY_LOG_UPDATED, 'dttk joined');
      eventEmitter.emit(constants.events.app.ACTIVITY_LOG_UPDATED, 'trimer joined');
      eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { userName: 'vtr', message: 'um dois' });
      eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { userName: 'dttk', message: 'tres quatro' });
      eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { userName: 'trimer', message: 'cinco seis' });
    }, 1000);


    const users = ['vtr'];
    eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
    users.push('dttk');
    eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
    users.push('trimer');
    eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
    users.push('hummm');
    eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
    users.push('MAiusculo');
    eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
    users.push('LULZ');
    eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
  }

}