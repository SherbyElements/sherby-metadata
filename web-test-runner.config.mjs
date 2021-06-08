import {chromeLauncher} from '@web/test-runner-chrome';

export default {
  nodeResolve: true,
  coverage: true,
  files: [
    "test/**/*.test.js"
  ],
  browsers: [
    chromeLauncher({
      launchOptions: {
        executablePath: '/usr/bin/google-chrome'
      },
    }),
  ],
};
