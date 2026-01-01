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
    // 预加载资源
    // 这里我们使用 Phaser 的内置图形作为示例，实际项目中可以加载图片资源
    // 加载玩家精灵
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/platforms/platform.png');
    this.load.image('star', 'https://labs.phaser.io/assets/sprites/star.png');
    this.load.image('bomb', 'https://labs.phaser.io/assets/sprites/bomb.png');
    this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    // 创建游戏对象
    this.add.image(400, 300, 'sky');

    // 创建平台
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    // 创建玩家
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // 玩家动画
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // 碰撞检测
    this.physics.add.collider(this.player, this.platforms);

    // 创建星星
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate((child) => {
      const star = child as Phaser.Physics.Arcade.Sprite;
      star.setBounce(1);
      star.setCollideWorldBounds(true);
      star.setVelocity(Phaser.Math.Between(-200, 200), 20);
      return true;
    });

    // 星星与平台碰撞
    this.physics.add.collider(this.stars, this.platforms);

    // 收集星星
    this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

    // 创建炸弹
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

    // 玩家移动
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    // 跳跃
    if (this.cursors.up.isDown && this.player.body?.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  collectStar(player: Phaser.Physics.Arcade.Sprite, star: Phaser.Physics.Arcade.Sprite) {
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

      // 创建一个炸弹
      const x = this.player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      const bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  hitBomb() {
    this.physics.pause();

    this.player.setTint(0xff0000);
    this.player.anims.play('turn');

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
      gravity: { x: 0, y: 300 },
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
