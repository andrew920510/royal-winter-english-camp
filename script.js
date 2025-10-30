// ===========================================
// 倒數計時器 (Countdown Timer)
// ===========================================

// 截止日期：2025年 11月 26日 23:59:59 
const deadline = new Date("Nov 26, 2025 23:59:59").getTime();

const x = setInterval(function() {
    const now = new Date().getTime();
    const distance = deadline - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const formatTime = (t) => t < 10 ? "0" + t : t;

    const countdownElement = document.getElementById("countdown-timer");
    
    if (countdownElement) {
        countdownElement.innerHTML = 
            `<span class="countdown-value">${formatTime(days)}</span> 天 
            <span class="countdown-value">${formatTime(hours)}</span> 時 
            <span class="countdown-value">${formatTime(minutes)}</span> 分 
            <span class="countdown-value">${formatTime(seconds)}</span> 秒`;
    }
    
    if (distance < 0) {
        clearInterval(x);
        if (countdownElement) {
            countdownElement.innerHTML = "報名已截止！";
        }
    }
}, 1000);

// ===========================================
// 導覽列漢堡選單 (Navbar Toggle)
// ===========================================

function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

function closeMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu && window.innerWidth <= 768) {
        navMenu.classList.remove('active');
    }
}

window.addEventListener('resize', function() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu && window.innerWidth > 768) {
        navMenu.classList.remove('active');
    }
});


// ===========================================
// 模態視窗 (Modal) 和畫廊 (Gallery Carousel) 邏輯
// ===========================================

// 追蹤每個模態視窗畫廊當前圖片索引的陣列 (以 1 為起始)
const galleryIndexMap = { 1: 1, 2: 1, 3: 1, 4: 1 };


/**
 * 核心函數：顯示指定模態視窗內的圖片（使用橫向平移）
 * 這是左右切換圖片的關鍵函式！
 * @param {number} modalId 模態視窗的 ID (1, 2, 3, 4)
 * @param {number} n 要顯示的圖片索引 (從 1 開始)
 */
function galleryShowSlides(modalId, n) {
    const modalElement = document.getElementById(`modal-${modalId}`);
    if (!modalElement) return;

    // 1. 確保找到圖片軌道 (track)
    const track = modalElement.querySelector('.gallery-track'); 
    if (!track) {
        console.error(`Modal ${modalId}: 找不到 .gallery-track 元素。請檢查 HTML 結構。`);
        return;
    }

    const images = track.querySelectorAll('.gallery-img');
    const totalImages = images.length;
    let slideIndex = n;

    // 如果沒有圖片，則直接退出
    if (totalImages === 0) return;

    // 2. 處理循環切換
    if (slideIndex > totalImages) {
        slideIndex = 1;
    }
    if (slideIndex < 1) {
        slideIndex = totalImages;
    }
    
    // 更新當前索引
    galleryIndexMap[modalId] = slideIndex;

    // 3. 計算平移距離：(當前索引 - 1) * 100%
    const offset = -(slideIndex - 1) * 100;
    
    // 4. 關鍵：對軌道進行水平平移
    track.style.transform = `translateX(${offset}%)`;


    // 5. 處理只有一張圖片時隱藏按鈕
    const prevBtn = modalElement.querySelector('.gallery-prev-btn');
    const nextBtn = modalElement.querySelector('.gallery-next-btn');

    if (totalImages <= 1) {
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
    } else {
        if(prevBtn) prevBtn.style.display = 'block';
        if(nextBtn) nextBtn.style.display = 'block';
    }
}


/**
 * 畫廊圖片切換 (左右箭頭點擊時被呼叫)
 * @param {number} modalId 模態視窗的 ID
 * @param {number} n 要移動的張數 (+1 下一張, -1 上一張)
 */
function galleryMoveSlide(modalId, n) {
    // 確保 modalId 存在
    if (galleryIndexMap[modalId] === undefined) {
        galleryIndexMap[modalId] = 1; 
    }
    // 呼叫 showSlides，並傳遞新的索引
    galleryShowSlides(modalId, galleryIndexMap[modalId] += n);
}


/**
 * 開啟模態視窗 (點擊課程卡片時被呼叫)
 * @param {string} modalId 模態視窗的 HTML ID (例如: 'modal-1')
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex"; 
        document.body.style.overflow = "hidden"; // 禁用背景滾動
        
        // 確保模態視窗打開時，畫廊圖片從第一張開始顯示
        const id = parseInt(modalId.split('-')[1]);
        galleryShowSlides(id, 1); // 確保每次開啟都從第一張開始
    }
}

/**
 * 關閉模態視窗 (點擊 X 或外部背景時被呼叫)
 * @param {string} modalId 模態視窗的 HTML ID (例如: 'modal-1')
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = ""; // 恢復滾動
    }
}


// ===========================================
// 事件監聽器 (Event Listeners)
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. 為所有課程卡片添加點擊事件 (開啟 Modal)
    document.querySelectorAll('.modal-trigger').forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal-id');
            if (modalId) {
                openModal(modalId);
            }
        });
    });

    // 2. 為所有關閉按鈕添加事件 (關閉 Modal)
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-id');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    // 3. 點擊模態視窗外部區域時關閉
    document.querySelectorAll('.custom-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // 4. FAQ 手風琴功能
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                // 這是確保展開時能容納所有內容的關鍵邏輯
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});