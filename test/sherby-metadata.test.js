import { html, expect, fixture, nextFrame } from '@open-wc/testing';
import '../sherby-metadata.js';

describe('sherby-metadata', () => {
  beforeEach(() => {
    // Delete all meta elements
    const metas = document.querySelectorAll('meta')
    const removeMeta = meta => meta.remove()
    metas.forEach(removeMeta)
  });

  it('should reuse the existant meta elements', async() => {
    const createMeta = (name, content) => {
      // Create a new meta element
      const meta = document.createElement('meta');

      // Open Graph meta tags name is in property attribute
      const attribute = name.substring(0, 3) === 'og:' ? 'property' : 'name';

      // Set the corresponding attribute
      meta.setAttribute(attribute, name);

      // Add the content
      meta.content = content;

      // Add the meta tag to the document
      document.head.appendChild(meta);
    }

    // Add an empty meta element
    const emptyMeta = document.createElement('meta');
    document.head.appendChild(emptyMeta);

    createMeta('description', 'Description')
    createMeta('og:title', 'Title (OpenGraph)')

    const em = document.querySelector('meta');
    const d = document.querySelector('meta[name="description"]');
    const ot = document.querySelector('meta[property="og:title"]');

    expect(em.content).to.equal( '');
    expect(d.content).to.equal( 'Description');
    expect(ot.content).to.equal( 'Title (OpenGraph)');

    const data = {
      'description': 'Description from data',
      'og:title': 'Title from data (OpenGraph)',
    };
    const meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

    expect(d.content).to.equal( 'Description from data');
    expect(ot.content).to.equal( 'Title from data (OpenGraph)');
  })

  it('sets meta tags when we set meta data', async () => {
    const data = {
      'description': 'Description from data',
      'og:description': 'Description from data (OpenGraph)',
      'og:title': 'Title from data (OpenGraph)',
      'title': 'Title from data',
    };
    const meta = await fixture(html`<sherby-metadata .data=${data}></sherby-metadata>`);

    const d = document.querySelector('meta[name="description"]');
    const od = document.querySelector('meta[property="og:description"]');
    const ot = document.querySelector('meta[property="og:title"]');

    expect(d.content).to.equal( 'Description from data');
    expect(document.title).to.equal( 'Title from data');
    expect(od.content).to.equal('Description from data (OpenGraph)');
    expect(ot.content).to.equal( 'Title from data (OpenGraph)');
  });

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

  it('sets meta tags when there is a sherby-metadata event', async () => {
    const meta = await fixture(html`<sherby-metadata></sherby-metadata>`);

    const event = new CustomEvent('sherby-metadata', {
      bubbles: true,
      detail: {
        'description': 'Description from event',
        'og:description': 'Description from event (OpenGraph)',
        'og:title': 'Title from event (OpenGraph)',
        'title': 'Title from event',
      },
    });

    window.dispatchEvent(event);

    await nextFrame();

    const d = document.querySelector('meta[name="description"]');
    const od = document.querySelector('meta[property="og:description"]');
    const ot = document.querySelector('meta[property="og:title"]');

    expect(d.content).to.equal('Description from event');
    expect(document.title).to.equal( 'Title from event');
    expect(od.content).to.equal('Description from event (OpenGraph)');
    expect(ot.content).to.equal( 'Title from event (OpenGraph)');
  });
});
