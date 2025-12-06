//// ====================================
//// ローディング画面
//// ====================================
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img'); // ページ内の全画像を取得
        const totalImages = images.length;
        let loadedImages = 0;
    
        const countElement = document.getElementById('count');
        const loadingWrapper = document.getElementById('loadingWrapper');
    
        function updateProgress() {
            loadedImages++;
            const percentComplete = Math.round((loadedImages / totalImages) * 100);
            countElement.textContent = percentComplete;
    
            // すべての画像が読み込まれたら
            if (loadedImages === totalImages) {
                setTimeout(function() {
                    loadingWrapper.style.opacity = '0';
                    setTimeout(function() {
                        loadingWrapper.style.display = 'none';
                    }, 300); // フェードアウトのための遅延
                }, 500); // 少しの遅延を加える
            }
        }
    
        // 各画像の読み込み完了を監視
        images.forEach(function(image) {
            if (image.complete) {
                updateProgress(); // 既に読み込まれている場合もカウント
            } else {
                image.addEventListener('load', updateProgress);
                image.addEventListener('error', updateProgress); // エラー時もカウント
            }
        });
    });

//// ====================================
//// ポケットのアニメーション
//// ====================================
// メディアクエリの定義 (CSSと一致させる)
const MOBILE_QUERY = window.matchMedia('(max-width: 768px)');

