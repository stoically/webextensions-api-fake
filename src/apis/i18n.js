module.exports = options => {
  const _locales = options.locales;
  const _defaultLocale = options.default_locale;
  let _uiLanguage = 'en-US';
  let _acceptLanguages = ['en-US'];
  return {
    fakeApi(browser) {
      const _i18n = {
        getMessage: (messageName, substitutions = []) => {
          if (!_locales) {
            // eslint-disable-next-line no-console
            console.error('No locales found');
            return '';
          }
          if (!Array.isArray(substitutions)) {
            substitutions = [substitutions];
          }
          const _substitute = message => {
            let _message = message.message;
            substitutions.forEach((substitution, substitutionKey) => {
              _message = _message.replace(`$${substitutionKey+1}`, substitution);
            });
            if (!message.placeholders) {
              return _message;
            }
            Object.keys(message.placeholders).map(placeholder => {
              let _content = message.placeholders[placeholder].content;
              substitutions.forEach((substitution, substitutionKey) => {
                _content = _content.replace(`$${substitutionKey+1}`, substitution);
              });
              _message = _message.replace(`$${placeholder.toUpperCase()}$`, _content);
            });
            return _message;
          };
          if (_locales[_uiLanguage] && _locales[_uiLanguage][messageName]) {
            return _substitute(_locales[_uiLanguage][messageName]);
          }
          const _uiLanguageRegionless = _uiLanguage.split('-')[0];
          if (_uiLanguageRegionless !== _uiLanguage && _locales[_uiLanguageRegionless] &&
              _locales[_uiLanguageRegionless][messageName]) {
            return _substitute(_locales[_uiLanguageRegionless][messageName]);
          }
          if (_locales[_defaultLocale] && _locales[_defaultLocale][messageName]) {
            return _substitute(_locales[_defaultLocale][messageName]);
          }
          return '';
        }
      };

      browser.i18n.getMessage.callsFake(_i18n.getMessage);
      browser.i18n._getMessage = _i18n.getMessage;
      browser.i18n.getAcceptLanguages.callsFake(() => _acceptLanguages);
      browser.i18n._getAcceptLanguages = browser.i18n.getAcceptLanguages;
      browser.i18n._setAcceptLanguages = acceptLanguages => {
        _acceptLanguages = acceptLanguages;
      };
      browser.i18n.getUILanguage.callsFake(() => _uiLanguage);
      browser.i18n._getUILanguage = browser.i18n.getUILanguage;
      browser.i18n._setUILanguage = uiLanguage => {
        _uiLanguage = uiLanguage;
      };
      browser.i18n.detectLanguage.callsFake(async () => _uiLanguage);
      browser.i18n._detectLanguage = browser.i18n.detectLanguage;
    }
  };
};