import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'template-component',
  styleUrl: 'template-component.css',
  shadow: true,
})
export class TemplateComponent {
  /**
   * A test prop
   */
  @Prop() test: string = 'Hello World';

  render() {
    return (<div class="template-component">{this.test}</div>);
  }
}
