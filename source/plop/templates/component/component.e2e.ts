import { newE2EPage } from '@stencil/core/testing';

describe('template-component', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<template-component></template-component>');
    const element = await page.find('template-component');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<template-component></template-component>');
    const component = await page.find('template-component');
    const element = await page.find('template-component >>> div');
    expect(element.textContent).toEqual(`Hello World`);

    component.setProperty('test', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`James`);
  });
});