$(function () {
    if (MOBILE_QUERY.matches) {
        //// ====================================
        //// sp版の設定
        //// ====================================
        // 丸と四角が下がっていく速度の調整用
        const speedCircle__sp = 0.2;
        // ポケットが下がっていく速度の調整用
        const speedPocket__sp = 0.30;//！！！！！元の値0.36！！！！！
        // ポケットが拡大する速度の調整用
        const expandSpeedPocket__sp = 160;//！！！！！元の値240！！！！！
        // ロゴテキストとステッチのフェードアウトが完了するスクロール位置
        const fadeOutEnd__sp = 400;
        // ポケットの拡大が完了するスクロール位置
        const expandEnd__sp = 640;//！！！！！元の値640！！！！！
        // カードの出現が完了するスクロール位置
        const CardEnd__sp = 800; 
        // カードが出てくる速度の調整用
        const speedCard__sp = 0.73;//！！！！！元の値0.73！！！！！
        //コンセプト内容のフェードインが完了するまでのスクロール位置
        const fadeInEnd__sp = 1000;
        // ポケットの拡大が画面幅いっぱいまで完了するスクロール位置
        const maxExpandEnd__sp = 2000;
        // const maxExpandEnd = 2200;
        // ポケットが画面いっぱいまで拡大する速度の調整用
        const maxExpandSpeedPocket__sp = 140;
        // コンセプトの内容が上がっていく速度の調整用
        const speedConcept__sp = 0.60;

        // ★scroll位置からポケットのscaleを毎回一意に決める関数★
        function getPocketScale(scroll) {
            if (scroll <= fadeOutEnd__sp) {
                // 一番上付近は等倍
                return 1;
            } else if (scroll <= expandEnd__sp) {
                // 400〜640 の間で 1 → 2 に
                return 1 + (scroll - fadeOutEnd__sp) / expandSpeedPocket__sp;
            } else if (scroll <= fadeInEnd__sp) {
                // 640〜1000 の間は 2 のまま
                return 2.5;
            } else if (scroll <= maxExpandEnd__sp) {
                // 1000〜3000 の間で 2 からさらに拡大
                return 2.5 + (scroll - fadeInEnd__sp) / maxExpandSpeedPocket__sp;
            } else {
                // それ以降は最大値のまま
                return 2.5 + (maxExpandEnd__sp - fadeInEnd__sp) / maxExpandSpeedPocket__sp;
            }
        }

        $(window).scroll(function () {
            // 現在のスクロール量を取得
            let scroll = $(this).scrollTop();
            
            // ★どの条件でも必ずポケットのscaleを更新★
            const pocketScale__sp = getPocketScale(scroll);
            $(".pocket").css({
                transform: "scale(" + pocketScale__sp + ")"
            });

            if (scroll <= fadeOutEnd__sp) {
                //前回のスクロールで消していたポケット、丸、四角、ロゴ、ステッチ、カードを出現させる
                $(".pocket, .pocketCircle, .pocketSquare, .logoBox, .stitch, .cardOuterBox, .concept"
                // $(".pocket, .pocketCircle, .pocketSquare, .logoBox, .stitch, .cardOuterBox"
                ).css("display", "block");
                //透明にしていたポケット、ロゴ、ステッチ、コンセプトの不透明度を最大値にする
                $(".pocket, .logoBox, .stitch, .fv__img--sp, .fv__img--sp--2nd").css({
                    opacity: 1
                });
                //前回で出現させたカード、コンセプトの不透明度を0にする
                $(".cardOuterBox, .concept").css({
                    opacity: 0
                });
                // $(".cardOuterBox, .concept").css({
                //     opacity: 0
                // })
                //前回移動したポケットの位置を初期位置に戻しておく
                $(".pocket").css({
                    top: "300px"
                });

                // 丸の初期位置にスクロール量 * 速度 を加算
                let newTop = 275 + scroll * speedCircle__sp;
                // 不透明度 (opacity) の計算
                let opacity = 1 - (scroll / fadeOutEnd__sp);
                // opacityの値を 0.0 から 1.0 の間に制限する
                // スクロール量が多すぎてもマイナスにならないようにする
                if (opacity < 0) {
                    opacity = 0;
                } else if (opacity > 1) {
                    opacity = 1; // スクロール完了位置より後では不透明を維持
                }
                // 四角と丸を下げる
                $(".pocketCircle, .pocketSquare").css({
                    top: newTop + "px"
                });
                //ロゴテキストとステッチをフェードアウトする
                $(".logoBox, .stitch").css({
                    opacity: opacity
                });
            } else if (scroll > fadeOutEnd__sp && scroll <= expandEnd__sp) {
                // 初期位置にスクロール量 * 速度 を加算
                let newTopPocket = 300 + (scroll - fadeOutEnd__sp) * speedPocket__sp;

                $(".pocket").css({
                    // スクロールに合わせてポケットの位置を中央から少し下げていく
                    top: newTopPocket + "px"
                })
                //ロゴテキスト、ステッチをきれいに消す
                $(".logoBox, .stitch").css({
                    opacity: 0
                });
                //逆方向スクロール時にカードを消す
                $(".cardOuterBox").css({
                    opacity: 0
                })

            } else if (scroll > expandEnd__sp  && scroll <= CardEnd__sp) {
                // 初期位置にスクロール量 * 速度 を加算
                let newTopCard = 280 - (scroll - 640) * speedCard__sp;
                $(".cardOuterBox").css({
                    opacity: 1,
                    // スクロールに合わせてカードの位置を上げる
                    "top": newTopCard + "px"
                })
                //逆方向スクロール時にコンセプト内容を消す
                $(".concept").css({
                    opacity: 0
                });

            } else if (scroll > CardEnd__sp  && scroll <= fadeInEnd__sp) {
                // 不透明度 (opacity) の計算
                let opacityConcept = (scroll - CardEnd__sp) / (fadeInEnd__sp - CardEnd__sp);
                // $(".concept").css("display", "block");
                console.log(opacityConcept);
                if (opacityConcept < 0) {
                    opacityConcept = 0;
                } else if (opacityConcept > 1) {
                    opacityConcept = 1; // スクロール完了位置より後では不透明を維持
                }
                const elements = document.querySelectorAll('.concept');
                elements.forEach((element) => {
                const computedStyle = window.getComputedStyle(element);
                console.log(`Opacity:`, computedStyle.opacity);
                })
                // スクロールに合わせてコンセプト内容をフェードイン
                $(".concept").css({
                    opacity: opacityConcept
                });
                // console.log(12);
                $(".pocketCircle, .pocketSquare, .logoBox, .stitch, .cardOuterBox .concept"
                ).css("display", "block");

            } else if (scroll > fadeInEnd__sp  && scroll <= maxExpandEnd__sp) {
                // 初期位置にスクロール量 * 速度 を加算 
                // opacityConcept = 0;
                let newTopConcept = 286 - (scroll - fadeInEnd__sp) * speedConcept__sp;
                
                $(".concept").css({
                // スクロールに合わせてコンセプト内容の位置を上げる
                    top: newTopConcept+ "px"
                })
                //逆スクロール時に表示する
                $(".pocket").fadeIn(500)
            } else if (scroll > maxExpandEnd__sp) {
                //非表示に
                $(".pocket").fadeOut(500)
                $(".pocketCircle, .pocketSquare, .logoBox, .stitch, .cardOuterBox, .concept"
                // $(".pocketCircle, .pocketSquare, .logoBox, .stitch, .cardOuterBox"
                ).css("display", "none");
                $(".fv__img--sp, .fv__img--sp--2nd"
                ).css("opacity", 0)
            } 
        });
    } else {
        //// ====================================
        //// pc版の設定
        //// ====================================
        // 丸と四角が下がっていく速度の調整用
        const speedCircle = 0.2;
        // ポケットが下がっていく速度の調整用
        const speedPocket = 0.36;
        // ポケットが拡大する速度の調整用
        const expandSpeedPocket = 240;
        // ロゴテキストとステッチのフェードアウトが完了するスクロール位置
        const fadeOutEnd = 400;
        // ポケットの拡大が完了するスクロール位置
        const expandEnd = 640;
        // カードの出現が完了するスクロール位置
        const CardEnd = 800; 
        // カードが出てくる速度の調整用
        const speedCard = 0.73;
        //コンセプト内容のフェードインが完了するまでのスクロール位置
        const fadeInEnd = 1000;
        // ポケットの拡大が画面幅いっぱいまで完了するスクロール位置
        const maxExpandEnd = 3000;
        // const maxExpandEnd = 2200;
        // ポケットが画面いっぱいまで拡大する速度の調整用
        const maxExpandSpeedPocket = 200;
        // コンセプトの内容が上がっていく速度の調整用
        const speedConcept = 0.6;

        // ★scroll位置からポケットのscaleを毎回一意に決める関数★
        function getPocketScale(scroll) {
            if (scroll <= fadeOutEnd) {
                // 一番上付近は等倍
                return 1;
            } else if (scroll <= expandEnd) {
                // 400〜640 の間で 1 → 2 に
                return 1 + (scroll - fadeOutEnd) / expandSpeedPocket;
            } else if (scroll <= fadeInEnd) {
                // 640〜1000 の間は 2 のまま
                return 2;
            } else if (scroll <= maxExpandEnd) {
                // 1000〜3000 の間で 2 からさらに拡大
                return 2 + (scroll - fadeInEnd) / maxExpandSpeedPocket;
            } else {
                // それ以降は最大値のまま
                return 2 + (maxExpandEnd - fadeInEnd) / maxExpandSpeedPocket;
            }
        }

        $(window).scroll(function () {
            // 現在のスクロール量を取得
            let scroll = $(this).scrollTop();
            
            // ★どの条件でも必ずポケットのscaleを更新★
            const pocketScale = getPocketScale(scroll);
            $(".pocket").css({
                transform: "scale(" + pocketScale + ")"
            });
            

            if (scroll <= fadeOutEnd) {
                //前回のスクロールで消していたポケット、丸、四角、ロゴ、ステッチ、カードを出現させる
                $(".pocket, .pocketCircle, .pocketSquare, .logoBox, .stitch, .cardOuterBox, .concept"
                // $(".pocket, .pocketCircle, .pocketSquare, .logoBox, .stitch, .cardOuterBox"
                ).css("display", "block");
                //透明にしていたポケット、ロゴ、ステッチ、コンセプトの不透明度を最大値にする
                $(".pocket, .logoBox, .stitch").css({
                    opacity: 1
                });
                //前回で出現させたカードの不透明度を0にする
                $(".cardOuterBox").css({
                    opacity: 0
                });
                // $(".cardOuterBox, .concept").css({
                //     opacity: 0
                // })
                //前回移動したポケットの位置を初期位置に戻しておく
                $(".pocket").css({
                    top: "300px"
                });
                 $(".profileContainer").css({
                    opacity: 0
                 })

                // 丸の初期位置(250px)にスクロール量 * 速度 を加算
                let newTop = 250 + scroll * speedCircle;
                // 不透明度 (opacity) の計算
                let opacity = 1 - (scroll / fadeOutEnd);
                // opacityの値を 0.0 から 1.0 の間に制限する
                // スクロール量が多すぎてもマイナスにならないようにする
                if (opacity < 0) {
                    opacity = 0;
                } else if (opacity > 1) {
                    opacity = 1; // スクロール完了位置より後では不透明を維持
                }
                // 四角と丸を下げる
                $(".pocketCircle, .pocketSquare").css({
                    top: newTop + "px"
                });
                //ロゴテキストとステッチをフェードアウトする
                $(".logoBox, .stitch").css({
                    opacity: opacity
                });
                } else if (scroll > fadeOutEnd && scroll <= expandEnd) {
                // 初期位置(300px)にスクロール量 * 速度 を加算
                let newTopPocket = 300 + (scroll - fadeOutEnd) * speedPocket;

                $(".pocket").css({
                    // スクロールに合わせてポケットの位置を中央から少し下げていく
                    top: newTopPocket + "px"
                })
                //ロゴテキスト、ステッチをきれいに消す
                $(".logoBox, .stitch").css({
                    opacity: 0
                });
                //逆方向スクロール時にコンセプト内容を消す
                $(".cardOuterBox").css({
                    opacity: 0
                })

            } else if (scroll > expandEnd  && scroll <= CardEnd) {
                // 初期位置にスクロール量 * 速度 を加算
                let newTopCard = 256 - (scroll - 640) * speedCard;
                $(".cardOuterBox").css({
                    opacity: 1,
                    // スクロールに合わせてカードの位置を上げる
                    "top": newTopCard + "px"
                })
                //逆方向スクロール時にコンセプト内容を消す
                $(".concept").css({
                    opacity: 0
                });

            } else if (scroll > CardEnd  && scroll <= fadeInEnd) {
                // 不透明度 (opacity) の計算
                let opacityConcept = (scroll - CardEnd) / (fadeInEnd - CardEnd);
                if (opacityConcept < 0) {
                    opacityConcept = 0;
                } else if (opacityConcept > 1) {
                    opacityConcept = 1; // スクロール完了位置より後では不透明を維持
                }
                // スクロールに合わせてコンセプト内容をフェードイン
                $(".concept").css({
                    opacity: opacityConcept
                });
                $(".pocketCircle, .pocketSquare, .logoBox, .stitch, .cardOuterBox .concept"
                ).css("display", "block");

            } else if (scroll > fadeInEnd  && scroll <= maxExpandEnd) {
                // 初期位置にスクロール量 * 速度 を加算
                let newTopConcept = 272 - (scroll - fadeInEnd) * speedConcept;
                
                $(".concept").css({
                // スクロールに合わせてコンセプト内容の位置を上げる
                    top: newTopConcept+ "px"
                })
                //逆スクロール時に表示する
                $(".pocket").fadeIn(500)
            } else if (scroll > maxExpandEnd) {
                //非表示に
                $(".pocket").fadeOut(500)
                $(".pocketCircle, .pocketSquare, .logoBox, .stitch, .cardOuterBox, .concept"
                // $(".pocketCircle, .pocketSquare, .logoBox, .stitch, .cardOuterBox"
                ).css("display", "none");
            } 
        });
    }
})

