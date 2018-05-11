[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/SherbyElements/sherby-metadata)
[![Build status](https://travis-ci.org/SherbyElements/sherby-metadata.svg?branch=master)](https://travis-ci.org/SherbyElements/sherby-metadata)

## \<sherby-metadata\>

`sherby-metadata` is a Polymer 3 element used to manage meta tags data for 
Search Engine Optimization (SEO). It will add, update and remove `<meta>` 
elements to the `<head>` section based on the JSON object passed to it.

To use this element, add the import to your shell component and include it
in your component code.

```html
<sherby-metadata data="[[data]]"></sherby-metadata>
```

To update your meta tags data, you can update his data property in your shell
component:

```javascript
this.data = {
  description: 'This is the page description',
  keywords: 'these,are,keywords',
  title: 'This is the page title',
};
```

Alternatively, after the `sherby-metadata` is include in your shell component,
you can dispatch a `sherby-metadata` event:

```javascript
this.dispatchEvent(new CustomEvent('sherby-metadata', {
  detail: {
    description: 'This is the page description',
    keywords: 'these,are,keywords',
    title: 'This is the page title',
  },
}));
```

This component support also the `OpenGraph` tags.

## Thanks
Special thanks to [CaptainCodeman](https://github.com/CaptainCodeman) for his [app-metadata](https://github.com/CaptainCodeman/app-metadata) component that inspired me for this component.
