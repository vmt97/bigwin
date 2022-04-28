

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

    onLoad() {
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
    update() {
        cc.log("progress: " , this.progress.value, this.isTweening);
        if (!this.isTweening) return;

        this.labelCoin.string = this.formatMoney(this.progress.value) + "";
        this.uiUpdateWithTargetCoin(this.progress.value);

    },

    setUpInfo() {
        this.targetIndex = 1;
        this.coinAnim = null;
        this.labelCoin.string = "0";
        this.labelCoin.node.opacity = 0;
    },

    showBigWinEffect() {
        let seq = cc.sequence(
            cc.callFunc(() => {
                this.setUpInfo();
                this.spine.setAnimation(0, this.anim_Appear, false);
                this.labelCoin.node.runAction(cc.fadeIn(1.5));
                this.animScaleNode(this.title, 0.4, 1.1);
                this.animScaleNode(this.labelCoin.node, 0.2, 1.2);
                this.activeParticle(true);
                this.activeBtnReset(false);
            }),
            cc.delayTime(1.5),
            cc.callFunc(() => {
                this.spine.setAnimation(0, this.anim_Idle, true);
                this.countingCoin(9);
            })
        );
        this.node.runAction(seq);
    },

    activeParticle(active) {
        if (!active) {
            this.winParticle.node.opacity = 0;
            this.winParticle.stopSystem();
        } else {
            this.winParticle.node.opacity = 255;
            this.winParticle.resetSystem();
        }
    },

    animScaleNode(component, dur, scale) {
        let sequence = cc.repeatForever(cc.sequence(
            cc.scaleTo(dur, scale),
            cc.scaleTo(dur, 1),
        ));
        if (component === this.labelCoin.node)
            this.coinAnim = sequence;
        component.runAction(sequence);
    },

    countingCoin(num) {
        this.isTweening = true;
        this.tweenMoney = cc.tween(this.progress)
            .to(num, { value: this.coinVictory })
            .delay(0.1)
            .call(() => {
                this.labelCoin.string = this.formatMoney(this.coinVictory) + "";
                this.endBigWinEffect();
                this.tweenMoney = null;
                this.isTweening = false;
            }).start();
    },

    uiUpdateWithTargetCoin(progress) {
        if (progress >= this.listVictoryTarget[this.targetIndex]) {
            if (this.targetIndex > this.listVictoryTarget.length - 1) return;
            this.updateTitle(this.targetIndex);
            this.spine.setSkin(this.skinAnim[this.targetIndex]);
            this.spine.setAnimation(0, this.anim_Idle, true);
            this.targetIndex++;
        }
    },

    updateTitle(num) {
        var sequence = cc.sequence(
            cc.spawn(
                cc.scaleTo(0.3, 1.5),
                cc.fadeOut(0.3)
            ),
            cc.callFunc(() => {
                this.title.getComponent(cc.Sprite).spriteFrame = this.listTitle[num];
            }),
            cc.spawn(
                cc.scaleTo(0.3, 1),
                cc.fadeIn(0.3)
            ),
        );
        this.title.runAction(sequence)
    },

    fasterEffect() {
        if (this.targetIndex < 2)
            this.targetIndex++;
        if (this.tweenMoney) {
            this.tweenMoney.stop();
            this.tweenMoney = null;
            this.countingCoin(2);
        }
    },

    endBigWinEffect() {
        this.labelCoin.node.stopAction(this.coinAnim);
        this.activeParticle(false);
        let sq = cc.sequence(
            cc.delayTime(0.1),
            cc.callFunc(() => {
                this.isTweening = false;
            }),
            cc.delayTime(2),
            cc.scaleTo(0.5, 0),
            cc.callFunc(() => {
                this.activeBtnReset(true);
            })
        )
        this.node.runAction(sq)
    },

    activeBtnReset(active) {
        this.btnReset.active = active;
    },

    resetEffect() {
        this.spine.setSkin(this.skinAnim[0]);
        this.title.getComponent(cc.Sprite).spriteFrame = this.listTitle[0];
        this.node.stopAllActions();
        this.node.setScale(1, 1);
        this.progress.value = 0;
        this.showBigWinEffect();
        this.labelCoin.string = "0";
    },

    formatMoney(num) {
        return Intl.NumberFormat('en-US').format(parseInt(num));
    }


});