//// ====================================
//// ネガフィルムのアニメーション
//// ====================================
//画像の自動スクロール（右方向）
$(function () {
    $(".scroll-infinity__list--right").slick({
    autoplay: true, // 自動でスクロール
    autoplaySpeed: 0, // 自動再生のスライド切り替えまでの時間を設定
    speed: 4000, // スライドが流れる速度を設定
    cssEase: "linear", // スライドの流れ方を等速に設定
    slidesToShow: 8, // 表示するスライドの数
    swipe: false, // 操作による切り替えはさせない
    arrows: false, // 矢印非表示
    pauseOnFocus: false, // スライダーをフォーカスした時にスライドを停止させるか
    pauseOnHover: false, // スライダーにマウスホバーした時にスライドを停止させるか
    rtl: true, //RTL (Right-to-Left) モード（流れる方向を左から右へ）を有効にする
    //レスポンシブを設定してみたがうまく機能してない
    responsive: [
            {
                // 画面幅が1024px以下の場合に適用
                breakpoint: 1024,
                settings: {
                    slidesToShow: 6, // 6枚表示
                    // 必要であれば他の設定も変更可能
                }
            },
            {
                // 画面幅が768px以下の場合に適用
                breakpoint: 768,
                settings: {
                    slidesToShow: 4, // 4枚表示
                }
            },
            {
                // 画面幅が480px以下の場合に適用
                breakpoint: 480,
                settings: {
                    slidesToShow: 2, // 2枚表示
                }
            }
        ]
    
    });
});

