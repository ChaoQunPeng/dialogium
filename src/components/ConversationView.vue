<template>
  <div class="conversation-view">
    <BorderContainer class="conversation-container">
      <div class="conversation-content">
        <!-- NPC 信息 -->
        <div class="npc-info">
          <div class="npc-avatar">
            <span class="avatar-icon">👤</span>
          </div>
          <div class="npc-details">
            <h3 class="npc-name">{{ npc?.name }}</h3>
            <p class="npc-level" v-if="npc?.baseInfo?.level">Lv.{{ npc.baseInfo.level }}</p>
          </div>
        </div>

        <!-- 对话内容 -->
        <div class="dialogue-box" ref="dialogueBoxRef">
          <div v-if="npc?.conversations && npc.conversations.length > 0" class="dialogue-list">
            <div
              v-for="(conv, convIndex) in npc.conversations"
              :key="convIndex"
              class="dialogue-item"
            >
              <div
                v-for="(content, contentIndex) in conv.contentList"
                :key="contentIndex"
                class="dialogue-text"
                :style="{ opacity: shouldShow(convIndex, contentIndex) ? 1 : 0 }"
              >
                <span class="text-icon">💬</span>
                <span class="text-content">
                  <TypeWriter
                    v-if="shouldShow(convIndex, contentIndex)"
                    ref="typeWriters"
                    :data="{ type: 'text', contentList: [content] }"
                    @is-typing="handleTypingStatus"
                  />
                </span>
              </div>
            </div>
          </div>
          <div v-else class="no-dialogue">
            <p>{{ npc?.name }}似乎没有什么想说的...</p>
          </div>
        </div>

        <!-- 关闭按钮 -->
        <div class="action-buttons">
          <button class="close-button" @click="closeConversation">
            <span class="icon">✕</span> 离开
          </button>
        </div>
      </div>
    </BorderContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import type { ICharacter } from '@/interface/character';
import BorderContainer from './borderContainer.vue';
import TypeWriter from './TypeWriter/TypeWriter.vue';

// Props
const props = defineProps<{
  npc: ICharacter | null;
}>();

// Emits
const emit = defineEmits<{
  close: [];
}>();

// 状态管理
const currentConvIndex = ref(0);
const currentContentIndex = ref(-1); // -1 表示还没开始显示任何内容
const dialogueBoxRef = ref<HTMLElement | null>(null);
const typeWriters = ref<any[]>([]);

// 判断是否应该显示
const shouldShow = (convIndex: number, contentIndex: number) => {
  if (convIndex < currentConvIndex.value) return true;
  if (convIndex === currentConvIndex.value && contentIndex <= currentContentIndex.value)
    return true;
  return false;
};

// 获取当前正在打字的 TypeWriter
const getCurrentTypeWriter = () => {
  const index = currentContentIndex.value;
  if (index >= 0 && index < typeWriters.value.length) {
    return typeWriters.value[index];
  }
  return null;
};

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (dialogueBoxRef.value) {
    dialogueBoxRef.value.scrollTop = dialogueBoxRef.value.scrollHeight;
  }
};

// 显示下一句对话
const showNextSentence = async () => {
  if (!props.npc?.conversations) return;

  const conversations = props.npc.conversations;

  // 检查当前句子是否还在打字
  const currentTypeWriter = getCurrentTypeWriter();
  if (currentTypeWriter && currentTypeWriter.isTyping?.value) {
    // 还在打字，等待
    return;
  }

  // 移动到下一个内容
  currentContentIndex.value++;

  // 检查是否超出当前对话项的内容
  const currentConv = conversations[currentConvIndex.value];
  if (currentConv && currentContentIndex.value >= currentConv.contentList.length) {
    // 当前对话项的所有内容都显示完了，移动到下一个对话项
    currentConvIndex.value++;
    currentContentIndex.value = 0;

    // 检查是否所有对话都显示完了
    if (currentConvIndex.value >= conversations.length) {
      console.log('所有对话已显示完毕');
      return;
    }
  }

  // 滚动到底部
  await scrollToBottom();

  // 递归调用，继续显示下一句
  setTimeout(() => {
    showNextSentence();
  }, 500); // 每句之间延迟 500ms
};

// 打字状态处理
const handleTypingStatus = (isTyping: boolean) => {
  if (!isTyping) {
    // 当前句子打字完成，继续下一句
    setTimeout(() => {
      showNextSentence();
    }, 300);
  }
};

// 关闭对话
const closeConversation = () => {
  emit('close');
};

// 初始化：开始显示第一句
onMounted(() => {
  currentContentIndex.value = 0;
});
</script>

<style lang="scss" scoped>
.conversation-view {
  width: 100%;
}

.conversation-container {
  :deep(.border-container-content) {
    padding: 0;
  }
}

.conversation-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

// NPC 信息区域
.npc-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.npc-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(100, 180, 255, 0.2), rgba(150, 120, 255, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(100, 180, 255, 0.3);

  .avatar-icon {
    font-size: 24px;
  }
}

.npc-details {
  flex: 1;

  .npc-name {
    font-size: 18px;
    font-weight: bold;
    color: var(--color-yellow);
    margin: 0 0 2px 0;
  }

  .npc-level {
    font-size: 12px;
    color: var(--text-muted);
    margin: 0;
  }
}

// 对话区域
.dialogue-box {
  flex: 1;
  min-height: 180px;
  max-height: 350px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  padding: 12px;
}

.dialogue-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dialogue-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dialogue-text {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  animation: fadeIn 0.4s ease-out forwards;
  opacity: 0;

  .text-icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  .text-content {
    font-size: 14px;
    line-height: 1.5;
    color: var(--text-main);
    word-break: break-all;
  }
}

.no-dialogue {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 120px;

  p {
    color: var(--text-muted);
    font-size: 13px;
    text-align: center;
  }
}

// 操作按钮
.action-buttons {
  display: flex;
  justify-content: center;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.close-button {
  padding: 8px 20px;
  background: rgba(255, 100, 100, 0.1);
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 6px;
  color: var(--color-red);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: rgba(255, 100, 100, 0.2);
    border-color: rgba(255, 100, 100, 0.5);
  }

  .icon {
    font-size: 14px;
  }
}

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 滚动条样式
.dialogue-box::-webkit-scrollbar {
  width: 5px;
}

.dialogue-box::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.dialogue-box::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>
