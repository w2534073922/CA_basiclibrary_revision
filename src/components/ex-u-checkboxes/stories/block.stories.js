import Component from '../index';

export default {
  id: 'ex-u-checkboxes-blocks',
  title: '组件列表/ExUCheckboxes/内置区块',
  component: Component,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export const Block1 = {
  name: '基础用法',
  render: () => ({
    template: `<ex-u-checkboxes>
<template #item="current"></template>
</ex-u-checkboxes>`,
  }),
};