//画像の自動スクロール（左方向）
$(function () {
    $(".scroll-infinity__list--left").slick({
    autoplay: true, // 自動でスクロール
    autoplaySpeed: 0, // 自動再生のスライド切り替えまでの時間を設定
    speed: 4000, // スライドが流れる速度を設定
    cssEase: "linear", // スライドの流れ方を等速に設定
    slidesToShow: 5, // 表示するスライドの数
    swipe: false, // 操作による切り替えはさせない
    arrows: false, // 矢印非表示
    pauseOnFocus: false, // スライダーをフォーカスした時にスライドを停止させるか
    pauseOnHover: false, // スライダーにマウスホバーした時にスライドを停止させるか
    //レスポンシブを設定してみたがうまく機能してない
    responsive: [
            {
                // 画面幅が1024px以下の場合に適用
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4, // 4枚表示
                    // 必要であれば他の設定も変更可能
                }
            },
            {
                // 画面幅が768px以下の場合に適用
                breakpoint: 768,
                settings: {
                    slidesToShow: 3, // 3枚表示
                }
            },
            {
                // 画面幅が480px以下の場合に適用
                breakpoint: 480,
                settings: {
                    slidesToShow: 2, // 2枚表示
                }
            }
        ]
    });
});

// 以下、スクロールしてネガフィルムが現れたらアニメーション用のクラスを付与する
// const imagesRight = document.querySelectorAll('.scroll-infinity__list--right');
const imagesNegaFilmRight = document.querySelectorAll('.negaFilmSmall');
const animationClassNameFilmRight = 'img-animation-film--right';

