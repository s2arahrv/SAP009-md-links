// const mdLinks = require('../');
const { mdLinks, fileExists, checkPath, getLinks, validate, getStats, validateStats, getStatus } = require('../src/index');
const fs = require('fs');
const errorMessage = require('../src/error');

// jest.mock('fs', () => ({
//   promises: {
//     readFile: jest.fn().mockResolvedValue(fileContent),
//   }
// }));

// jest.mock('fs/promises')

const filePath = 'test/example.md'
const relativeFilePath = 'test\\example.md'

const arrayLinks = [{
  text: 'google',
  href: 'https://www.google.com/',
  file: 'test\\example.md',
  ok: 'OK',
  status: 200,
},
{
  text: 'invalidlink',
  href: 'https://reqres.in/api/users/34',
  file: 'test\\example.md',
  ok: 'FAIL',
  status: 404,
},
{
  text: 'not found',
  href: 'http://www.dundermifflin.com.br/',
  file: 'test\\example.md',
  ok: 'FAIL',
  status: 'ENOTFOUND',
 }
];

const mdArray = [{
  text: 'google',
  href: 'https://www.google.com/',
  file: 'test\\example.md',
},
{
  text: 'invalidlink',
  href: 'https://reqres.in/api/users/34',
  file: 'test\\example.md',
},
 {
  text: 'not found',
  href: 'http://www.dundermifflin.com.br/',
  file: 'test\\example.md'
 }];

describe('checkPath', () => {
  it('should return the relative path if path is md', () => {
    const result = checkPath(filePath)
    expect(result).toEqual(relativeFilePath)
  })

  it('should return an error if path is not a file', () => {
    const notPath =  'test'
    const result = checkPath(notPath)
    expect(result).toEqual(errorMessage)
  })

  it('should return filePath', () => {
    const result = checkPath(relativeFilePath)
    expect(result).toEqual(relativeFilePath)
  })
})

describe('getLinks', () => {
  it('it a function', () => {
    expect(typeof getLinks).toBe('function');

    return getLinks(filePath).then((result) => {
      expect(result).toEqual([{
        text: 'google',
        href: 'https://www.google.com/',
        file: 'test/example.md',
      },
      {
        text: 'invalidlink',
        href: 'https://reqres.in/api/users/34',
        file: 'test/example.md',
      },
      {
        text: 'not found',
        href: 'http://www.dundermifflin.com.br/',
        file: 'test/example.md'
       }])
    })
});
})

describe('mdLinks', () => {
  it('it is a true path', () => {
    expect(fileExists(filePath)).toBe(true)
  })

  it('should reject the promise if link does not exist', () => {
    expect(mdLinks('bobo.md', {})).rejects.toEqual(errorMessage)
  })

  it('should return an array of objects for each link', () => {
    return mdLinks(filePath, {}).then((result) => {
      expect(result).toEqual(mdArray)
    })
  })

  // it('should return stats with total and unique links if stats is true', () => {
  //   return mdLinks(filePath, { stats: true }).then((result) => {
  //     expect(result).toEqual(`Total: 3\nUnique: 3`)
  //   })
// })

  it('should return an object of validated links if validate is true', () => {
    return mdLinks(filePath, { validate: true }).then((result) => {
      expect(result).toEqual(arrayLinks)
    })
  })
})

describe('validate', () => {
  it('it a function', () => {
    expect(typeof validate).toBe('function');
});

  it('should return an object with link properties, status and ok', () => {
    const links = getLinks(filePath)
    return validate(links).then((result) => {
      expect(result).toEqual([{
        text: 'google',
        href: 'https://www.google.com/',
        file: 'test/example.md',
        ok: 'OK',
        status: 200,
      },
      {
        text: 'invalidlink',
        href: 'https://reqres.in/api/users/34',
        file: 'test/example.md',
        ok: 'FAIL',
        status: 404,
      },
      {
        text: 'not found',
        href: 'http://www.dundermifflin.com.br/',
        file: 'test/example.md',
        ok: 'FAIL',
        status: 'ENOTFOUND',
       }
      ])
    })
  })
});

describe('getStats', () => {
    it('it a function', () => {
        expect(typeof getStats).toBe('function');
    });
    
    it('should return a string with number of total and unique links', () => {
    const result = getStats(arrayLinks);
    expect(result).toEqual('Total: 3\nUnique: 3');
  });
});

describe('validateStats', () => {
  it('should return a string with number of broken links', () => {
    const result = validateStats(arrayLinks);
    expect(result).toEqual('Broken: 2')
  })
})