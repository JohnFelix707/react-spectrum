import assert from 'assert';
import {getLocale, messageFormatter, setLocale} from '../../src/utils/intl';

let formatMessage = messageFormatter({
  'en-US': {
    'hello': 'Hello',
    'formatting': 'Hello {0} world'
  },
  'fr-FR': {
    'hello': 'Bonjour'
  }
});

describe('intl utils', () => {
  let currentLocale = getLocale();
  after(() => {
    setLocale(currentLocale);
  });

  it('should default to the current browser locale', () => {
    assert.equal(getLocale(), 'en-US');
  });

  it('should set the locale', () => {
    setLocale('fr-FR');
    assert.equal(getLocale(), 'fr-FR');
  });

  it('should setup a message formatter and get a message in the current locale', () => {
    setLocale('en-US');
    assert.equal(formatMessage('hello'), 'Hello');

    setLocale('fr-FR');
    assert.equal(formatMessage('hello'), 'Bonjour');
  });

  it('should fall back to english', () => {
    setLocale('xyz');
    assert.equal(formatMessage('hello'), 'Hello');
  });

  it('should format a message with variables', () => {
    setLocale('en-US');
    assert.equal(formatMessage('formatting', ['cruel']), 'Hello cruel world');
  });

  it('should throw if a string is not available', () => {
    assert.throws(() => {
      assert.equal(formatMessage('xyz'), 'Hello');
    });
  });
});