const observerNegaFilmRight = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add(animationClassNameFilmRight);
        } else {
            entry.target.classList.remove(animationClassNameFilmRight);
        }
    });
});

imagesNegaFilmRight.forEach((image) => {
observerNegaFilmRight.observe(image);
});

const imagesRight = document.querySelectorAll('.scroll-infinity__list--right');
const animationClassNameRight = 'img-animation--right';

const observerRight = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add(animationClassNameRight);
        } else {
            entry.target.classList.remove(animationClassNameRight);
        }
    });
});

imagesRight.forEach((image) => {
observerRight.observe(image);
});

const imagesNegaFilmLeft = document.querySelectorAll('.negaFilmBig');
const animationClassNameFilmLeft = 'img-animation-film--left';

const observerNegaFilmLeft = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add(animationClassNameFilmLeft);
        } else {
            entry.target.classList.remove(animationClassNameFilmLeft);
        }
    });
});

imagesNegaFilmLeft.forEach((image) => {
observerNegaFilmLeft.observe(image);
});

// 以下、スクロールしてネガフィルムが現れたらアニメーション用のクラスを付与する
const imagesLeft = document.querySelectorAll('.scroll-infinity__list--left');
const animationClassNameLeft = 'img-animation--left';

const observerLeft = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add(animationClassNameLeft);
        } else {
            entry.target.classList.remove(animationClassNameLeft);
        }
    });
});

imagesLeft.forEach((image) => {
observerLeft.observe(image);
});

//背景のネガフィルムをふわっと出現させる（左）
const imagesFilmBackLeft = document.querySelectorAll('.negaFilm__back--left');
const animationFilmBackLeft = 'animationFilmBackLeft';

const observerFilmBackLeft = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add(animationFilmBackLeft);
        } else {
            entry.target.classList.remove(animationFilmBackLeft);
        }
    });
});

imagesFilmBackLeft.forEach((image) => {
observerFilmBackLeft.observe(image);
});

//背景のネガフィルムをふわっと出現させる（右）
const imagesFilmBackRight = document.querySelectorAll('.negaFilm__back--right');
const animationFilmBackRight = 'animationFilmBackRight';

const observerFilmBackRight = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add(animationFilmBackRight);
        } else {
            entry.target.classList.remove(animationFilmBackRight);
        }
    });
});

imagesFilmBackRight.forEach((image) => {
observerFilmBackRight.observe(image);
});

//// ====================================
//// 虫眼鏡のアニメーション
//// ====================================
const profileContainerElement = document.querySelector('.profileContainer');
const triggerElement = document.querySelector('.sticky-trigger-marker');
const MOBILE_QUERY_loupe = window.matchMedia('(max-width: 700px)');
// Intersection Observer のオプション設定
$(function () {
    if (MOBILE_QUERY_loupe.matches) {
        const options = {
            // rootMargin: '0px' はビューポートの端を基準にする
            // top: [sticky: 0] と同じ位置で交差を検出
            // rootMargin: '-1px 0px 0px 0px',
            rootMargin: '-216px 0px 0px 0px',
            threshold: 0 // 監視ターゲットの0%が見えたらトリガー
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
            // isIntersecting が false になった時 = 監視ターゲットが画面外 (上) に出た時
                if (!entry.isIntersecting) {
                    // sticky 要素にクラスを追加 (固定開始)
                    profileContainerElement.classList.add('is-stuck');
                } else {
                    // 監視ターゲットが再び画面内 (下) に入った時
                    profileContainerElement.classList.remove('is-stuck');
                }
            });
        }, options);

        // 監視ターゲットの監視を開始
        observer.observe(triggerElement);

    } else {
        const options = {
            rootMargin: '-296px 0px 0px 0px',
            threshold: 0 // 監視ターゲットの0%が見えたらトリガー
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // isIntersecting が false になった時 = 監視ターゲットが画面外 (上) に出た時
                if (!entry.isIntersecting) {
                    // sticky 要素にクラスを追加 (固定開始)
                    profileContainerElement.classList.add('is-stuck');
                } else {
                    // 監視ターゲットが再び画面内 (下) に入った時
                    profileContainerElement.classList.remove('is-stuck');
                }
            });
        }, options);

        // 監視ターゲットの監視を開始
        observer.observe(triggerElement);
    }
});



