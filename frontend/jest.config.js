// frontend/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // CSS, SCSS, etc.
    '\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // antd components
    '^antd/es/(.*)$': '<rootDir>/node_modules/antd/lib/$1',
    // Handle module aliases (if you have them in tsconfig.json)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    // Use ts-jest for ts/tsx files
    '^.+\.(ts|tsx)$': ['ts-jest', { 
        tsconfig: 'tsconfig.jest.json' 
    }],
    // Use babel-jest for js/jsx files (if any)
    '^.+\.(js|jsx)$': 'babel-jest',
  },
  // Ignore transform for node_modules, except for specific modules if needed
  transformIgnorePatterns: [
    '/node_modules/',
    '\.pnp\.[^\/]+$',
  ],
};
