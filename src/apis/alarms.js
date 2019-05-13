module.exports = () => {
  let _alarms = [];
  return {
    fakeApi(browser) {
      const alarms = {
        create(name, alarmInfo) {
          if ((!name && !alarmInfo) || (typeof name !== 'object' && !alarmInfo)) {
            throw new Error('Error: Incorrect argument types for alarms.create.');
          }
          if (typeof name === 'object') {
            alarmInfo = name;
            name = '';
          } else {
            name = name ? name : '';
          }

          if (alarmInfo.periodInMinutes && !alarmInfo.when && !alarmInfo.delayInMinutes) {
            const alarm = {
              name,
              scheduledTime: Date.now() + (alarmInfo.periodInMinutes * 60 * 1000),
              periodInMinutes: null,
            };
            _alarms[name] = {alarm};

            _alarms[name].interval = setInterval(() => {
              if (!_alarms[name]) {
                return;
              }
              if (browser.alarms.onAlarm.addListener.callCount) {
                browser.alarms.onAlarm.addListener.yield(_alarms[name].alarm);
              }
              _alarms[name].alarm.scheduledTime = Date.now() + (alarmInfo.periodInMinutes * 60 * 1000);
            }, alarmInfo.periodInMinutes * 60 * 1000);
          } else {
            const alarm = {
              name,
              scheduledTime: alarmInfo.when ? alarmInfo.when : Date.now() + (alarmInfo.delayInMinutes * 60 * 1000),
              periodInMinutes: null,
            };
            _alarms[name] = {alarm};
            _alarms[name].timeout = setTimeout(() => {
              if (!_alarms[name]) {
                return;
              }
              if (browser.alarms.onAlarm.addListener.callCount) {
                browser.alarms.onAlarm.addListener.yield(_alarms[name].alarm);
              }
              if (!alarmInfo.periodInMinutes) {
                delete _alarms[name];
              } else {
                _alarms[name].alarm.scheduledTime = Date.now() + (_alarms[name].alarm.periodInMinutes * 60 * 1000);
                _alarms[name].interval = setInterval(() => {
                  if (!_alarms[name]) {
                    return;
                  }
                  if (browser.alarms.onAlarm.addListener.callCount) {
                    browser.alarms.onAlarm.addListener.yield(_alarms[name].alarm);
                  }
                  _alarms[name].alarm.scheduledTime = Date.now() + (_alarms[name].alarm.periodInMinutes * 60 * 1000);
                }, alarmInfo.periodInMinutes * 60 * 1000);
              }
            }, alarmInfo.when ? alarmInfo.when - Date.now() : alarmInfo.delayInMinutes * 60 * 1000);
          }
        },

        async get(name) {
          if (!_alarms[name]) {
            return;
          }
          return _alarms[name].alarm;
        },

        async getAll() {
          return _alarms.map(alarm => alarm.alarm);
        },

        async clear(name) {
          if (!_alarms[name]) {
            return false;
          }
          clearTimeout(_alarms[name].timeout);
          clearInterval(_alarms[name].interval);
          return delete _alarms[name];
        },

        async clearAll() {
          if (!_alarms.length) {
            return false;
          }
          _alarms.map(alarm => {
            alarms.clear(alarm.alarm.name);
          });
          return true;
        }
      };

      browser.alarms.create.callsFake(alarms.create);
      browser.alarms._create = alarms.create;
      browser.alarms.clear.callsFake(alarms.clear);
      browser.alarms._clear = alarms.clear;
      browser.alarms.clearAll.callsFake(alarms.clearAll);
      browser.alarms._clearAll = alarms.clearAll;
      browser.alarms.get.callsFake(alarms.get);
      browser.alarms._get = alarms.get;
      browser.alarms.getAll.callsFake(alarms.getAll);
      browser.alarms._getAll = alarms.getURL;
    }
  };
};