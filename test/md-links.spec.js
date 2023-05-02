// const mdLinks = require('../');
const { getStats } = require('../src/index');

const arrayLinks = [{
  href: 'https://www.google.com/',
},
{
  href: 'https://reqres.in/api/users/34',
}];

describe('getStats', () => {
    it('it a function', () => {
        expect(typeof getStats).toBe('function');
    });
    
    it('should return a string with total and unique links', () => {
    const result = getStats(arrayLinks);
    expect(result).toEqual('Total: 2\nUnique: 2');
  });
});
