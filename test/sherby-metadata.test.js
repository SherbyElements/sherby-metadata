import { html, expect, fixture, nextFrame } from '@open-wc/testing';
import '../sherby-metadata.js';

// Shared variables that will be usefull for our tests
let data, meta, metaElements, metaElement

const dispatchSherbyMetadataEvent = (detail)=> {
  const event = new CustomEvent('sherby-metadata', {
    bubbles: true,
    detail: detail,
  });

  window.dispatchEvent(event);
}

const createMeta = ({attributeName,attributeValue, content}) => {
  // Create a new meta element
  meta = document.createElement('meta');

  // Set the corresponding attribute
  meta.setAttribute(attributeName, attributeValue);

    // Add the content
  meta.content = content

  // Add the meta tag to the document
  document.head.appendChild(meta);
}

const createTestMetas = () => {
  const openGraphDescriptionContent = 'Old Open Graph description'
  const descriptionContent = 'Old description'

  // Create an Open Graph meta element
  createMeta({
    attributeName: 'property',
    attributeValue: 'og:description',
    content: openGraphDescriptionContent,
  })

  // Create a normal meta element
  createMeta({
    attributeName: 'name',
    attributeValue: 'description',
    content: descriptionContent,
  })

  // Create a invalid meta element
  createMeta({
    attributeName: 'attributeName',
    attributeValue: 'description',
    content: descriptionContent,
  })

  // Make sure there is only three meta elements
  metaElements = document.querySelectorAll('meta');
  expect(metaElements.length).to.equal(3);

  // There should be only one with a property og:description
  metaElements = document.querySelectorAll('meta[property="og:description"]');
  expect(metaElements.length).to.equal(1);

  // and his content should be correct
  metaElement = metaElements[0]
  expect(metaElement.content).to.equal(openGraphDescriptionContent);

  // There should be only one with a name description
  metaElements = document.querySelectorAll('meta[name="description"]');
  expect(metaElements.length).to.equal(1);

  // and his content should be correct
  metaElement = metaElements[0]
  expect(metaElement.content).to.equal(descriptionContent);

  // There should be only one with a attribute attributeName
  metaElements = document.querySelectorAll('meta[attributeName="description"]');
  expect(metaElements.length).to.equal(1);

  // and his content should be correct
  metaElement = metaElements[0]
  expect(metaElement.content).to.equal(descriptionContent);
}

