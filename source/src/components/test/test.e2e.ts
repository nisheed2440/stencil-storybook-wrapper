import { newE2EPage } from '@stencil/core/testing';

describe('test', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<test></test>');
    const element = await page.find('test');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<test></test>');
    const component = await page.find('test');
    const element = await page.find('test >>> div');
    expect(element.textContent).toEqual(`Hello World`);

    component.setProperty('test', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`James`);
  });
});