//// ====================================
//// ペンのアクション
//// ====================================
//アンダーライン
document.addEventListener("DOMContentLoaded", function() {
    // 1. 監視対象の要素をすべて取得
    const lineElements = document.querySelectorAll('.underLine');

    // 2. Observerのオプション設定
    const lineOptions = {
        root: null, // ビューポートを監視ルートとする
        rootMargin: '0px',
        threshold: 0.1 // 要素が10%見えたら交差と判定
    };

    // 3. Observerのコールバック関数を定義
    const lineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // 要素が交差した（画面内に入った）場合
            if (entry.isIntersecting) {
                // アニメーションを起動するクラスを追加
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, lineOptions);

    // 4. すべての要素の監視を開始
    lineElements.forEach(element => {
        lineObserver.observe(element);
    });
});

//ペンの動き
document.addEventListener("DOMContentLoaded", function() {
    // 1. 監視対象の要素をすべて取得
    const elements = document.querySelectorAll('.penIllust');

    // 2. Observerのオプション設定
    const options = {
        root: null, // ビューポートを監視ルートとする
        rootMargin: '0px',
        threshold: 0.1 // 要素が10%見えたら交差と判定
    };

    // 3. Observerのコールバック関数を定義
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // 要素が交差した（画面内に入った）場合
            if (entry.isIntersecting) {
                // アニメーションを起動するクラスを追加
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
        }
                // アニメーションは一度だけで良いため、監視を終了する
                // observer.unobserve(entry.target);
            // }
        });
    }, options);

    // 4. すべての要素の監視を開始
    elements.forEach(element => {
        observer.observe(element);
    });
});

