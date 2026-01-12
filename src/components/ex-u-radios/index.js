import ExURadios from './index.vue';
import ExURadio from './radio.vue';

// 确保组件名称正确设置
ExURadios.name = 'ex-u-radios';
ExURadio.name = 'ex-u-radio';

// 全局注册子组件
ExURadios.ExURadio = ExURadio;

export { ExURadios, ExURadio };
export default ExURadios;
