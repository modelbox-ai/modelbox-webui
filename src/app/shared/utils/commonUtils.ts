import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CommonUtils {
    public isOnAnimate = false;
    constructor() {}

    // 右上角错误信息提示
    public getMessages = (): Array<any> => [];

    msgAnimate = (
        msgs,
        interval,
        totalTime,
        addTop,
        callBackOnMoveFineshed,
        callBackOnDismiss,
        callBackOnFinished
    ) => {
        const maxChangeCount = totalTime / interval;
        const addTopTimes = addTop / maxChangeCount;

        const changeTop = () => {
            let isEnd = false;
            for (let i = 0; i < msgs.length; i += 1) {
                const msg = msgs[i];
                if (msg.isAnimate && !msg.isFinished) {
                    if (msg.timeCount <= maxChangeCount) {
                        msg.startTop =
                            msg.timeCount === 0 ? msg.top : msg.startTop;
                        msg.top =
                            this.getTopMessagesHeight(msgs, i, addTop) -
                            (maxChangeCount - msg.timeCount) * addTopTimes;
                        msg.timeCount += 1;
                    } else {
                        isEnd = true;
                        callBackOnMoveFineshed(msg);
                    }
                }
            }
            if (isEnd) {
                callBackOnDismiss();
            } else {
                setTimeout(() => {
                    changeTop();
                }, interval);
            }
        };

        for (let i = 0; i < msgs.length; i += 1) {
            const msg = msgs[i];
            msg.timeCount = 0;
        }
        changeTop();
    };

    // 获取当前msg的高度
    getMessageoffsetHeight = (msgs, index) => {
        if (!msgs[index].isReadyForAnimate) {
            return;
        }
        const messageDom = window.document.getElementById('message-' + index);
        if (!messageDom) {
            return;
        }
        const height = messageDom.offsetHeight;
        msgs[index].height = height;
    };
    // 获取之前msgs的总高度
    getTopMessagesHeight = (msgs, index, margin): number => {
        let totalHeight = 0;
        for (let i = index + 1; i < msgs.length; i += 1) {
            let height = msgs[i].height;
            if (!height) {
                this.getMessageoffsetHeight(msgs, i);
            }
            height = msgs[i].height;
            totalHeight += height + height ? height + margin : 0;
        }
        return totalHeight;
    };

    msgDismiss = (msgs, interval, totalTime, callBackOnFinished) => {
        const changeOpicity = msg => {
            if (msg.opacityCount < totalTime) {
                msg.opacityCount += 1000;
                setTimeout(() => {
                    changeOpicity(msg);
                }, interval);
            } else {
                callBackOnFinished(msg);
            }
        };
        for (let i = 0; i < msgs.length; i += 1) {
            const msg = msgs[i];
            if (!msg.isReadyForAnimate) {
                continue;
            }
            if (!msg.isDismissing) {
                msg.isDismissing = true;
                msg.opacityCount = 0;
                changeOpicity(msg);
            }
        }
    };

    addMessage = (
        text: string,
        type: 'success' | 'error' | 'warn' | 'prompt',
        dismissOnTimeout: number
    ) => {
        const msgs = this.getMessages();
        const msg = {
            timeCount: 0,
            label: text,
            type: type,
            open: true,
            height: 42,
            top: -10,
            startTop: 10,
            dismissTimeOut: dismissOnTimeout,
        };
        msgs.push(msg);
        this.messageAnimateOnAdd(msgs);
    };
    /**
     * 显示信息 右上角"success" | "error" | "warn" | "prompt"
     * @param text 显示的文案
     * @param type 显示的类型
     * @param dismissOnTimeout 延时:提示、成功类5秒后自动消失，错误类提示10秒消失
     */
    public messageShow = (
        text: string,
        type: 'success' | 'error' | 'warn' | 'prompt' = 'success'
    ) => {
        let dismissOnTimeout: number = 2000; //实际为3s
        if (type === 'error') {
            dismissOnTimeout = 5000; //实际为6s
        }
        this.addMessage(text, type, dismissOnTimeout);
    };

    // 增加消息时的动画
    messageAnimateOnAdd = msgs => {
        this.isOnAnimate = true;
        // 首先msgs得有数据
        if (msgs.length < 0) {
            this.isOnAnimate = false;
            return;
        }
        this.animateNewMessage(msgs);
    };

    animateNewMessage = msgs => {
        const MSG_ANIMATE_INTERVAL = 1000;
        const MSG_ANIMATE_Move_TOTAL_TIME = 125;
        const MSG_ANIMATE_ADD_TOP = 10;

        if (msgs.length <= 0) {
            this.isOnAnimate = false;
            return;
        }

        let hasCanAnimate = false;
        // 遍历所有消息，寻找还没有移动的消息，移动他 坐标从小到大，以此加入动画的。。所以逻辑有这个在里面
        for (let i = 0; i < msgs.length; i += 1) {
            const msg = msgs[i];
            // 最先遍历出来的肯定是已经开始动画的或者一个都没有开始
            // 然后就是遍历出准备动画的,或者一个都没有准备
            if (msg.isReadyForAnimate && !msg.isAnimate) {
                // 如果准备动画
                // 再之前的消息没消失前再次加入消息，
                // 首先改变高度，将第加入消息显示出来.此时需要将之前的动画全部下移消息框高度
                // 如果是最后一个消息，则不再加入动画了
                if (i === msgs.length - 1) {
                    continue;
                }
                for (let j = 0; j <= i; j += 1) {
                    const moveMsg = msgs[j];
                    moveMsg.top = this.getTopMessagesHeight(
                        msgs,
                        i,
                        MSG_ANIMATE_ADD_TOP
                    );
                }
                // 然后给之前的消息加入下移动画,因为之前的所有消息只有准备开始动画的还没动画，其他的已经开始动画了。
                // 将准备动画的消息状态改为正在动画
                msg.isAnimate = true;
                // 有新加入的可动画消息.
                hasCanAnimate = true;
            }
            // 然后遍历出的第一个没有准备动画的 就让它准备动画,之后遍历的什么都不做。
            if (!msg.isReadyForAnimate) {
                // 第一次添加一个消息，让他直接显示，什么也不做就结束了。另外给他加上消失计时
                msg.isReadyForAnimate = true;
                this.msgDismiss(
                    msgs,
                    MSG_ANIMATE_INTERVAL,
                    msg.dismissTimeOut,
                    stopMsg => {
                        stopMsg.isFinished = true;
                        // 将已经结束的消息，从数组中移除
                        // 已经结束的消息，一定是在数组末尾部分。不推荐使用这种机能；
                        // 注：及时删除消息框可以防止消息位置挡住页面，造成用户不能点击
                        let isClear = false;
                        // 注意：这里使用while的原因是因为 每当splice调用，数组的长度会发生改变，需要重新使用for循环重新遍历；
                        // 当然可以记录下标的位置，从下标位置继续遍历，不过下标位置要计算精确，不然容易出bug
                        while (!isClear) {
                            isClear = true;
                            for (let k = 0; k < msgs.length; k += 1) {
                                if (msgs[k].isFinished) {
                                    msgs.splice(k, 1);
                                    isClear = false;
                                    break;
                                }
                            }
                        }
                    }
                );
                break;
            }
        }
        // 没有可激活的动画 注：动画存在状态： 已经移动完毕，但是需要等待消失，此状态存在于数组，但是不可再次激活动画
        if (!hasCanAnimate) {
            // 动画方法退出，需要重新从外部调用此方法才能开始新的循环
            this.isOnAnimate = false;
            return;
        }

        // 当有新的可动画消息时调用下面方法
        this.msgAnimate(
            msgs,
            MSG_ANIMATE_INTERVAL,
            MSG_ANIMATE_Move_TOTAL_TIME,
            MSG_ANIMATE_ADD_TOP,
            msg => {
                // 移动动画已完结
                msg.moveingFinished = true;
            },
            () => {
                // 准备开始消失动画
                // 便利数组，确定所有动画的移动是否已经完结
                let needAddNew = true;
                for (let i = 0; i < msgs.length; i += 1) {
                    const msg = msgs[i];
                    if (msg.isAnimate && !msg.moveingFinished) {
                        // 还存在需要完结的动画
                        needAddNew = false;
                        break;
                    }
                }
                // 当一组动画完毕，查看消息组，是否都已经显示了，如果有未显示的消息，显示新的消息。
                if (needAddNew) {
                    this.animateNewMessage(msgs);
                }
            },
            msg => {
                // 消失动画已完结
                msg.isFinished = true;
            }
        );
    };
}
