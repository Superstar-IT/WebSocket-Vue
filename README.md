# gabbi.ai

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

# About Versioning and When To Upgrade
When to do a minor upgrade:
- When an enhancement or bug fix that directly relates to the most recently
published major version is released.

When to do a major upgrade:
- When a new feature is released or when an enhancement or bug fix to a feature
that was published _earlier_ than the current major version is released.

# How to Deploy
- `npm run build`
- copy contents of ./dist folder to S3 gabbi-vue/app bucket
- invalidate app.gabbi.vue in Cloudfront