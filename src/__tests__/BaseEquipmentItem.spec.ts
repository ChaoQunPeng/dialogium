import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import BaseEquipmentItem from '@/components/common/BaseEquipmentItem.vue';

describe('BaseEquipmentItem', () => {
  it('opens the item detail modal with the clicked equipment data', async () => {
    setActivePinia(createPinia());

    const wrapper = mount(BaseEquipmentItem, {
      props: {
        equipment: {
          id: 'jin-die-dao',
          name: '金蝶刀',
          category: 'equipment',
          description: '一柄轻盈的法器。',
          slot: 'weapon',
          level: 3,
          price: 100,
          stackable: false,
          grade: 'Rare',
          count: 1,
          isLocked: false,
          isEquipped: false,
          instanceId: 'weapon-1',
        },
      },
    });

    await wrapper.get('.equipment-item').trigger('click');
    await nextTick();

    expect(wrapper.text()).toContain('金蝶刀');
    expect(wrapper.text()).toContain('武器');
  });
});