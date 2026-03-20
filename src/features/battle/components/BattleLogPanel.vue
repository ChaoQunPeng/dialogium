<template>
  <BaseBorderContainer title="战斗记录">
    <div class="log-list">
      <TransitionGroup name="log-slide">
        <div v-for="(log, index) in battleLogs" :key="battleLogs.length - index" class="log-item">
          <span class="log-turn">[{{ battleLogs.length - index }}]</span>
          <span
            :class="[
              'log-msg',
              {
                'system-msg':
                  log.includes('🏁') ||
                  log.includes('💀') ||
                  log.includes('🎉') ||
                  log.includes('✨'),
              },
            ]"
          >
            {{ log }}
          </span>
        </div>
      </TransitionGroup>

      <div v-if="battleLogs.length === 0" class="empty-text">--- 双方凝视对方，战斗一触即发 ---</div>
    </div>
  </BaseBorderContainer>
</template>

<script setup lang="ts">
import BaseBorderContainer from '@/components/common/BaseBorderContainer.vue';

defineProps<{
  battleLogs: string[];
}>();
</script>

<style lang="scss" scoped>
.log-list {
  max-height: 260px;
  overflow-y: auto;
}

.log-item {
  margin-bottom: 8px;
  font-size: 0.9em;
  display: flex;
  gap: 10px;
}

.log-turn {
  color: var(--color-gray);
  min-width: 30px;
}

.system-msg {
  color: var(--color-yellow);
  font-weight: bold;
}

.log-slide-enter-active {
  transition: all 0.3s ease;
}

.log-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.empty-text {
  color: var(--color-gray);
}
</style>