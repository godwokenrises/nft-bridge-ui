
# Node polyfills issue

### The problem

Since Vite doesn't provide Node.js polyfills by default, we need to configure it by ourselves, as our `up-ckb` and `@lay2/pw-core` libraries need those polyfills to work.

The problem is that Vite itself has undergone several major upgrades, and many of the old Node.js polyfills solutions have since ceased to work, causing us a lot of headaches when searching for useful information.

While the problem seems clear and there are solutions on the Internet, the real deal is that we need a clean solution that doesn't impact (affect) the project structure, so when any major changes need to be made, we can implement them quickly.

### Trying to resolve

I searched the web for a bit, and found some potentially usable plugins for Vite:
- [vite-plugin-ngmi-polyfill](https://github.com/grikomsn/vite-plugin-ngmi-polyfill)
- [vite-plugin-node-polyfills](https://github.com/voracious/vite-plugin-node-polyfills)
- [vite-plugin-node-stdlib-browser](https://github.com/sodatea/vite-plugin-node-stdlib-browser)

But after several rounds of testing, I found some issues with these plugins, which is not a good news. 

The situation is, some plugins don't cover all the polyfills I need, so the development mode won't work with them. Besides that, some plugins are fine in the development mode, but the built pages throw `n is not a constructor` errors.

This part can be frustrating since we're occurring new problems while solving them, like we're sinking into new loops while trying to break out of them.

### Trying CRA instead

After tested on those Vite plugins, I thought it might be easier if we just create a new project with `create-react-app@latest` instead of using `vite@3` like in this current project, since the project's major goal is to test the functionality of UniPass SDKs. 

Obviously that didn't go well, because `create-react-app@5` (the latest version) uses `webpack@5` which also happened to removed supports for Node.js polyfills. This seems to be the trend in the world of compilers. 

However, I did manage to make the project worked with `create-react-app@4`, although it needs help from the `craco` library, to apply babel-presets when building the project. I won't go into any more details about how it's done though, because that's not what we're talking about here.

### Finally, solve the issue

When I went back to fix the issues in the vite project, I thought the `n is not a constructor` errors in the built pages are more likely to be fixed. So I searched for the relevant issues of it, and people did discuss about it:
- [[StackOverflow] Vite production build errors: `...is not a constructor' for node_modules](https://stackoverflow.com/questions/70454977/vite-production-build-errors-is-not-a-constructor-for-node-modules)
- [[GitHub] Build issues with v3. TypeError: Class extends value undefined is not a constructor or null](https://github.com/vitejs/vite/issues/9703#issuecomment-1216662109)

Turns out this problem is actually caused by the `@rollup/plugin-commonjs` plugin used in Vite 3, and we can resolve this issue by simply update the `vite.config.ts` file like below:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: { include: [] },
  },
  optimizeDeps: {
    disabled: false,
  },
});
```
