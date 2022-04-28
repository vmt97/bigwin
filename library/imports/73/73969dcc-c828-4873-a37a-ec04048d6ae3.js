"use strict";
cc._RF.push(module, '739693MyChIc6N67AQEjWrj', 'BigWinEffect');
// scripts/BigWinEffect.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        nodeSpine: {
            default: null,
            type: cc.Node
        },

        title: {
            default: null,
            type: cc.Node
        },

        labelCoin: {
            default: null,
            type: cc.Label
        },

        listTitle: {
            default: [],
            type: cc.SpriteFrame
        },

        coinBet: {
            default: 0,
            type: cc.Integer
        },

        winParticle: {
            default: null,
            type: cc.ParticleSystem
        },

        btnReset: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function onLoad() {
        this.anim_Appear = "Appear";
        this.anim_Idle = "Idle";
        this.skinAnim = ["Frame_TLon", "Frame_TCLon", "Frame_TSLon"];
        this.listVictoryTarget = [this.coinBet * 20, this.coinBet * 50, this.coinBet * 80];
        this.spine = this.nodeSpine.getComponent("sp.Skeleton");
        this.coinVictory = this.coinBet * 80;

        this.isTweening = false;
        this.showBigWinEffect();
        this.progress = { value: 0 };
    },
    update: function update() {
        cc.log("progress: ", this.progress.value, this.isTweening);
        if (!this.isTweening) return;

        this.labelCoin.string = this.formatMoney(this.progress.value) + "";
        this.uiUpdateWithTargetCoin(this.progress.value);
    },
    setUpInfo: function setUpInfo() {
        this.targetIndex = 1;
        this.coinAnim = null;
        this.labelCoin.string = "0";
        this.labelCoin.node.opacity = 0;
    },
    showBigWinEffect: function showBigWinEffect() {
        var _this = this;

        var seq = cc.sequence(cc.callFunc(function () {
            _this.setUpInfo();
            _this.spine.setAnimation(0, _this.anim_Appear, false);
            _this.labelCoin.node.runAction(cc.fadeIn(1.5));
            _this.animScaleNode(_this.title, 0.4, 1.1);
            _this.animScaleNode(_this.labelCoin.node, 0.2, 1.2);
            _this.activeParticle(true);
            _this.activeBtnReset(false);
        }), cc.delayTime(1.5), cc.callFunc(function () {
            _this.spine.setAnimation(0, _this.anim_Idle, true);
            _this.countingCoin(9);
        }));
        this.node.runAction(seq);
    },
    activeParticle: function activeParticle(active) {
        if (!active) {
            this.winParticle.node.opacity = 0;
            this.winParticle.stopSystem();
        } else {
            this.winParticle.node.opacity = 255;
            this.winParticle.resetSystem();
        }
    },
    animScaleNode: function animScaleNode(component, dur, scale) {
        var sequence = cc.repeatForever(cc.sequence(cc.scaleTo(dur, scale), cc.scaleTo(dur, 1)));
        if (component === this.labelCoin.node) this.coinAnim = sequence;
        component.runAction(sequence);
    },
    countingCoin: function countingCoin(num) {
        var _this2 = this;

        this.isTweening = true;
        this.tweenMoney = cc.tween(this.progress).to(num, { value: this.coinVictory }).delay(0.1).call(function () {
            _this2.labelCoin.string = _this2.formatMoney(_this2.coinVictory) + "";
            _this2.endBigWinEffect();
            _this2.tweenMoney = null;
            _this2.isTweening = false;
        }).start();
    },
    uiUpdateWithTargetCoin: function uiUpdateWithTargetCoin(progress) {
        if (progress >= this.listVictoryTarget[this.targetIndex]) {
            if (this.targetIndex > this.listVictoryTarget.length - 1) return;
            this.updateTitle(this.targetIndex);
            this.spine.setSkin(this.skinAnim[this.targetIndex]);
            this.spine.setAnimation(0, this.anim_Idle, true);
            this.targetIndex++;
        }
    },
    updateTitle: function updateTitle(num) {
        var _this3 = this;

        var sequence = cc.sequence(cc.spawn(cc.scaleTo(0.3, 1.5), cc.fadeOut(0.3)), cc.callFunc(function () {
            _this3.title.getComponent(cc.Sprite).spriteFrame = _this3.listTitle[num];
        }), cc.spawn(cc.scaleTo(0.3, 1), cc.fadeIn(0.3)));
        this.title.runAction(sequence);
    },
    fasterEffect: function fasterEffect() {
        if (this.targetIndex < 2) this.targetIndex++;
        if (this.tweenMoney) {
            this.tweenMoney.stop();
            this.tweenMoney = null;
            this.countingCoin(2);
        }
    },
    endBigWinEffect: function endBigWinEffect() {
        var _this4 = this;

        this.labelCoin.node.stopAction(this.coinAnim);
        this.activeParticle(false);
        var sq = cc.sequence(cc.delayTime(0.1), cc.callFunc(function () {
            _this4.isTweening = false;
        }), cc.delayTime(2), cc.scaleTo(0.5, 0), cc.callFunc(function () {
            _this4.activeBtnReset(true);
        }));
        this.node.runAction(sq);
    },
    activeBtnReset: function activeBtnReset(active) {
        this.btnReset.active = active;
    },
    resetEffect: function resetEffect() {
        this.spine.setSkin(this.skinAnim[0]);
        this.title.getComponent(cc.Sprite).spriteFrame = this.listTitle[0];
        this.node.stopAllActions();
        this.node.setScale(1, 1);
        this.progress.value = 0;
        this.showBigWinEffect();
        this.labelCoin.string = "0";
    },
    formatMoney: function formatMoney(num) {
        return Intl.NumberFormat('en-US').format(parseInt(num));
    }
});

cc._RF.pop();