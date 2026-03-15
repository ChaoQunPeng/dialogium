<template>
  <div class="system-panel">
    <BorderContainer title="系统设置">
      <div class="settings-section">
        <h3 class="section-title">📊 游戏进度</h3>
        
        <div class="save-info">
          <div class="info-item">
            <span class="label">角色名：</span>
            <span class="value">{{ playerStore.player.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">境界：</span>
            <span class="value">{{ playerStore.realm }}</span>
          </div>
          <div class="info-item">
            <span class="label">等级：</span>
            <span class="value">Lv.{{ playerStore.player.baseInfo.level }}</span>
          </div>
          <div class="info-item">
            <span class="label">灵石：</span>
            <span class="value">{{ playerStore.player.currency }} 💰</span>
          </div>
          <div class="info-item">
            <span class="label">任务进度：</span>
            <span class="value">{{ questProgress.completed }}/{{ questProgress.total }} 已完成</span>
          </div>
          <div class="info-item">
            <span class="label">最后保存：</span>
            <span class="value">{{ lastSaveTime }}</span>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h3 class="section-title">💾 存档管理</h3>
        
        <div class="action-buttons">
          <button 
            class="btn btn-primary" 
            @click="handleExportSave"
            title="导出完整存档数据到剪贴板"
          >
            📤 导出存档
          </button>
          
          <button 
            class="btn btn-success" 
            @click="triggerImport"
            title="从文件导入存档"
          >
            📥 导入存档
          </button>
          
          <button 
            class="btn btn-warning" 
            @click="confirmReset"
            title="重置所有游戏进度"
          >
            🔄 重置游戏
          </button>
        </div>

        <div class="tips">
          <p>💡 <strong>提示：</strong></p>
          <ul>
            <li>游戏会自动保存您的进度</li>
            <li>导出存档将下载 JSON 文件到本地</li>
            <li>导入存档可从备份文件恢复进度（选择 JSON 文件）</li>
            <li>重置游戏将清除所有进度数据</li>
          </ul>
        </div>
      </div>

      <!-- 隐藏的文件输入 -->
      <input 
        ref="fileInput" 
        type="file" 
        accept=".json" 
        class="hidden-input"
        @change="handleFileSelect"
      />
    </BorderContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePlayerStore } from '@/stores/player';
import { useQuestStore } from '@/stores/quest';
import { exportSaveFile, importSaveFile, resetGame } from '@/utils/saveManager';
import type { IQuest } from '@/interface/quest';

const playerStore = usePlayerStore();
const questStore = useQuestStore();

const fileInput = ref<HTMLInputElement | null>(null);
const lastSaveTime = ref<string>('自动保存中...');

// 计算任务进度
const questProgress = computed(() => {
  const allQuests = questStore.quests as IQuest[];
  const completed = allQuests.filter((q: IQuest) => 
    q.status === 'completed' || q.status === 'claimed'
  ).length;
  
  return {
    completed,
    total: allQuests.length,
  };
});

/** 导出存档到 JSON 文件 */
const handleExportSave = async () => {
  try {
    exportSaveFile();
    alert('✅ 存档文件已开始下载！\n\n包含：玩家数据 (PD)、背包物品 (PI)、任务进度 (PQ)');
  } catch (error) {
    console.error('导出失败', error);
    alert('❌ 导出失败，请重试');
  }
};

/** 触发文件选择 */
const triggerImport = () => {
  fileInput.value?.click();
};

/** 处理文件选择 */
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // 验证文件类型
  if (!file.name.endsWith('.json')) {
    alert('❌ 请选择 JSON 格式的文件');
    target.value = '';
    return;
  }
  
  try {
    const result = await importSaveFile(file);
    
    if (result.success) {
      alert(`✅ ${result.message}\n\n页面将刷新以应用新存档。`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      alert(`❌ ${result.message}`);
    }
  } catch (error) {
    console.error('导入失败', error);
    alert('❌ 文件读取失败，请确保文件格式正确');
  }
  
  // 清空 input，允许重复选择同一文件
  target.value = '';
};

/** 确认重置 */
const confirmReset = () => {
  const confirmed = confirm(
    '⚠️ 警告：此操作将清除所有游戏进度！\n\n确定要重置游戏吗？\n\n此操作不可恢复！'
  );
  
  if (confirmed) {
    try {
      resetGame();
    } catch (error) {
      console.error('重置失败', error);
      alert('❌ 重置失败，请手动清除浏览器数据');
    }
  }
};
</script>

<style lang="scss" scoped>
.system-panel {
  padding: 8px;
}

.settings-section {
  margin-bottom: 20px;
  
  .section-title {
    color: var(--color-yellow);
    font-size: 1.1em;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(255, 215, 0, 0.3);
    padding-bottom: 6px;
  }
}

.save-info {
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      color: var(--color-text);
      font-weight: 500;
    }
    
    .value {
      color: var(--color-yellow);
      font-weight: bold;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  
  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    transition: all 0.2s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &.btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      
      &:hover {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      }
    }
    
    &.btn-success {
      background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
      color: white;
      
      &:hover {
        background: linear-gradient(135deg, #a8e063 0%, #56ab2f 100%);
      }
    }
    
    &.btn-warning {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      
      &:hover {
        background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
      }
    }
  }
}

.tips {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 4px;
  border-left: 3px solid var(--color-cyan);
  
  p {
    color: var(--color-text);
    margin-bottom: 8px;
    
    strong {
      color: var(--color-cyan);
    }
  }
  
  ul {
    color: var(--color-text-muted);
    padding-left: 20px;
    margin: 0;
    
    li {
      margin-bottom: 4px;
    }
  }
}

.hidden-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
