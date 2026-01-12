<template>
<label :class="$style.root" :preview="isPreview" :disabled="currentDisabled" @click="select()"
tabindex="0" @keydown.space.prevent @keyup.space.prevent="select()"
@focus="onFocus" @blur="onBlur" v-on="listeners" :readonly="currentReadonly" :selected="selected">
    <span v-if="!isPreview" :class="$style.radio" :selected="selected" :disabled="currentDisabled" :readonly="currentReadonly"></span>
    <slot></slot>
    <span vusion-slot-name="item" :class="$style.content">
        <slot v-if="isPreview && selected || !isPreview" name="item" :item="node">{{ text }}</slot>
        <s-empty v-if="!$slots.item && !text && $env.VUE_APP_DESIGNER && ($attrs['vusion-node-path'] || $attrs.designer)" inline :class="$style.empty"></s-empty>
    </span>
</label>
</template>

<script>
import { sync } from '@lcap/vue2-utils';
import { MChild } from "@lcap-ui/src/components/m-parent.vue";
import MField from "@lcap-ui/src/components/m-field.vue";
import SEmpty from "@lcap-ui/src/components/s-empty.vue";
import MPreview from "@lcap-ui/src/components/u-text.vue/preview";
export default {
  name: 'ex-u-radio',
  parentName: 'ex-u-radios',
  components: {
    SEmpty
  },
  mixins: [MChild, MField, MPreview, sync('disabled', 'sync')],
  props: {
    text: String,
    value: {
      type: Boolean,
      default: false
    },
    label: null,
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    node: Object
  },
  data() {
    return {
      // inherit: parentVM: undefined,
    };
  },
  computed: {
    listeners() {
      const listeners = Object.assign({}, this.$listeners);
      delete listeners.focus;
      delete listeners.blur;
      return listeners;
    },
    selected() {
      return this.parentVM ? this.parentVM.selectedVM === this : this.value;
    },
    currentDisabled() {
      return this.disabled || this.parentVM && this.parentVM.disabled;
    },
    currentReadonly() {
      return this.readonly || this.parentVM && this.parentVM.readonly;
    }
  },
  mounted() {
    this.autofocus && this.$el.focus();
  },
  methods: {
    onFocus(e) {
      this.$emit('focus', e, this);
    },
    onBlur(e) {
      this.$emit('blur', e, this);
    },
    select() {
      if (this.readonly || this.disabled) return;
      if (this.parentVM && (this.parentVM.readonly || this.parentVM.disabled)) return;
      let cancel = false;
      this.$emit('before-select', {
        label: this.label,
        itemVM: this,
        preventDefault: () => cancel = true
      }, this);
      if (cancel) return;
      this.parentVM && this.parentVM.select(this);
    }
  }
};
</script>
<style module>
.root {
    user-select: none;
    cursor: var(--cursor-pointer);
    display: inline-flex;
    align-items: flex-start;
    padding: 8px 12px;
    border: 1px solid #E6E7EB;
    border-radius: 6px;
    background: #fff;
    transition: all var(--transition-duration-base);
    min-width: 120px;
    min-height: 40px;
    vertical-align: top;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
}

.root:hover {
    border-color: #1A5FFF;
}

.root:hover .radio {
    border-color: #1A5FFF;
}

.root:focus {
    outline: var(--focus-outline);
}

.root:focus .radio {
    box-shadow: var(--radio-box-shadow-focus);
    border-color: var(--radio-border-color-focus);
}

.root:active {
    outline: var(--focus-outline);
}

.root:active .radio {
    box-shadow: var(--radio-box-shadow-active);
}

.root[selected] {
    border-color: #1A5FFF;
    background: #fff;
}

.root[disabled] {
    cursor: var(--cursor-not-allowed);
    color: #8D90A0;
    background: #fff;
    border-color: #E6E7EB;
}

.root[disabled]:focus .radio,
.root[readonly]:focus .radio
{
    box-shadow: var(--radio-box-shadow-focus-disabled);
    border-color: var(--radio-border-color-disabled);
}

.root[readonly]:hover {
    cursor: var(--radio-cursor-readonly);
}

.root[disabled]:active .radio,
.root[readonly]:active .radio
{
    box-shadow: var(--radio-box-shadow-active-disabled);
}

.radio {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: var(--radio-size, 16px);
    height: var(--radio-size, 16px);
    min-width: var(--radio-size, 16px);
    min-height: var(--radio-size, 16px);
    border-radius: 100px;
    background: #fff;
    border: 1px solid #d9d9d9;
    margin-right: 8px;
    margin-top: 2px;
    transition: all var(--transition-duration-base);
    font-size: 14px;
    flex-shrink: 0;
}

.radio:hover {
    border-color: #1A5FFF;
}

.radio[readonly]:hover,
.radio[disabled]:hover {
    border-color: #E6E7EB;
}

.root[readonly]:hover .radio,
.root[disabled]:hover .radio {
    border-color: #E6E7EB;
}

.root[disabled]:hover {
    border-color: #E6E7EB;
}

.radio::before {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: '';
    width: var(--radio-solid-circle-size, 8px);
    height: var(--radio-solid-circle-size, 8px);
    border-radius: 100px;
    background: transparent;
    transition: all var(--transition-duration-base);
}

.radio[selected] {
    border-color: #1A5FFF;
}

.radio[selected]::before {
    background: #1A5FFF;
}

.radio[selected][disabled]::before {
    background: #ADB0BB;
}

.radio[disabled] {
    border-color: #E6E7EB;
    background: #f5f6fa;
}

.radio[selected][disabled] {
    border-color: #E6E7EB;
    background: #f5f6fa;
}

.root[designer]{
    display: inline-block;
    position: relative;
}
.root[designer] + .root[designer]:after{
    content: '';
    position: absolute;
    display: block;
    background: rgba(255,255,255,0.8);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}

.content {
    display: flex;
    align-items: flex-start;
    flex: 1;
    line-height: 1.4;
    min-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.empty:not(:only-child){
    display: none;
}

.root[preview] {
    cursor: text;
}

.root[preview=true]:not([selected]) {
    display: none;
}
</style>
