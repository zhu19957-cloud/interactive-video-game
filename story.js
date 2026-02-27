// 互动视频故事配置
const story = {
    // 场景1: 开场（分支选择）
    1: {
        video: "ziyuan/1.mp4",
        title: "开始",
        options: [
            { text: "去吃早餐", nextScene: 2 },
            { text: "去撸铁", nextScene: 3 }
        ]
    },
    // 场景2: 分支A - 学校
    2: {
        video: "ziyuan/2.mp4",
        title: "餐厅",
        options: [
            { text: "继续", nextScene: 4 }
        ]
    },
    // 场景3: 分支B - 咖啡厅
    3: {
        video: "ziyuan/3.mp4",
        title: "健身房",
        options: [
            { text: "继续", nextScene: 4 }
        ]
    },
    // 场景4: 结局
    4: {
        video: "ziyuan/4.mp4",
        title: "结局",
        options: [
            { text: "重新开始", nextScene: 0 } // 0 表示返回角色选择
        ]
    }
};

// 全局变量
let currentScene = 1;
let selectedCharacter = null;

// 获取DOM元素
const characterSelect = document.getElementById('characterSelect');
const videoSection = document.getElementById('videoSection');
const optionsContainer = document.getElementById('optionsContainer');
const mainTitle = document.getElementById('mainTitle');

// 选择角色
function selectCharacter(characterId) {
    selectedCharacter = characterId;
    // 隐藏角色选择，显示视频区域
    characterSelect.style.display = 'none';
    videoSection.style.display = 'flex';
    // 开始游戏
    loadScene(currentScene);
}

// 隐藏选项按钮
function hideOptions() {
    optionsContainer.style.display = 'none';
}

// 显示选项按钮
function showOptions() {
    optionsContainer.style.display = 'flex';
}

// 加载指定场景
function loadScene(sceneId) {
    // 如果是返回角色选择
    if (sceneId === 0) {
        characterSelect.style.display = 'flex';
        videoSection.style.display = 'none';
        currentScene = 1;
        return;
    }

    const scene = story[sceneId];
    if (!scene) {
        console.error("场景不存在:", sceneId);
        return;
    }

    currentScene = sceneId;

    const video = document.getElementById('gameVideo');

    // 先隐藏按钮
    hideOptions();

    // 监听视频结束事件
    video.onended = function() {
        showOptions();
    };

    // 设置视频源并播放
    video.src = scene.video;
    video.load();

    // 自动播放
    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("自动播放被阻止，需要用户交互");
        });
    }

    // 更新标题
    document.getElementById('sceneTitle').textContent = scene.title;

    // 预先创建按钮（但此时是隐藏的）
    optionsContainer.innerHTML = '';

    // 判断是否使用水平布局
    if (scene.options.length === 2) {
        optionsContainer.classList.add('options-horizontal');
    } else {
        optionsContainer.classList.remove('options-horizontal');
    }

    scene.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option.text;
        btn.onclick = () => loadScene(option.nextScene);
        optionsContainer.appendChild(btn);
    });
}

// 页面加载完成后
document.addEventListener('DOMContentLoaded', function() {
    // 显示角色选择，隐藏视频区域
    characterSelect.style.display = 'flex';
    videoSection.style.display = 'none';
});
