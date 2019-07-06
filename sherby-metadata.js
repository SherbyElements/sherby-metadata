import { LitElement } from 'lit-element';

/**
* `sherby-metadata` is a LitElement used to manage meta tags data for
* Search Engine Optimization (SEO). It will add, update and remove `<meta>`
* elements to the `<head>` section based on the JSON object passed to it.
*
* To use this element, add the import to your shell component and include it
* in your component code.
*
*     <sherby-metadata .data=${data}></sherby-metadata>
*
* To update your meta tags data, you can update his data property in your shell
* component:
*
*   this.data = {
*     title: 'This is the page title',
*     description: 'This is the page description',
*     keywords: 'these,are,keywords'
*   };
*
* Alternatively, after the `sherby-metadata` is include in your shell component,
* you can dispatch a `sherby-metadata` event:
*
*   this.dispatchEvent(new CustomEvent('sherby-metadata', {
*     detail: {
*       description: 'This is the page description',
*       keywords: 'these,are,keywords',
*       title: 'This is the page title',
*     }
*   }));
*
* This component support also the `OpenGraph` tags.
*
* @customElement
* @extends {LitElement}
* @group SherbyElements
* @demo demo/index.html
*/
class SherbyMetadata extends LitElement {
  /**
  * Return the properties.
  * @static
  * @return {Object} Properties.
  */
  static get properties() {
    return {
      /**
      * An object that contains the meta data currently set on the page.
      * The object keys will be used for the `name` of the <meta> tag
      * and the value the `content`.
      * @public
      */
      data: {
        type: Object,
      },
    };
  }

  /**
  * Create the listener and  initialize the meta elements.
  * @constructor
  */
  constructor() {
    super();

    this.data = {};

    // Object to keep track of meta elements so they can be reused
    this._metaElements = {};

    // Metadata event listener
    this.__metadataEventListener = this._onMetadataEvent.bind(this);

    this._initializeMetaElements();
  }

  /**
  * Add an event listener to the body element after the next render.
  * @public
  */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('sherby-metadata', this.__metadataEventListener);
  }

  /**
  * Remove the event listener from the body element.
  * @public
  */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('sherby-metadata', this.__metadataEventListener);
  }

  /**
   * Update the DOM when the data changes.
   * @protected
   * @param {Object} changedProperties Changed properties.
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    /* istanbul ignore if */
    if (!changedProperties.has('data')) {
      return;
    }

    const data = this.data;

    // For each key in data
    for (const name in data) {
      // Continue if it's not a direct property
      if (!Object.prototype.hasOwnProperty.call(data, name)) {
        continue;
      }

      // Special case: title
      if (name === 'title') {
        document.title = data[name] || '';
        continue;
      }

      // Do we have this meta element?
      if (Object.prototype.hasOwnProperty.call(this._metaElements, name)) {
        // Update the content if it is defined
        if (data[name]) {
          this._metaElements[name].content = data[name];
        } else {
          // Remove the meta element from the document
          document.head.removeChild(this._metaElements[name]);
          delete this._metaElements[name];
        }

        continue;
      }

      // If the content is not defined at this step,
      // we have nothing to do
      if (!data[name]) {
        continue;
      }

      // Create a new meta element
      const meta = document.createElement('meta');

      // Open Graph meta tags name is in property attribute
      const attribute = name.substring(0, 3) === 'og:' ? 'property' : 'name';

      // Set the corresponding attribute
      meta.setAttribute(attribute, name);

      // Add the content
      meta.content = data[name];

      // Add the meta tag to the document
      document.head.appendChild(meta);

      // Keep track of the inserted meta tag
      this._metaElements[name] = meta;
    }
  }

  /**
  * Initialize the meta elements.
  * @protected
  */
  _initializeMetaElements() {
    const documentMetaElements = document.querySelectorAll('meta');
    const metaElements = {};
    const iterateOnMetaElement = (metaElement) => {
      // Get the name of the meta element
      const name = metaElement.name || metaElement.getAttribute('property');

      // Add the meta element only if we found a name
      if (name) {
        metaElements[name] = metaElement;
      }
    };

    // For each meta elements found in the document
    documentMetaElements.forEach(iterateOnMetaElement);

    // Set the metaElements property
    this._metaElements = metaElements;
  }

  /**
  * Update the data when we receive an metadata event.
  * @protected
  * @param {Event} event Event.
  */
  _onMetadataEvent(event) {
    // Do we have a detail object?
    if (event.detail && typeof event.detail === 'object' && event.detail.constructor === Object) {
      this.data = event.detail;
    }

    // Stop the propagation
    event.stopPropagation();
  }
}

window.customElements.define('sherby-metadata', SherbyMetadata);
