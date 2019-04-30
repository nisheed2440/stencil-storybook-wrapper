import { storiesOf } from '@storybook/html';

storiesOf('Components/Test', module)
  .add('Default', () => `<test></test>`)
  .add(
    'With Input',
    () => `<test test="John"></test>`,
  );
