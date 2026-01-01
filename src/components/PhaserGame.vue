<template>
  <div id="game-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';

let game: Phaser.Game;

// 定义场景类
class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private stars!: Phaser.Physics.Arcade.Group;
  private bombs!: Phaser.Physics.Arcade.Group;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameOver = false;

  constructor() {
    super('game-scene');
  }

  preload() {
    // 预加载资源 - 为基本形状创建图形资源
  }

  create() {
    // 创建蓝色背景
    this.add.rectangle(400, 300, 800, 600, 0x87ceeb); // 天空蓝背景

    // 创建平台
    this.platforms = this.physics.add.staticGroup();

    // 地面平台 - 棕色矩形
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody().setTint(0x8b4513); // 棕色

    // 其他平台 - 棕色矩形
    this.platforms.create(600, 400, 'ground').setTint(0x8b4513);
    this.platforms.create(50, 250, 'ground').setTint(0x8b4513);
    this.platforms.create(750, 220, 'ground').setTint(0x8b4513);

    // 创建玩家 - 使用精灵并设置为蓝色
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setCollideWorldBounds(true);
    this.player.setTint(0x3498db); // 设置为蓝色
    this.player.setDisplaySize(40, 40); // 设置显示大小

    // 创建星星 - 黄色精灵
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    // 为每个星星设置为黄色
    this.stars.children.iterate((child) => {
      const star = child as Phaser.Physics.Arcade.Sprite;
      star.setTint(0xffd700); // 金色
      star.setDisplaySize(20, 20); // 设置显示大小
      star.setBounce(0.5);
      star.setCollideWorldBounds(true);
      star.setVelocity(Phaser.Math.Between(-200, 200), 20);
      return true;
    });

    // 碰撞检测
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);

    // 收集星星
    this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

    // 创建炸弹 - 红色精灵
    this.bombs = this.physics.add.group();

    // 炸弹与平台碰撞
    this.physics.add.collider(this.bombs, this.platforms);

    // 玩家与炸弹碰撞
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);

    // 分数文本
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#000',
    });

    // 键盘输入
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update() {
    if (this.gameOver) {
      return;
    }

    // 设置玩家为无重力状态，实现自由移动
    this.player.setAcceleration(0); // 无加速度
    
    // 玩家移动
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160); // 向上移动
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160); // 向下移动
    } else {
      this.player.setVelocityY(0); // 垂直方向速度为0
    }
  }

  collectStar(object1: any, object2: any) {
    // 确保object2是星星
    const star = object2 as Phaser.Physics.Arcade.Sprite;
    star.disableBody(true, true);

    // 增加分数
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);

    // 如果所有星星都被收集完
    if (this.stars.countActive(true) === 0) {
      // 重新激活所有星星
      this.stars.children.iterate((child) => {
        const star = child as Phaser.Physics.Arcade.Sprite;
        star.enableBody(true, star.x, 0, true, true);
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
      bomb.setBounce(0.5);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  hitBomb() {
    this.physics.pause();

    // 将玩家设置为红色表示游戏结束
    this.player.setTint(0xff0000);

    this.gameOver = true;
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }, // 移除重力
      debug: false,
    },
  },
  scene: GameScene,
};

onMounted(() => {
  game = new Phaser.Game(config);
});

onUnmounted(() => {
  if (game) {
    game.destroy(true);
  }
});
</script>

<style scoped>
#game-container {
  width: 800px;
  height: 600px;
  margin: 20px auto;
  border: 2px solid #333;
  background-color: #000;
}
</style>