describe('sherby-metadata', () => {
  beforeEach(() => {
    const removeMetaElement = metaElement => metaElement.remove();

    // Delete all meta elements
    metaElements = document.querySelectorAll('meta');
    metaElements.forEach(removeMetaElement);

    // Make sure all meta elements have been deleted
    metaElements = document.querySelectorAll('meta');
    expect(metaElements.length).to.equal(0);
  });

  describe('should support the document title', () => {
    it('with an update', async() => {
      // Set the current document title
      document.title = 'Old title'

      data = { title: 'Title'}
      meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      // Make sure the title has been updated
      expect(document.title).to.equal('Title');
    })

    it('with a reset', async() => {
      data = { title: undefined }
      meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      // Make sure the document title is now an empty string
      expect(document.title).to.equal('');
    })
  })

  describe('should create meta elements', () => {
    it('which is a common meta element (name)', async () => {
      data = { 'description': 'Description' }
      meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      // Make sure there is only two meta elements
      metaElements = document.querySelectorAll('meta');
      expect(metaElements.length).to.equal(1);

      // There should be only one with a name description
      metaElements = document.querySelectorAll('meta[name="description"]');
      expect(metaElements.length).to.equal(1);

      // and his content should be "Description"
      metaElement = metaElements[0]
      expect(metaElement.content).to.equal('Description');
    })

    it('which is an Open Graph meta element (property)', async () => {
      data = {
        'og:description': 'Description',
        'og:title': 'Title'
      }
      meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      // Make sure there is only two meta elements
      metaElements = document.querySelectorAll('meta');
      expect(metaElements.length).to.equal(2);

      // There should be only one with a property og:description
      metaElements = document.querySelectorAll('meta[property="og:description"]');
      expect(metaElements.length).to.equal(1);

      // and his content should be "Description"
      metaElement = metaElements[0]
      expect(metaElement.content).to.equal('Description');

      // There should be only one with a property og:title
      metaElements = document.querySelectorAll('meta[property="og:title"]');
      expect(metaElements.length).to.equal(1);

      // and his content should be "Title"
      metaElement = metaElements[0]
      expect(metaElement.content).to.equal('Title');
    })
  })

  describe('should not create meta elements', () => {
    it("if the properties are not its own", async ()=> {
      data = {
        'description': 'Description from data',
      };

      function SuperData() {
        this.superdata = "Description from superdata"
      }

      SuperData.prototype = data
      const dataObject = new SuperData()

      meta = await fixture(html`<sherby-metadata .data=${dataObject}></sherby-metadata>`);

      // Make sure there is only two meta elements
      metaElements = document.querySelectorAll('meta');
      expect(metaElements.length).to.equal(1);

      // There should be only one with a name superdata
      metaElements = document.querySelectorAll('meta[name="superdata"]');
      expect(metaElements.length).to.equal(1);

      // and his content should be "Description from superdata"
      metaElement = metaElements[0]
      expect(metaElement.content).to.equal('Description from superdata');

      // There should not be an element with a name description
      metaElements = document.querySelectorAll('meta[name="description"]');
      expect(metaElements.length).to.equal(0);
    })

    it('if we provide falsy values', async() => {
      data = {
        description: undefined,
        fragment: 0,
        keywords: null,
        viewport: false,
        'og:title': '',
      }

      const expectNoElementForQuery = (query) => {
        metaElements = document.querySelectorAll(query);
        expect(metaElements.length).to.equal(0);
      }

      // Make sure there is no meta elements before the assignment
      expectNoElementForQuery('meta')

      meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      // Make sure there is still no meta elements after the assignment
      expectNoElementForQuery('meta[name="description"]')
      expectNoElementForQuery('meta[name="fragment"]')
      expectNoElementForQuery('meta[name="keywords"]')
      expectNoElementForQuery('meta[name="viewport"]')
      expectNoElementForQuery('meta[description="og:title"]')
    })
  })

  describe('should update existing meta elements', () => {
    beforeEach(createTestMetas)

    it('which is a common meta element (name)', async () => {
      data = { 'description': 'Description' }
      meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      // Make sure there is still three meta elements
      metaElements = document.querySelectorAll('meta');
      expect(metaElements.length).to.equal(3);

      // There should be only one with a namedescription
      metaElements = document.querySelectorAll('meta[name="description"]');
      expect(metaElements.length).to.equal(1);

      // and his content should be "Description"
      metaElement = metaElements[0]
      expect(metaElement.content).to.equal('Description');
    })

    it('which is an Open Graph meta element (property)', async () => {
      data = { 'og:description': 'Description' }
      meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      // Make sure there is still three meta elements
      metaElements = document.querySelectorAll('meta');
      expect(metaElements.length).to.equal(3);

      // There should be only one with a property og:description
      metaElements = document.querySelectorAll('meta[property="og:description"]');
      expect(metaElements.length).to.equal(1);

      // and his content should be "Description"
      metaElement = metaElements[0]
      expect(metaElement.content).to.equal('Description');
    })
  })

  describe('should delete existing meta elements if we provide a falsy value', async() => {
    beforeEach(createTestMetas)

    it('which is a common meta element (name)', async() => {
      data = { description: '' }

      // Make sure the meta element exists
      metaElements = document.querySelectorAll('meta[name="description"]');
      expect(metaElements.length).to.equal(1);

      // and there is three meta elements
      metaElements = document.querySelectorAll('meta');
      expect(metaElements.length).to.equal(3);

      meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      // Make sure the meta element has been deleted
      metaElements = document.querySelectorAll('meta[name="description"]');
      expect(metaElements.length).to.equal(0);

      // and there is only one meta element that has been deleted
      metaElements = document.querySelectorAll('meta');
      expect(metaElements.length).to.equal(2);
    })

    it('which is an Open Graph meta element (property)', async() => {
      data = { 'og:description': '' }

      // Make sure the meta element exists
      metaElements = document.querySelectorAll('meta[property="og:description"]');
      expect(metaElements.length).to.equal(1);

      // and there is three meta elements
      metaElements = document.querySelectorAll('meta');
      expect(metaElements.length).to.equal(3);

      meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      // Make sure the meta element has been deleted
      metaElements = document.querySelectorAll('meta[property="og:description"]');
      expect(metaElements.length).to.equal(0);

      // and there is only one meta element that has been deleted
      metaElements = document.querySelectorAll('meta');
      expect(metaElements.length).to.equal(2);
    })
  })

  describe('should support custom events', () => {
    it('should update the data property if we launch a custom event with a valid detail value', async() => {
      // Initialize the meta element
      meta = await fixture(html`<sherby-metadata></sherby-metadata>`);

      // Empty object
      const emptyObject = {}
      dispatchSherbyMetadataEvent(emptyObject)
      expect(meta.data).to.deep.equal(emptyObject)

      // Not empty object
      const notEmptyObject = {
        description: 'Description',
        title: 'Title'
      }
      dispatchSherbyMetadataEvent(notEmptyObject)
      expect(meta.data).to.deep.equal(notEmptyObject)
    })

    it('should not update the data property if we launch a custom event with an invalid detail value ', async() => {
      const emptyObject = {}

      // Initialize the meta element
      meta = await fixture(html`<sherby-metadata></sherby-metadata>`);

      // Number
      dispatchSherbyMetadataEvent(1)
      expect(meta.data).to.deep.equal(emptyObject)

      // String
      dispatchSherbyMetadataEvent('description')
      expect(meta.data).to.deep.equal(emptyObject)

      // Array
      dispatchSherbyMetadataEvent(['description'])
      expect(meta.data).to.deep.equal(emptyObject)

      // Date
      dispatchSherbyMetadataEvent(new Date())
      expect(meta.data).to.deep.equal(emptyObject)

      // RegExp
      dispatchSherbyMetadataEvent(new RegExp())
      expect(meta.data).to.deep.equal(emptyObject)

      // NaN
      dispatchSherbyMetadataEvent(NaN)
      expect(meta.data).to.deep.equal(emptyObject)

      // Infinity
      dispatchSherbyMetadataEvent(Infinity)
      expect(meta.data).to.deep.equal(emptyObject)

      // undefined
      dispatchSherbyMetadataEvent(undefined)
      expect(meta.data).to.deep.equal(emptyObject)

      // null
      dispatchSherbyMetadataEvent(null)
      expect(meta.data).to.deep.equal(emptyObject)

      // this
      dispatchSherbyMetadataEvent(this)
      expect(meta.data).to.deep.equal(emptyObject)

      // globalThis
      dispatchSherbyMetadataEvent(globalThis)
      expect(meta.data).to.deep.equal(emptyObject)
    })
  })
});
