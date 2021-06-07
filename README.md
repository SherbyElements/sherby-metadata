# \<sherby-metadata\>

[![npm](https://img.shields.io/npm/v/@sherby/sherby-metadata?logo=npm)](https://www.npmjs.com/package/@sherby/sherby-metadata)
[![GitHub](https://img.shields.io/github/v/release/SherbyElements/sherby-metadata?label=GitHub&logo=github&sort=semver)](https://github.com/SherbyElements/sherby-metadata/releases)
[![webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/SherbyElements/sherby-metadata)
[![MIT License](https://img.shields.io/npm/l/@sherby/sherby-metadata)](https://github.com/SherbyElements/sherby-metadata/blob/master/LICENSE.md)
[![Number of downloads](https://img.shields.io/npm/dt/@sherby/sherby-metadata)](https://npm-stat.com/charts.html?package=%40sherby%2Fsherby-metadata)
[![BundlePhobia](https://img.shields.io/bundlephobia/minzip/@sherby/sherby-metadata)](https://bundlephobia.com/result?p=@sherby/sherby-metadata)
[![Travis CI](https://travis-ci.org/SherbyElements/sherby-metadata.svg?branch=master)](https://travis-ci.org/SherbyElements/sherby-metadata)
[![Codecov](https://codecov.io/gh/SherbyElements/sherby-metadata/branch/master/graph/badge.svg)](https://codecov.io/gh/SherbyElements/sherby-metadata)
[![Codacy](https://api.codacy.com/project/badge/Grade/840f4666b46643ebb15d844527e57bc4)](https://app.codacy.com/gh/SherbyElements/sherby-metadata)

`sherby-metadata` is a **LitElement** used to manage meta tags data for
_Search Engine Optimization_ (SEO). It will add, update and remove `<meta>`
elements to the `<head>` section based on the JSON object passed to it.

## Installation

```bash
npm install @sherby/sherby-metadata
```

## Use

To use this element, import it in your shell component and add a `sherby-metadata` element
in your component template.

```html
<sherby-metadata .data="${data}"></sherby-metadata>

<!-- Or alternatively if you want to dispatch events: -->
<sherby-metadata></sherby-metadata>
```

To update the meta tags on your page, you can update the data property in your shell
component or you can dispatch a `sherby-metadata` event:

```javascript
// By updating the data property
this.data = {
  description: 'This is the page description',
  keywords: 'these,are,keywords',
  title: 'This is the page title',
};

// By dispatching a custom event
this.dispatchEvent(
  new CustomEvent('sherby-metadata', {
    detail: {
      description: 'This is the page description',
      keywords: 'these,are,keywords',
      title: 'This is the page title',
    },
  }),
);
```

This component support also the [OpenGraph](http://ogp.me/) tags:

```javascript
this.data = {
  'og:description': 'This is the page description',
  'og:keywords': 'these,are,keywords',
  'og:title': 'This is the page title',
};
```

## Thanks

Special thanks to [CaptainCodeman](https://github.com/CaptainCodeman) for his [app-metadata](https://github.com/CaptainCodeman/app-metadata) component that inspired me for this component.

## Development on WSL
```bash
# To use Chrome on Windows
export CHROME_BIN=/mnt/c/Program\ Files\ \(x86\)/Google/Chrome/Application/chrome.exe
```

## Publish

Increment the `version` defined in the `package.json` file and run the command below to publish the module in the
registry:

```bash
# Dry run
npm publish --dry-run

# For real (are you really sure?)
npm publish
```

## License

The [MIT License][1] (MIT)

[1]: https://opensource.org/licenses/MIT
