document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Cute Background Elements ---
    initFloatingBackground();

    // --- DOM Elements ---
    const decoratedImg = document.getElementById('decorated-img');
    const captionInput = document.getElementById('caption-input');
    const currentDateSpan = document.getElementById('current-date');
    const btnDownload = document.getElementById('btn-download');

    // Set current date in Polaroid frame
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    currentDateSpan.textContent = formattedDate;

    // Trigger sweet heart welcome confetti on load
    setTimeout(() => {
        triggerConfetti('✨', 20);
        triggerConfetti('💖', 15);
    }, 500);

    // --- Canvas Rendering for Polaroid Image Download (2:3 Vertical Aspect Ratio) ---
    btnDownload.addEventListener('click', () => {
        const canvas = document.getElementById('render-canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            // Set canvas size (600 width by 960 height to match 2:3 vertical photo frame)
            const canvasWidth = 600;
            const canvasHeight = 960;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // Fill canvas with white Polaroid frame color
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Draw a subtle border inside for aesthetics
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ECE9F0';
            ctx.strokeRect(4, 4, canvasWidth - 8, canvasHeight - 8);

            // Draw the preloaded image inside (aspect ratio 2:3 vertical, centered at top)
            const imgPadding = 30;
            const imgWidth = canvasWidth - (imgPadding * 2); // 540
            const imgHeight = 810; // 540 * 1.5
            
            // Draw image on canvas
            ctx.drawImage(img, imgPadding, imgPadding, imgWidth, imgHeight);

            // Apply soft photo frame border
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ECE9F0';
            ctx.strokeRect(imgPadding, imgPadding, imgWidth, imgHeight);

            // Draw Emojis / Stickers relative to canvas coordinates
            ctx.font = 'bold 80px "Segoe UI Symbol", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 🐱 Cat ears: Top Center of image (X=300, Y=35)
            ctx.fillText('🐱', 300, 35);

            // 🌸 Blush Left: X=110, Y=630 (aligned down portrait face)
            ctx.font = '45px "Segoe UI Symbol", sans-serif';
            ctx.fillText('🌸', 110, 630);

            // 🌸 Blush Right: X=490, Y=630
            ctx.fillText('🌸', 490, 630);

            // 🎀 Bow: Top Right corner (X=500, Y=80)
            ctx.font = '55px "Segoe UI Symbol", sans-serif';
            ctx.fillText('🎀', 500, 80);

            // ✨ Sparkles & Hearts around the frame
            ctx.font = '40px "Segoe UI Symbol", sans-serif';
            ctx.fillText('✨', 90, 90);    // Sparkle 1
            ctx.fillText('🌟', 480, 720);  // Sparkle 2 (near bottom right of portrait)
            ctx.fillText('💖', 130, 730);  // Floating heart

            // Write Polaroid Caption
            const captionText = captionInput.value || 'Bé đáng yêu của chị, đừng giận em nha... 🥺💕';
            ctx.fillStyle = '#3D3A45';
            ctx.font = 'bold 32px "Quicksand", "Segoe UI", sans-serif';
            ctx.fillText(captionText, canvasWidth / 2, 885);

            // Write Date
            ctx.fillStyle = '#A39DB0';
            ctx.font = '22px "Quicksand", "Segoe UI", sans-serif';
            ctx.fillText(formattedDate, canvasWidth / 2, 925);

            // Convert canvas to base64 data and trigger download
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `anh-cute-love-${Date.now()}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Success feedback
            triggerConfetti('💖', 35);
        };

        img.src = decoratedImg.src;
    });


    // --- 3. Modals Opening & Closing Logic ---
    const responseButtons = document.querySelectorAll('.response-btn');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    responseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                playPopupSound();
                triggerModalSpecificInit(modalId);
            }
        });
    });

    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            if (modal) modal.classList.remove('active');
        });
    });

    modalOverlays.forEach(overlay => {
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        }
    });

    function triggerModalSpecificInit(modalId) {
        if (modalId === 'modal-angry') {
            // Reset Angry Modal State (Angry starts at 100%, needs to be dragged to 0%)
            const slider = document.getElementById('anger-slider');
            const percentLabel = document.getElementById('slider-percent');
            const emojiStatus = document.getElementById('slider-emoji-status');
            const forgiveBtn = document.getElementById('btn-forgive');
            const dodgeBtn = document.getElementById('btn-never-forgive');

            slider.value = 100;
            percentLabel.textContent = 'Mức độ giận: 100%';
            emojiStatus.textContent = '😡';
            forgiveBtn.disabled = true;
            forgiveBtn.className = 'btn btn-disabled';
            forgiveBtn.textContent = 'Hết giận em nha 💕';

            // Reset dodge button displacement
            dodgeBtn.style.transform = 'translate(0px, 0px)';
        } else if (modalId === 'modal-tired') {
            // Reset Tired Modal State
            const batteryLevel = document.getElementById('battery-level');
            const batteryText = document.getElementById('battery-text');
            const chargeBtn = document.getElementById('btn-charge');
            
            batteryLevel.style.width = '15%';
            batteryLevel.style.background = 'linear-gradient(90deg, #FF7043 0%, #FFB74D 100%)';
            batteryText.textContent = '15% (Yếu sinh lực 🥱)';
            chargeBtn.disabled = false;
            chargeBtn.classList.remove('btn-disabled');
            chargeBtn.textContent = 'Sạc pin tình yêu ⚡';
            currentCharge = 15;
        } else if (modalId === 'modal-other') {
            // Reset Other Reason State
            document.getElementById('reason-text').value = '';
            document.querySelector('.other-reason-form').classList.remove('d-none');
            document.getElementById('reply-card').classList.add('d-none');
        }
    }


    // --- 4. Modal Specific Interactive Logic ---

    // A. Modal Angry 😡 Slider & UNCLICKABLE Dodge Button
    const angerSlider = document.getElementById('anger-slider');
    const sliderPercent = document.getElementById('slider-percent');
    const sliderEmojiStatus = document.getElementById('slider-emoji-status');
    const btnForgive = document.getElementById('btn-forgive');
    const btnNeverForgive = document.getElementById('btn-never-forgive');

    angerSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value); // current value (starts at 100)
        sliderPercent.textContent = `Mức độ giận: ${val}%`;

        // Update emoji status as anger goes down (from 100 down to 0)
        if (val > 75) {
            sliderEmojiStatus.textContent = '😡';
        } else if (val <= 75 && val > 50) {
            sliderEmojiStatus.textContent = '😠';
        } else if (val <= 50 && val > 25) {
            sliderEmojiStatus.textContent = '🥺';
        } else if (val <= 25 && val > 0) {
            sliderEmojiStatus.textContent = '🥺👉👈';
        } else if (val === 0) {
            sliderEmojiStatus.textContent = '🥰';
            // Enable forgive button only when anger hits 0%
            btnForgive.disabled = false;
            btnForgive.className = 'btn btn-primary';
            btnForgive.textContent = 'Nhấp vào đây nè! 💕';
            triggerConfetti('💖', 20);
        } else {
            // If they slide back up, disable again
            btnForgive.disabled = true;
            btnForgive.className = 'btn btn-disabled';
            btnForgive.textContent = 'Hết giận em nha 💕';
        }
    });

    btnForgive.addEventListener('click', () => {
        triggerConfetti('🥰', 40);
        triggerConfetti('💖', 40);
        btnForgive.textContent = 'Cảm ơn chị iu thơm thơm! 😘';
        setTimeout(() => {
            document.getElementById('modal-angry').classList.remove('active');
        }, 1500);
    });

    // Make 'Never Forgive' button dodge mouse and touch instantly so it is 100% UNCLICKABLE
    const dodgeEvents = ['mouseenter', 'touchstart', 'mousedown', 'click'];
    dodgeEvents.forEach(evtType => {
        btnNeverForgive.addEventListener(evtType, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dodgeButton();
        });
    });

    function dodgeButton() {
        // Calculate random translate values to jump away
        // Keeping it bounded within the modal card bounds
        let randomX = (Math.random() * 240) - 120; // -120px to +120px
        let randomY = (Math.random() * 100) - 50;  // -50px to +50px

        // Ensure minimum jump distance so it doesn't just twitch in place
        if (Math.abs(randomX) < 50) randomX += randomX >= 0 ? 50 : -50;
        if (Math.abs(randomY) < 25) randomY += randomY >= 0 ? 25 : -25;

        btnNeverForgive.style.transform = `translate(${randomX}px, ${randomY}px)`;
        playDodgeSound();
    }


    // B. Modal Sad 😢 (Hugs and Candies)
    const btnHug = document.getElementById('btn-hug');
    const btnCandy = document.getElementById('btn-candy');

    btnHug.addEventListener('click', () => {
        triggerConfetti('🫂', 30);
        triggerConfetti('💖', 30);
        btnHug.textContent = 'Gửi chị ngàn cái ôm! 🫂💖';
        playCuteSound();
        setTimeout(() => {
            btnHug.textContent = 'Nhận ôm ôm ngọt ngào 🫂';
        }, 2000);
    });

    btnCandy.addEventListener('click', () => {
        triggerConfetti('🍭', 20);
        triggerConfetti('🍬', 20);
        triggerConfetti('✨', 20);
        btnCandy.textContent = 'Ngọt ngào hết buồn nha! 🍭🥰';
        playCuteSound();
        setTimeout(() => {
            btnCandy.textContent = 'Ăn kẹo ngọt hết buồn 🍭';
        }, 2000);
    });


    // C. Modal Tired 🥱 (Love Battery Charge)
    let currentCharge = 15;
    const btnCharge = document.getElementById('btn-charge');
    const batteryLevel = document.getElementById('battery-level');
    const batteryText = document.getElementById('battery-text');

    btnCharge.addEventListener('click', () => {
        if (currentCharge >= 100) return;

        currentCharge += 17; // 5 taps charges it full
        if (currentCharge > 100) currentCharge = 100;

        batteryLevel.style.width = `${currentCharge}%`;

        // Style battery based on charge
        if (currentCharge < 40) {
            batteryText.textContent = `${currentCharge}% (Còn mệt lắm... 🥱)`;
            batteryLevel.style.background = 'linear-gradient(90deg, #FF7043 0%, #FFB74D 100%)';
            triggerConfetti('⚡', 5);
        } else if (currentCharge >= 40 && currentCharge < 80) {
            batteryText.textContent = `${currentCharge}% (Đang khoẻ dần! 🥰)`;
            batteryLevel.style.background = 'linear-gradient(90deg, #FFB74D 0%, #FFE082 100%)';
            triggerConfetti('⚡', 8);
        } else if (currentCharge >= 80 && currentCharge < 100) {
            batteryText.textContent = `${currentCharge}% (Sung mãn sắp rep! 🌸💪)`;
            batteryLevel.style.background = 'linear-gradient(90deg, #FFE082 0%, #A5D6A7 100%)';
            triggerConfetti('✨', 10);
        } else if (currentCharge === 100) {
            batteryText.textContent = '100% (Tràn trề năng lượng! 🥰⚡)';
            batteryLevel.style.background = 'linear-gradient(90deg, #81C784 0%, #66BB6A 100%)';
            btnCharge.disabled = true;
            btnCharge.classList.add('btn-disabled');
            btnCharge.textContent = 'Pin đầy tràn trề luôn! ❤️';
            triggerConfetti('💝', 40);
            triggerConfetti('⚡', 20);
            playCompleteSound();
            setTimeout(() => {
                document.getElementById('modal-tired').classList.remove('active');
            }, 2000);
        }
        playChargeSound();
    });


    // D. Modal Other Reason 💬
    const btnSendReason = document.getElementById('btn-send-reason');
    const reasonText = document.getElementById('reason-text');
    const otherForm = document.querySelector('.other-reason-form');
    const replyCard = document.getElementById('reply-card');

    btnSendReason.addEventListener('click', () => {
        const text = reasonText.value.trim();
        if (!text) {
            alert('Chị iu nhập lý do vào đây giùm em với nha! 🥺');
            return;
        }

        // Save locally for fun
        localStorage.setItem('lover_reason_response', JSON.stringify({
            reason: text,
            timestamp: new Date().toISOString()
        }));

        otherForm.classList.add('d-none');
        replyCard.classList.remove('d-none');
        triggerConfetti('✉️', 15);
        triggerConfetti('💖', 20);
        playLetterSound();
    });
});

/* --- Cute Floating Background Engine (GPU-Optimized for Mobile) --- */
function initFloatingBackground() {
    const bgContainer = document.getElementById('floating-bg');
    const emojis = ['💖', '💕', '✨', '🌸', '🧸', '🌈', '💝', '🌟'];

    setInterval(() => {
        if (document.hidden) return;

        const el = document.createElement('div');
        el.className = 'bg-heart';
        el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = `${Math.random() * 95}vw`; // avoid overflow scrollbars
        el.style.fontSize = `${Math.random() * 14 + 14}px`;
        el.style.animationDuration = `${Math.random() * 5 + 6}s`; // 6 to 11s flight
        
        bgContainer.appendChild(el);

        // Remove element after flight
        setTimeout(() => {
            el.remove();
        }, 11000);
    }, 1100); // slightly increased delay to lower DOM footprint on mobile
}

/* --- Sparkles/Emoji Explosion Confetti Engine (WAAPI Hardware Accelerated) --- */
function triggerConfetti(emoji, count = 20) {
    const container = document.body;
    const isMobile = window.innerWidth < 480;
    const finalCount = isMobile ? Math.min(count, 15) : count;

    for (let i = 0; i < finalCount; i++) {
        const el = document.createElement('div');
        el.innerText = emoji;
        el.style.position = 'fixed';
        el.style.zIndex = '9999';
        el.style.pointerEvents = 'none';
        el.style.fontSize = `${Math.random() * 16 + 20}px`;
        
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        el.style.left = `${startX}px`;
        el.style.top = `${startY}px`;

        container.appendChild(el);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 200 + 80;
        const destX = Math.cos(angle) * velocity;
        const destY = Math.sin(angle) * velocity;

        el.animate([
            { transform: 'translate(-50%, -50%) scale(0.6) rotate(0deg)', opacity: 1 },
            { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(1.3) rotate(${Math.random() * 540 - 270}deg)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 600,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
            fill: 'forwards'
        });

        setTimeout(() => el.remove(), 1800);
    }
}

/* --- Audio Synthesizer (Web Audio API) for Instant, Cute, Zero-download Sound Effects --- */
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playTone(freq, type, duration, volume) {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {}
}

function playPopupSound() {
    playTone(523.25, 'sine', 0.2, 0.08); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.25, 0.08), 80); // E5
}

function playCuteSound() {
    playTone(880, 'sine', 0.12, 0.12); // A5
    setTimeout(() => playTone(1046.5, 'sine', 0.2, 0.12), 60); // C6
}

function playChargeSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.12);

        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        osc.start();
        osc.stop(ctx.currentTime + 0.12);
    } catch(e) {}
}

function playCompleteSound() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // Simple cute arpeggio
    notes.forEach((freq, idx) => {
        setTimeout(() => {
            playTone(freq, 'sine', 0.25, 0.06);
        }, idx * 70);
    });
}

function playDodgeSound() {
    playTone(180, 'triangle', 0.08, 0.04);
}

function playLetterSound() {
    playTone(440, 'sine', 0.08, 0.08);
    setTimeout(() => playTone(330, 'sine', 0.08, 0.06), 40);
}
