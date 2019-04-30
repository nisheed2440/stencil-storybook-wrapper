import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'test',
  styleUrl: 'test.scss',
  shadow: true,
})
export class Test {
  /**
   * A test prop
   */
  @Prop() test: string = 'Hello World';

  render() {
    return (<div class="test">{this.test}</div>);
  }
}
