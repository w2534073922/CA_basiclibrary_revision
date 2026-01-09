import Component from '../index';

export default {
  id: 'ex-u-capsules-blocks',
  title: '组件列表/ExUCapsules/内置区块',
  component: Component,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export const Block1 = {
  name: '基础用法',
  render: () => ({
    template: `<ex-u-capsules>
<ex-u-capsule>Option-A</ex-u-capsule>
<ex-u-capsule>Option-B</ex-u-capsule>
<ex-u-capsule>Option-C</ex-u-capsule>
</ex-u-capsules>`,
  }),
};

export const Block2 = {
  name: '胶囊组',
  render: () => ({
    template: `<ex-u-capsules>
<ex-u-capsules-group>
<ex-u-capsule>Option-A</ex-u-capsule>
<ex-u-capsule>Option-B</ex-u-capsule>
</ex-u-capsules-group>
<ex-u-capsules-group>
<ex-u-capsule>Option-A</ex-u-capsule>
<ex-u-capsule>Option-B</ex-u-capsule>
</ex-u-capsules-group>
</ex-u-capsules>`,
  }),
};

export const Block3 = {
  name: '标签',
  render: () => ({
    template: `<ex-u-capsules>
<ex-u-capsule value="1">1</ex-u-capsule>
<ex-u-capsule value="2">2</ex-u-capsule>
<ex-u-capsule value="3">3</ex-u-capsule>
<ex-u-capsule value="4" label="88折">4</ex-u-capsule>
<ex-u-capsule value="5" label="88折">5</ex-u-capsule>
<ex-u-capsule value="6" label="88折">6</ex-u-capsule>
</ex-u-capsules>`,
  }),
};
