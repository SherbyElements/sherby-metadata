import { html, expect, fixture, nextFrame } from '@open-wc/testing';
import '../sherby-metadata.js';

describe('sherby-metadata', () => {
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
