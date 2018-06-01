module.exports = wallaby => {
  return {
    files: [
      'src/*.js'
    ],
    tests: [
      '__tests__/*.js'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'jest',
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    }
  }
}