//// ====================================
//// フッターのアクション
//// ====================================
$(function () {
    //// ====================================
    //// 緑色の四角を出現させる
    //// ====================================
    // const greenSquareElement = document.querySelector('.greenSquare');
    // const triggerFormEndElement = document.querySelector('.triggerFormEnd');

    // // Intersection Observer のオプション設定
    // const options = {
    // // rootMargin: '0px' はビューポートの端を基準にする
    // // topから以下の距離の交差を検出
    // rootMargin: '350px 0px 0px 0px',
    // threshold: 0 // 監視ターゲットの0%が見えたらトリガー
    // };

    // const observerForm = new IntersectionObserver((entries) => {
    // entries.forEach(entry => {
    // // isIntersecting が false になった時 = 監視ターゲットが画面外 (上) に出た時
    // if (!entry.isIntersecting) {
    // // sticky 要素にクラスを追加 (固定開始)
    // greenSquareElement.classList.add('triggerOnSquare');
    // } else {
    // // 監視ターゲットが再び画面内 (下) に入った時
    // greenSquareElement.classList.remove('triggerOnSquare');
    // }
    // });
    // }, options);

    // // 監視ターゲットの監視を開始
    // observerForm.observe(triggerFormEndElement);

    //// ========================================
    //// 黄色の丸と緑色の四角を小さくしながら移動させる
    //// ========================================
    // 丸が速度の調整用
    const speedTopCircle = 0.3;
    const speedTopSquare = 0.145;
    const shrinkSpeedCircle = 3000;
    const shrinkSpeedSquare = 4300;
    const copyrightend = 12000;
    const circleSquareend = 12300;
    // ポケットが下がっていく速度の調整用
    // const speedPocket = 0.36;

    // ポケットの拡大が画面幅いっぱいまで完了するスクロール位置
    const footerAnimationStart = 9000;
    const footerAnimationEnd = 12000;
    $(window).scroll(function () {
        // 現在のスクロール量を取得
        let scroll = $(this).scrollTop();//下端は8310
        // console.log(scroll);
        

        // ★scroll位置からポケットのscaleを毎回一意に決める関数★
        function getPocketScale(scroll) {
            if (scroll <= footerAnimationStart) {
                // 一番上付近は等倍
                return 1;
            } else {
                // それ以降は最大値のまま
                return 1 - (scroll - footerAnimationStart) / shrinkSpeedCircle;
            }
        }

        // $(window).scroll(function () {
            // 現在のスクロール量を取得
            // let scroll = $(this).scrollTop();
            
            // ★どの条件でも必ずポケットのscaleを更新★
            // const pocketScale = getPocketScale(scroll);
            const sumCircle = getPocketScale(scroll);
            // $(".pocket").css({
            //     transform: "scale(" + pocketScale + ")"
            // });
            // console.log(`Scroll: ${scroll}, Limit: ${limit}, Target: ${limit - threshold}`);
            // console.log(`sumCircle: ${sumCircle}`);
            $(".yellowCircle").css({
                // スクロールに合わせて黄色の丸を小さくしていく
                transform: "scale(" + sumCircle + ")"
                // transform: "translateX(-50%, 0) scale(" + sumCircle + ")"
                // スクロールに合わせて黄色の丸の不透明度を上げていく
                // opacity: opacityCircle
            });
        // })

        // if (scroll > footerAnimationStart) {
        //     // 丸の初期位置(250px)にスクロール量 * 速度 を加算
        //     let newTopCircle = 396 - (scroll - footerAnimationStart) * speedTopCircle;
        //     let newTopSquare = -396 + (scroll - footerAnimationStart) * speedTopSquare;
        //     // 不透明度 (opacity) の計算
        //     let opacityCircle = 0 + (scroll / footerAnimationEnd);
        //     // opacityの値を 0.0 から 1.0 の間に制限する
        //     // スクロール量が多すぎてもマイナスにならないようにする
        //     if (opacityCircle < 0) {
        //         opacityCircle = 0;
        //     } else if (opacityCircle > 1) {
        //         opacityCircle = 1; // スクロール完了位置より後では不透明を維持
        //     }
        //     // ポケットの大きさ+スクロール量 / 拡大速度の調整
        //     let sumCircle = 1 - (scroll - footerAnimationStart) / shrinkSpeedCircle;
        //     let sumSquare = 1 - (scroll - footerAnimationStart) / shrinkSpeedSquare;
        //     // console.log(sumCircle);
        //     // console.log(newTopCircle);
        //     $(".yellowCircleContainer").css({
        //         // スクロールに合わせて黄色の丸を上げていく
        //         // top: newTopCircle + "px",
        //     });
        //     $(".yellowCircle").css({
        //         // スクロールに合わせて黄色の丸を小さくしていく
        //         // transform: "translateX(-50%) scale(" + sumCircle + ")",
        //         // transform: "translateX(-50%, 0) scale(" + sumCircle + ")",
        //         // スクロールに合わせて黄色の丸の不透明度を上げていく
        //         opacity: opacityCircle
        //     });
        //     $(".greenSquareContainer").css({
        //         // スクロールに合わせて緑の四角を下げていく
        //         // top: newTopSquare + "px",
        //     });
        //     $(".greenSquare").css({
        //         // スクロールに合わせて緑の四角を下げていく
        //         // top: newTopSquare + "px",
        //         /* ここが原因 scaleを入れると画面幅に合わせてサイズが変わってしまう */
        //         // transform: "translateX(-50%) rotate(45deg) scale(" + sumSquare + ")"
        //     });


        //     const yellowCircleElement = document.querySelector('.yellowCircleContainer');
        //     const greenSquareElement = document.querySelector('.greenSquareContainer');
        //     const circleTriggerElement = document.querySelector('.sticky-trigger-yellowCircle');
        //     const squareTriggerElement = document.querySelector('.sticky-trigger-greenSquare');

        //     // Intersection Observer のオプション設定
        //     const circleOptions = {
        //     // rootMargin: '0px' はビューポートの端を基準にする
        //     // top: [sticky: 0] と同じ位置で交差を検出
        //     // rootMargin: '-1px 0px 0px 0px',
        //     rootMargin: '2300px 0px 0px 0px',
        //     threshold: 0 // 監視ターゲットの0%が見えたらトリガー
        //     };

        //     // Intersection Observer のオプション設定
        //     const squareOptions = {
        //     // rootMargin: '0px' はビューポートの端を基準にする
        //     // top: [sticky: 0] と同じ位置で交差を検出
        //     // rootMargin: '-1px 0px 0px 0px',
        //     rootMargin: '2800px 0px 0px 0px',
        //     threshold: 0 // 監視ターゲットの0%が見えたらトリガー
        //     };

        //     const circleObserver = new IntersectionObserver((entries) => {
        //     entries.forEach(entry => {
        //         // isIntersecting が false になった時 = 監視ターゲットが画面外 (上) に出た時
        //         if (!entry.isIntersecting) {
        //         // sticky 要素にクラスを追加 (固定開始)
        //         yellowCircleElement.classList.add('is-stuck');
        //         } else {
        //         // 監視ターゲットが再び画面内 (下) に入った時
        //         yellowCircleElement.classList.remove('is-stuck');
        //         }
        //     });
        //     }, circleOptions);
        //     console.log(scroll);

        //     const squareObserver = new IntersectionObserver((entries) => {
        //     entries.forEach(entry => {
        //         // isIntersecting が false になった時 = 監視ターゲットが画面外 (上) に出た時
        //         if (!entry.isIntersecting) {
        //         // sticky 要素にクラスを追加 (固定開始)
        //         greenSquareElement.classList.add('is-stuck');
        //         } else {
        //         // 監視ターゲットが再び画面内 (下) に入った時
        //         greenSquareElement.classList.remove('is-stuck');
        //         }
        //     });
        //     }, squareOptions);

        //     // 監視ターゲットの監視を開始
        //     circleObserver.observe(circleTriggerElement);
        //     squareObserver.observe(squareTriggerElement);


        //     if (scroll <= copyrightend) {
        //         $(".topCopyright").css({
        //             display: "block"
        //         })
        //         // $(".yellowCircleContainer, .greenSquareContainer").css({
        //         //     display: "block"
        //         // })
        //     }
        //     else if(scroll > copyrightend && scroll <= circleSquareend) {
        //         $(".topCopyright").css({
        //             display: "none"
        //         })
        //         // $(".yellowCircleContainer, .greenSquareContainer").css({
        //         //     display: "block"
        //         // })
        //     }
        //     else if (scroll > circleSquareend) {
        //         // $(".yellowCircleContainer, .greenSquareContainer").css({
        //         //     display: "none"
        //         // })
        //     }
        // } 
    });
})

