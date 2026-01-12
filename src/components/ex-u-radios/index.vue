<template>
<div 
    :class="$style.root"
    :style="getStyle()"
    :direction="direction"
    :isSetColumn="isSetColumn"
    style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <u-loading v-if="loading" size="small"></u-loading>
    <template v-else>
        <ex-u-radio
            v-for="(node, index) in currentData"
            :key="index"
            :text="$at2(node, textField)"
            :label="$at2(node, valueField)"
            :disabled="node.disabled || disabled"
            :readonly="node.readonly || readonly"
            :designer="$env.VUE_APP_DESIGNER"
            :node="node"
        >
            <template #item="item">
                <slot name="item" v-bind="item" :index="index">
                    {{ $at2(node, textField) }}
                </slot>
            </template>
        </ex-u-radio>
        <u-preview v-if="isPreview && !selectedVM"></u-preview>
    </template>
    <template v-if="$env.VUE_APP_DESIGNER && !dataSource && !$slots.default">
        <span :class="$style.loadContent">请绑定数据源或添加单选项</span>
    </template>
    <slot v-if="!dataSource"></slot>
</div>
</template>

<script>
import { sync } from '@lcap/vue2-utils';
import { MParent } from "@lcap-ui/src/components/m-parent.vue";
import MField from "@lcap-ui/src/components/m-field.vue";
import ExURadio from './radio.vue';
import SupportDataSource from "@lcap-ui/src/mixins/support.datasource.js";
import MPreview from "@lcap-ui/src/components/u-text.vue/preview";
import UPreview from "@lcap-ui/src/components/u-text.vue/preview.vue";
import ULoading from "@lcap-ui/src/components/u-loading.vue";
export default {
  name: 'ex-u-radios',
  childName: 'ex-u-radio',
  components: {
    ExURadio,
    'ex-u-radio': ExURadio,
    UPreview,
    ULoading
  },
  mixins: [MParent, MField, SupportDataSource, MPreview, sync({
    data() {
      return this.currentDataSource ? this.currentDataSource.data : [];
    },
    value() {
      return this.selectedVM && this.selectedVM.label;
    },
    readonly: 'readonly',
    preview: 'isPreview',
    disabled: 'disabled'
  })],
  props: {
    value: null,
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    preview: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    column: {
      type: Number,
      default: 0
    },
    dataSource: [Array, Object, Function],
    dataSchema: null,
    textField: {
      type: [String, Function],
      default: 'text'
    },
    valueField: {
      type: [String, Function],
      default: 'value'
    }
  },
  data() {
    return {
      // inherit: itemVMs: [],
      selectedVM: undefined,
      currentText: null,
      isSetColumn: false
    };
  },
  computed: {
    currentData() {
      if (this.currentDataSource && this.currentDataSource.data) {
        return this.currentDataSource.data;
      }
      return [];
    }
  },
  watch: {
    value(value, oldValue) {
      this.watchValue(value);
    },
    selectedVM(selectedVM, oldVM) {
      this.$emit('change', {
        value: selectedVM ? selectedVM.label : undefined,
        oldValue: oldVM ? oldVM.label : undefined,
        item: selectedVM ? selectedVM.item : undefined,
        itemVM: selectedVM
      }, this);
      this.currentText = selectedVM?.$slots?.item?.[0]?.componentOptions?.propsData?.text;
    },
    itemVMs() {
      this.selectedVM = undefined;
      this.watchValue(this.value);
    },
    currentData() {
      this.selectedVM = undefined;
      this.watchValue(this.value);
    }
  },
  mounted() {
    this.watchValue(this.value);
  },
  methods: {
    watchValue(value) {
      if (this.selectedVM && this.selectedVM.label === value) return;
      if (value === undefined) {
        this.selectedVM = undefined;
      } else {
        // 优先从itemVMs中查找（插槽模式）
        if (this.itemVMs && this.itemVMs.length > 0) {
          this.selectedVM = this.itemVMs.find(itemVM => itemVM.label === value);
        } else if (this.currentData && this.currentData.length > 0) {
          // 数据源模式下，创建虚拟的selectedVM
          const item = this.currentData.find(node => this.$at2(node, this.valueField) === value);
          if (item) {
            this.selectedVM = {
              label: this.$at2(item, this.valueField),
              item: item
            };
          }
        }
      }
    },
    select(itemVM) {
      if (this.readonly || this.disabled) return;
      const oldValue = this.value;
      let cancel = false;
      this.$emit('before-select', {
        value: itemVM && itemVM.label,
        oldValue,
        itemVM,
        preventDefault: () => cancel = true
      }, this);
      if (cancel) return;
      if (this.cancelable && this.selectedVM === itemVM) {
        this.selectedVM = undefined;
      } else {
        this.selectedVM = itemVM;
      }
      const value = this.selectedVM && this.selectedVM.label;
      this.$emit('input', value, this);
      this.$emit('update:value', value, this);
      this.$emit('select', {
        value,
        oldValue,
        itemVM: this.selectedVM
      }, this);
    },
    // 数据源模式下的选择方法
    selectByData(node, index) {
      if (this.readonly || this.disabled) return;
      const oldValue = this.value;
      const newValue = this.$at2(node, this.valueField);
      let cancel = false;
      
      // 创建虚拟的itemVM对象
      const virtualItemVM = {
        label: newValue,
        item: node,
        index: index
      };
      
      this.$emit('before-select', {
        value: newValue,
        oldValue,
        itemVM: virtualItemVM,
        preventDefault: () => cancel = true
      }, this);
      
      if (cancel) return;
      
      if (this.cancelable && this.value === newValue) {
        this.selectedVM = undefined;
      } else {
        this.selectedVM = virtualItemVM;
      }
      
      const value = this.selectedVM && this.selectedVM.label;
      this.$emit('input', value, this);
      this.$emit('update:value', value, this);
      this.$emit('select', {
        value,
        oldValue,
        itemVM: this.selectedVM
      }, this);
    },
    getStyle() {
      let styles = {};
      let isSetColumn = false;
      if (this.direction !== 'vertical' && this.column > 0) {
        isSetColumn = true;
        styles = {
          ...styles,
          display: 'grid',
          gridTemplateColumns: `repeat(${this.column}, calc(100% / ${this.column}))`
        };
      }
      this.isSetColumn = isSetColumn;
      return styles;
    },
    // 重新加载数据源的方法
    reload() {
      if (this.load && typeof this.load === 'function') {
        return this.load();
      }
    }
  }
};
</script>
<style module>
.root {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    min-height: 40px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
}

.root > *:not(:last-child) {
    margin-right: 0;
}

.root .loadContent {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    font-family: inherit !important;
}

.root[direction="vertical"] {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  min-height: 40px;
}

.root[direction="vertical"] > *:not(:last-child) {
    margin-right: 0;
}

.root[direction] {
    gap: 8px;
}

.root[isSetColumn="true"] {
    gap: 8px;
    align-items: flex-start;
    min-height: 40px;
}

.root[isSetColumn="true"] > * {
    margin-right: 0;
}

/* 确保在数据源模式下也正确对齐 */
.root[isSetColumn="true"] {
    display: grid;
    align-items: start;
    min-height: 40px;
    gap: 8px;
    row-gap: 8px;
    column-gap: 8px;
}

.root[isSetColumn="true"] > * {
    display: flex;
    align-items: center;
    min-height: 40px;
}

/* 防止子组件触发Google Fonts请求 */
.root *,
.root *::before,
.root *::after {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
}

/* 覆盖可能的UI库样式 */
.root :global([class*="u-"]),
.root :global([class*="lcap-"]),
.root :global([class*="el-"]) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
}

</style>
