import * as λ from '../src';

test('trim output is a string without white characters around it.', () => {
  expect(λ.trim(' a ')).toBe('a');
  expect(λ.trim(' a \n ')).toBe('a');
});

test('testRegEx outputs true if string b passes regular expression a.', () => {
  expect(λ.testRegEx(/[a-z]/)('7urtle')).toBe(true);
  expect(λ.testRegEx(/[0-9]/)('1')).toBe(true);
  expect(λ.testRegEx(/[0-9]/)('abc')).toBe(false);
  expect(λ.testRegEx(/[a-z]/)('7urtle')).toBe(λ.testRegEx(/[a-z]/, '7urtle'));
});

test('substr outputs substring based on provided string, start and limit.', () => {
  expect(λ.substr(3)(1)('7urtle')).toBe('urt');
  expect(λ.substr(1)(0)('7urtle')).toBe('7');
  expect(λ.substr(1)(-1)('7urtle')).toBe('e');
  expect(λ.substr(1)(1)('7urtle')).not.toBe('7');
  expect(λ.substr(3)(1)('7urtle')).toBe(λ.substr(3, 1, '7urtle'));
});

test('firstLetterOf outputs the first letter of a provided string.', () => {
  expect(λ.firstLetterOf('7urtle')).toBe('7');
  expect(λ.firstLetterOf('1')).toBe('1');
  expect(λ.firstLetterOf('')).toBe('');
});

test('lastLetterOf outputs the last letter of a provided string.', () => {
  expect(λ.lastLetterOf('7urtle')).toBe('e');
  expect(λ.lastLetterOf('1')).toBe('1');
  expect(λ.lastLetterOf('')).toBe('');
});

test('startsWith outputs true if an input string starts with provided string.', () => {
  expect(λ.startsWith('7')('7urtle')).toBe(true);
  expect(λ.startsWith('7urtl')('7urtle')).toBe(true);
  expect(λ.startsWith('8urtl')('7urtle')).toBe(false);
  expect(λ.startsWith('7')('7urtle')).toBe(λ.startsWith('7', '7urtle'));
});

test('endsWith outputs true if an input string ends with provided string.', () => {
  expect(λ.endsWith('e')('7urtle')).toBe(true);
  expect(λ.endsWith('urtle')('7urtle')).toBe(true);
  expect(λ.endsWith('urtls')('7urtle')).toBe(false);
  expect(λ.endsWith('e')('7urtle')).toBe(λ.endsWith('e', '7urtle'));
});

test('repeat outputs new string repeating input string inputted count of times.', () => {
  expect(λ.repeat(2)('7urtle')).toBe('7urtle7urtle');
  expect(λ.repeat(1)('7urtle')).toBe('7urtle');
  expect(λ.repeat(0)('7urtle')).toBe('');
  expect(λ.repeat(2)('7urtle')).toBe(λ.repeat(2, '7urtle'));
});

test('replace outputs new string replacing input substring with input replacement string in input string.', () => {
  expect(λ.replace('8')('7')('7urtle')).toBe('8urtle');
  expect(λ.replace('7')('')('7urtle')).toBe('77urtle');
  expect(λ.replace('')('7')('7urtle')).toBe('urtle');
  expect(λ.replace('8')('9')('7urtle')).toBe('7urtle');
  expect(λ.replace('8')('7')('7urtle')).toBe(λ.replace('8', '7', '7urtle'));
});

test('search outputs position of input substring or regular expression withing input string or undefined if it is not found.', () => {
  expect(λ.search('7')('7urtle')).toBe(0);
  expect(λ.search('e')('7urtle')).toBe(5);
  expect(λ.search('rt')('7urtle')).toBe(2);
  expect(λ.search(/URT/i)('7urtle')).toBe(1);
  expect(λ.search('8')('7urtle')).toBe(undefined);
  expect(λ.search('8')('7urtle')).toBe(λ.search('8', '7urtle'));
});

test('split outputs and array of an input string split by the input substring.', () => {
  const split = λ.split(' ')('7urtles are awesome');
  expect(split[0]).toBe('7urtles');
  expect(split.length).toBe(3);
  expect(λ.split('/')('7urtles are awesome')[0]).toBe('7urtles are awesome');
  expect(λ.split('')('7urtles').length).toBe(7);
  expect(λ.split('/')('7urtles are awesome')).toEqual(λ.split('/', '7urtles are awesome'));
});

test('lowerCaseOf outputs the lower case version of input string.', () => {
  expect(λ.lowerCaseOf('MaRTiN')).toBe('martin');
  expect(λ.lowerCaseOf('PŘÍŠERNĚ ŽLUŤOUČKÝ KŮŇ ÚPĚL ĎÁBELSKÉ ÓDY')).toBe('příšerně žluťoučký kůň úpěl ďábelské ódy');
});

test('upperCaseOf outputs the upper case version of input string.', () => {
  expect(λ.upperCaseOf('MaRTiN')).toBe('MARTIN');
  expect(λ.upperCaseOf('příšerně žluťoučký kůň úpěl ďábelské ódy')).toBe('PŘÍŠERNĚ ŽLUŤOUČKÝ KŮŇ ÚPĚL ĎÁBELSKÉ ÓDY');
});