// ===== 無限ループ風スクロールのしくみ =====
// ページの一番下までスクロールしたら、
// ふわっとフェードして一番上に戻る仕掛けです。
// ただジャンプするだけだと白くチラつくので、
// GSAPを使ってなめらかにつないでます！

// --- 設定いくつか ---
const threshold = 5; // 「もう下だな」って判断する余裕（ピクセル）
const fadeMask = document.getElementById("fadeMask"); // フェード用のマスク要素
let isTransitioning = false; // 今トランジション中かどうかのフラグ

// --- スクロールのたびに呼ばれる処理 ---
window.addEventListener("scroll", () => {
  // もしすでにトランジション中なら何もしない
  if (isTransitioning) return;

  // 現在のスクロール量
  const scroll = window.scrollY;
  // 表示中の画面の高さ（ビューポート）
  const vh = window.innerHeight;
  // ページ全体の高さから画面分引くと「下端までのスクロール量」になる
  const limit = document.body.scrollHeight - vh;
//   console.log(`Scroll: ${scroll}, Limit: ${limit}, Target: ${limit - threshold}`);

  // 下端付近に来たかチェック
  if (scroll >= limit - threshold) {
    //  if (scroll >= limit) {
    // フラグON（2重に動かないように）
    isTransitioning = true;

    // === ① オーバーレイをふわっと出す ===
    // 白いマスクがゆっくりフェードイン
    gsap.to(fadeMask, {
      opacity: 1,
      duration: 0.3,
      ease: "power1.out"
    });

    // === ② 少し待ってから上に戻す ===
    // 300msくらい待ってからスクロール位置を先頭に戻します
    setTimeout(() => {
      // ジャンプ的に上へ戻る（アニメーションなし）
      window.scrollTo({ top: 0, behavior: "auto" });

      // === ③ フェードを消す ===
      // 白マスクをゆっくりフェードアウト
      console.log("GSAP実行前")
      gsap.to(fadeMask, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.inOut",
        // 終わったらフラグ解除して次のスクロールを受け付ける
        onComplete: () => (isTransitioning = false)
      });
    // }, 300);
    });
  }
});

//// ====================================
//// ハンバーガーメニュー
//// ====================================
$(function() {
    $(".hamburger__back").click(function() {
        $(".hamburger").toggleClass("open");
        // $(".header__nav--sp").fadeToggle({
        //     duration: 1, // 瞬時に表示/非表示を切り替え（アニメーションはCSSに任せるため）
        //     complete: function() {
        //         // 2. fadeToggleが完了したら、アニメーションクラスを切り替える
        //         $(this).toggleClass('is-active'); 
        //     }
        // });

        var $nav = $(".header__nav--sp");

        if ($nav.hasClass('is-active')) {
            // --- 閉じる時 ---
            
            // 1. is-closing を付けて、上に消えるアニメーションを開始させる
            $nav.addClass('is-closing'); 
            
            // 2. アニメーション完了を待ってから非表示にし、is-active/is-closingを外す
            setTimeout(function() {
                $nav.removeClass('is-active is-closing').hide();
            }, 500); // アニメーション時間 (0.5s + 0.2s) に合わせる

        } else {
            // --- 開く時 ---
            
            // 1. is-closing が残っている場合は念のため削除
            $nav.removeClass('is-closing'); 
            
            // 2. 表示し、斜め出現アニメーションを開始させる（display: block;）
            $nav.show();
            // $nav.addClass('is-active');
            // 3. ブラウザが show() を描画するのを待つ (リフローを強制)
            setTimeout(function() {
                // 4. アニメーションを開始
                $nav.addClass('is-active');
            }, 10); // 10ms程度の短い遅延を入れる
        
        //上記の３の代わりに、下記を挟んでもうまくいった
        //     $(".header__nav--sp").fadeToggle({
        //     duration: 1, // 瞬時に表示/非表示を切り替え（アニメーションはCSSに任せるため）
        //     complete: function() {
        //         // 2. fadeToggleが完了したら、アニメーションクラスを切り替える
        //         $(this).toggleClass('is-active'); 
        //     }
        // });
        }
    });
});