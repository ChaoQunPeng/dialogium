<template>
  <div id="box" class="box"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';

let game: Phaser.Game;

class Universe extends Phaser.Scene {
  private pcq!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup; // 平台组
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // 键盘输入

  constructor() {
    super('hello-world');
  }

  preload() {}

  create() {
    this.pcq = this.physics.add.sprite(300, 500, 'pcq').setTint(0x1677ff).setOrigin(0, 0);
    this.pcq.setTintFill(0x1677ff);
    this.pcq.setCollideWorldBounds(true);
    this.pcq.setBounce(0.1);

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update() {
    this.handleMove();
  }

  handleMove() {
    // 左
    if (this.cursors.left.isDown) {
      this.pcq.setVelocityX(-160);
    }
    // 右
    else if (this.cursors.right.isDown) {
      this.pcq.setVelocityX(160);
    }
    //
    else {
      // 添加一点摩擦力，让角色逐渐停止
      this.pcq.setVelocityX(this.pcq.body!.velocity.x * 0.99);
      if (Math.abs(this.pcq.body!.velocity.x) < 1) {
        this.pcq.setVelocityX(0);
      }
    }

    // 跳跃控制 - 只在按下上键且角色在地面上时才跳跃
    const body = this.pcq.body as Phaser.Physics.Arcade.Body;
    if (this.cursors.up.isDown && body!.onFloor()) {
      this.pcq.setVelocityY(-100); // 跳跃速度，负值向上
    }

    if (this.cursors.down.isDown) {
      console.log(1);
      this.pcq.setVelocityY(630);
    }
  }
}

// Phaser游戏配置
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // 自动选择渲染器（WebGL或Canvas）
  width: 800, // 游戏宽度
  height: 600, // 游戏高度
  parent: 'box', // 游戏容器ID
  physics: {
    default: 'arcade', // 使用Arcade物理引擎
    arcade: {
      gravity: { x: 0, y: 100 }, // 移除重力，实现自由移动
      debug: false, // 关闭调试模式
    },
  },
  scene: Universe, // 使用的游戏场景
};

// 组件挂载时启动游戏
onMounted(() => {
  game = new Phaser.Game(config);
});

// 组件卸载时销毁游戏实例
onUnmounted(() => {
  if (game) {
    game.destroy(true); // 销毁游戏并清理资源
  }
});
</script>

<style scoped>
#box {
  width: 800px;
  height: 600px;
  background-color: #000;
}
</style>
