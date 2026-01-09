<template>
  <div :class="$style.root" :disabled="disabled" :readonly="readonly" v-bind="$attrs">
    <slot></slot>
  </div>
</template>

<script>
import { sync } from '@lcap/vue2-utils';
import { UListView } from "@lcap-ui/src/components/u-list-view.vue";
import MPreview from "@lcap-ui/src/components/u-text.vue/preview";
export default {
  name: 'u-capsules',
  childName: 'u-capsule',
  extends: UListView,
  mixins: [MPreview, sync({
    preview: 'isPreview'
  })],
  props: {
    preview: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style module>
.root {
    user-select: none;
    display: flex;
    min-height: 32px;
    padding: 4px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    align-self: stretch;
    border-radius: 6px;
    background: var(--capsules-background, #F0F1F5);
    font-size: 0;
}

.root:focus {
    outline: var(--focus-outline);
}

.root[disabled] {
    cursor: var(--capsules-capsule-cursor-disabled);
    opacity: 0.6;
}
</style>