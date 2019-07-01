import { html, expect, fixture, nextFrame } from '@open-wc/testing';
import '../sherby-metadata.js';

const dispatchSherbyMetadataEvent = (detail)=> {
  const event = new CustomEvent('sherby-metadata', {
    bubbles: true,
    detail: detail,
  });

  window.dispatchEvent(event);
}

const createMeta = ({attributeName,attributeValue, content}) => {
  // Create a new meta element
 const meta = document.createElement('meta');

 // Set the corresponding attribute
 meta.setAttribute(attributeName, attributeValue);

  // Add the content
 meta.content = content

 // Add the meta tag to the document
 document.head.appendChild(meta);
}

describe('sherby-metadata', () => {
  beforeEach(() => {
    // Delete all meta elements
    let metaElements = document.querySelectorAll('meta');
    const removeMetaElement = metaElement => metaElement.remove();
    metaElements.forEach(removeMetaElement);

    metaElements = document.querySelectorAll('meta');
    expect(metaElements.length).to.equal(0);
  });

  describe('should create a new meta element if none exists', async () => {
    it('for an Open Graph meta element', async () => {
      const data = {
        'og:description': 'Description',
        'og:title': 'Title'
      }
      const meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      let metaElements = document.querySelectorAll('meta[property="og:description"]');
      expect(metaElements.length).to.equal(1);

      let metaElement = metaElements[0]
      expect(metaElement.content).to.equal('Description');

      metaElements = document.querySelectorAll('meta[property="og:title"]');
      expect(metaElements.length).to.equal(1);

      metaElement = metaElements[0]
      expect(metaElement.content).to.equal('Title');
    })

    it('for another meta element', async () => {
      const data = { 'description': 'Description' }
      const meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      const metaElements = document.querySelectorAll('meta[name="description"]');
      expect(metaElements.length).to.equal(1);

      const metaElement = metaElements[0]
      expect(metaElement.content).to.equal('Description');
    })

    it("does not set meta tags when the property are not its own", async ()=> {
      const data = {
        'description': 'Description from data',
      };

      function SuperData() {
        this.superdata = "Description from superdata"
      }

      SuperData.prototype = data
      const dataObject = new SuperData()

      const meta = await fixture(html`<sherby-metadata .data=${dataObject}></sherby-metadata>`);

      const d = document.querySelector('meta[name="description"]');
      const ds = document.querySelector('meta[name="superdata"]');

      expect(ds.content).to.equal( 'Description from superdata');
      expect(d).to.be.a('null');
    })
  })

  describe('should update a meta element if it exist', () => {
    beforeEach(() => {
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

      const openGraphDescriptionElement = document.querySelector('meta[property="og:description"]');
      const descriptionElement = document.querySelector('meta[name="description"]');

      expect(openGraphDescriptionElement.content).to.equal(openGraphDescriptionContent);
      expect(descriptionElement.content).to.equal(descriptionContent);
    })

    it('for an Open Graph meta element', async () => {
      const data = { 'og:description': 'Description' }
      const meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      const metaElements = document.querySelectorAll('meta[property="og:description"]');
      expect(metaElements.length).to.equal(1);

      const metaElement = metaElements[0]
      expect(metaElement.content).to.equal('Description');
    })

    it('for another meta element', async () => {
      const data = { 'description': 'Description' }
      const meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      const metaElements = document.querySelectorAll('meta[name="description"]');
      expect(metaElements.length).to.equal(1);

      const metaElement = metaElements[0]
      expect(metaElement.content).to.equal('Description');
    })

    it('should update the document title', async() => {
      document.title = 'Old title'
      const data = { title: 'Title'}
      const meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);
      expect(document.title).to.equal('Title');
    })
  })

  describe('should delete a meta element if we provide a undefined value', async() => {
    it('should set an empty title if the title is undefined', async() => {
      const data = { title: undefined }
      const meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);
      expect(document.title).to.equal('');
    })

    it('should efined', async() => {
      // Create a normal meta element
      createMeta({
        attributeName: 'name',
        attributeValue: 'description',
        content: 'Description',
      })

      const data = { description: '' }
      const meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      const metaElements = document.querySelectorAll('meta[name="description"]');
      expect(metaElements.length).to.equal(0);
    })

    it('should efined', async() => {
      // Create a normal meta element
      createMeta({
        attributeName: 'property',
        attributeValue: 'og:description',
        content: 'Description',
      })

      const data = { description: '' }
      const meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      const metaElements = document.querySelectorAll('meta[property="description"]');
      expect(metaElements.length).to.equal(0);
    })

    it('should do nothing if there is no meta element', async() => {
      const data = {
        description: undefined,
        fragment: 0,
        keywords: null,
        viewport: false,
        'og:title': '',
      }
      const meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

      let metaElements = document.querySelectorAll('meta[name="description"]');
      expect(metaElements.length).to.equal(0);

      metaElements = document.querySelectorAll('meta[name="fragment"]');
      expect(metaElements.length).to.equal(0);

      metaElements = document.querySelectorAll('meta[name="keywords"]');
      expect(metaElements.length).to.equal(0);

      metaElements = document.querySelectorAll('meta[name="viewport"]');
      expect(metaElements.length).to.equal(0);

      metaElements = document.querySelectorAll('meta[description="og:title"]');
      expect(metaElements.length).to.equal(0);
    })
  })

  it('should update the data property if we launch a custom event with a valid detail value', async() => {
    // Initialize the meta element
    const meta = await fixture(html`<sherby-metadata></sherby-metadata>`);

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
    // Initialize the meta element
    const meta = await fixture(html`<sherby-metadata></sherby-metadata>`);
    const emptyObject = {}

    // Number
    const number = 1
    dispatchSherbyMetadataEvent(number)
    expect(meta.data).to.deep.equal(emptyObject)

    // String
    const string = 'description'
    dispatchSherbyMetadataEvent(string)
    expect(meta.data).to.deep.equal(emptyObject)

    // Array
    const array = ['description']
    dispatchSherbyMetadataEvent(array)
    expect(meta.data).to.deep.equal(emptyObject)
  })
});
