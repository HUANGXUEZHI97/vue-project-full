import { mount } from '@vue/test-utils';
import Logo from '@/components/Logo.vue';

describe('Logo', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Logo);
    // eslint-disable-next-line no-undef
    expect(wrapper.vm).toBeTruthy();
  });
});
