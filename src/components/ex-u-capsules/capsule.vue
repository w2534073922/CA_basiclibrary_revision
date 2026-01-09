<template>
<div :class="[$style.root, isPreview ? $style.preview : '']"
    :size="parentVM.$attrs.size"
    :selected="parentVM.multiple ? currentSelected : isSelected"
    :readonly="parentVM.readonly"
    :disabled="disabled || parentVM.disabled"
    @click="capsuleSelect"
    v-ellipsis-title
    vusion-slot-name="default">
    <!-- @override: 添加了label功能 -->
    <span v-if="label && !isPreview" :class="$style.label">{{ label }}</span>
    <slot></slot>
    <s-empty v-if="(!$slots.default) && $env.VUE_APP_DESIGNER && !!$attrs['vusion-node-path']"></s-empty>
</div>
</template>

<script>
import { sync } from '@lcap/vue2-utils';
import { UListViewItem } from "@lcap-ui/src/components/u-list-view.vue";
import SEmpty from "@lcap-ui/src/components/s-empty.vue";
import MPreview from "@lcap-ui/src/components/u-text.vue/preview";
export default {
  name: 'u-capsule',
  parentName: 'u-capsules',
  components: {
    SEmpty
  },
  extends: UListViewItem,
  mixins: [MPreview, sync({
    disabled() {
      return this.disabled || this.parentVM && this.parentVM.disabled;
    }
  })],
  props: {
    label: String,
    preview: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    capsuleSelect(e) {
      if (this.isPreview) {
        return;
      }
      this.select(e);
    }
  }
};
</script>
<style module>
.root {
    display: table-cell;
    position: relative;
    /* height: 32px;
    line-height: 30px; */
    font-size: var(--capsules-capsule-font-size);
    text-align: center;
    /* margin-right: -1px; */
    padding: var(--capsules-capsule-padding-x) var(--capsules-capsule-padding-y);
    background: transparent;
    color: #53576A;
    cursor: var(--capsules-capsule-cursor);
    vertical-align: middle;
}


.root:not([selected], [readonly], [disabled]):hover {
    z-index: 1;
    color: #1E1F27;
}

.root[selected]:not([disabled], .preview) {
    border-radius: 6px;
    background: #FFF;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.12);
    z-index: 1;
    color: #1E1F27;
}


.root[readonly] {
    cursor: initial;
}

.root[disabled] {
    z-index: auto;
    background: transparent;
    color: var(--capsules-capsule-color-disabled);
    cursor: var(--capsules-capsule-cursor-disabled);
}

.root[disabled][selected] {
    background: var(--capsules-capsule-background-selected-disabled);
    color: var(--capsules-capsule-color-selected-disabled);
}

.root[flag]::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    border: 5px solid;
    border-color: var(--capsules-capsule-flag-border-color) var(--capsules-capsule-flag-border-color) transparent transparent;
}

.root:last-child[flag]::after {
    border-top-right-radius: 3px;
}

.label {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    line-height: 14px;
    padding: 0 4px;
    border-radius: 2px;
    white-space: nowrap;
    background: var(--capsules-capsule-label-background);
    color: var(--capsules-capsule-label-color);
}

.label:empty {
    display: none;
}

.root[size="small"] {
    width: 50px;
    padding: var(--capsules-capsule-padding-x) var(--capsules-capsule-padding-y);
}
.preview {
  border: none;
  cursor: initial;
}

.preview:not([selected]) {
  display: none;
}

.preview[selected] {
  border-radius: 6px;
  background: #FFF;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.12);
  color: #1E1F27;
}
</style>