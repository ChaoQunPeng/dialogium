<template>
  <!-- 游戏容器 -->
  <div id="game-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';

let game: Phaser.Game;

// 游戏场景类，实现一个简单的收集星星游戏
class GameScene extends Phaser.Scene {
  // 游戏对象引用
  private player!: Phaser.Physics.Arcade.Sprite; // 玩家角色
  private stars!: Phaser.Physics.Arcade.Group; // 星星组
  private bombs!: Phaser.Physics.Arcade.Group; // 炸弹组
  private platforms!: Phaser.Physics.Arcade.StaticGroup; // 平台组
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // 键盘输入
  private score = 0; // 当前分数
  private scoreText!: Phaser.GameObjects.Text; // 分数显示文本
  private gameOver = false; // 游戏结束标志

  constructor() {
    super('game-scene');
  }

  preload() {
    // 预加载游戏资源
    // 这里使用基本图形代替外部资源，但保留了API接口以备扩展
  }

  create() {
    // 创建蓝色背景
    this.add.rectangle(400, 300, 800, 600, 0x87ceeb); // 天空蓝背景

    // 创建平台组
    this.platforms = this.physics.add.staticGroup();

    // 地面平台 - 棕色矩形
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody().setTint(0x8b4513); // 棕色

    // 其他平台 - 棕色矩形
    this.platforms.create(600, 400, 'ground').setTint(0x8b4513);
    this.platforms.create(50, 250, 'ground').setTint(0x8b4513);
    this.platforms.create(750, 220, 'ground').setTint(0x8b4513);

    // 创建玩家角色 - 使用精灵并设置为蓝色
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setCollideWorldBounds(true); // 玩家碰撞世界边界
    this.player.setTint(0x3498db); // 设置为蓝色
    this.player.setDisplaySize(40, 40); // 设置显示大小

    // 创建星星组 - 黄色精灵
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    // 为每个星星设置属性
    this.stars.children.iterate((child) => {
      const star = child as Phaser.Physics.Arcade.Sprite;
      star.setTint(0xffd700); // 金色
      star.setDisplaySize(20, 20); // 设置显示大小
      star.setBounce(0.5); // 设置弹跳系数
      star.setCollideWorldBounds(true); // 与世界边界碰撞
      star.setVelocity(Phaser.Math.Between(-200, 200), 20); // 设置初始速度
      return true;
    });

    // 设置碰撞检测
    this.physics.add.collider(this.player, this.platforms); // 玩家与平台碰撞
    this.physics.add.collider(this.stars, this.platforms); // 星星与平台碰撞

    // 设置重叠检测 - 玩家收集星星
    this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

    // 创建炸弹组 - 红色精灵
    this.bombs = this.physics.add.group();

    // 炸弹与平台碰撞
    this.physics.add.collider(this.bombs, this.platforms);

    // 玩家与炸弹碰撞检测
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);

    // 创建分数文本显示
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#000',
    });

    // 初始化键盘输入
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update() {
    // 如果游戏结束则返回
    if (this.gameOver) {
      return;
    }

    // 玩家移动控制
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160); // 向左移动
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160); // 向右移动
    } else {
      this.player.setVelocityX(0); // 水平速度为0
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160); // 向上移动
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160); // 向下移动
    } else {
      this.player.setVelocityY(0); // 垂直速度为0
    }
  }

  // 收集星星的回调函数
  collectStar(object1: any, object2: any) {
    console.log(111);

    // 确保object2是星星
    const star = object2 as Phaser.Physics.Arcade.Sprite;
    star.disableBody(true, true); // 禁用星星物理体并隐藏

    // 增加分数
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`); // 更新分数显示

    // 如果所有星星都被收集完
    if (this.stars.countActive(true) === 0) {
      // 重新激活所有星星
      this.stars.children.iterate((child) => {
        const star = child as Phaser.Physics.Arcade.Sprite;
        star.enableBody(true, star.x, 0, true, true); // 在原来x位置的顶部重新激活
        return true;
      });

      // 创建一个炸弹 - 红色精灵
      const x =
        (this.player as Phaser.Physics.Arcade.Sprite).x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);
      const bomb = this.bombs.create(x, 16, 'bomb') as Phaser.Physics.Arcade.Sprite;
      bomb.setTint(0xff0000); // 红色
      bomb.setDisplaySize(30, 30); // 设置显示大小
      bomb.setBounce(0.5); // 设置弹跳系数
      bomb.setCollideWorldBounds(true); // 与世界边界碰撞
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20); // 设置初始速度
    }
  }

  // 玩家碰到炸弹的回调函数
  hitBomb() {
    this.physics.pause(); // 暂停物理引擎

    // 将玩家设置为红色表示游戏结束
    this.player.setTint(0xff0000);

    this.gameOver = true; // 设置游戏结束标志
  }
}

// Phaser游戏配置
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // 自动选择渲染器（WebGL或Canvas）
  width: 800, // 游戏宽度
  height: 600, // 游戏高度
  parent: 'game-container', // 游戏容器ID
  physics: {
    default: 'arcade', // 使用Arcade物理引擎
    arcade: {
      gravity: { x: 0, y: 0 }, // 移除重力，实现自由移动
      debug: false, // 关闭调试模式
    },
  },
  scene: GameScene, // 使用的游戏场景
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
#game-container {
  width: 800px;
  height: 600px;
  background-color: #000;
}
</style>
