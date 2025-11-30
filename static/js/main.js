// YouTube Video Loader
function loadYoutube(el) {
  const iframe = el.querySelector('iframe');
  iframe.src = iframe.dataset.src;
  iframe.style.display = 'block';
  el.querySelector('img').style.display = 'none';
  el.querySelector('.play-button').style.display = 'none';
}

// Function to fetch and display last update time
async function updateLastUpdateTime() {
  try {
    const response = await fetch('/api/last-update');
    const data = await response.json();
    
    // Find the last update element and update it
    const lastUpdateElement = document.querySelector('.last-update-time');
    if (lastUpdateElement) {
      lastUpdateElement.textContent = data.lastUpdate.relative;
      lastUpdateElement.title = data.lastUpdate.formatted;
    }
  } catch (error) {
    // Silently handle error - last update time is not critical
  }
}

// Function to add last update info dynamically if not present
function addLastUpdateInfo() {
  const footerContent = document.querySelector('footer .content');
  if (footerContent && !document.querySelector('.last-update-info')) {
    fetch('/api/last-update')
      .then(response => response.json())
      .then(data => {
        const lastUpdateDiv = document.createElement('div');
        lastUpdateDiv.className = 'last-update-info';
        lastUpdateDiv.style.cssText = 'margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #f0f0f0; color: #777; font-size: 0.8em; text-align: center; font-weight: 500;';
        lastUpdateDiv.innerHTML = `
          <i class="fas fa-clock" style="margin-right: 0.5rem; color: #888; font-size: 0.9em;"></i>
          Last updated: <span class="last-update-time" title="${data.lastUpdate.formatted}" style="color: #666;">${data.lastUpdate.relative}</span>
        `;
        footerContent.appendChild(lastUpdateDiv);
      })
      .catch(error => {
        // Silently handle error - last update info is not critical
      });
  }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  
  // 延迟初始化Swiper1，等待动态模型加载完成
  // 原来的swiper1初始化代码移到window.initializeSwiper1函数中
  
  // 将原来的swiper1初始化代码改为函数
  window.initializeSwiper1 = function() {
    const swiper1 = new Swiper('.swiper1', {
      slidesPerView: 3.5,
      spaceBetween: 20,
      loop: true,
      autoplay: false,
      allowTouchMove: false,
      allowSlideNext: true,
      allowSlidePrev: true,
      speed: 800,
      slidesPerGroup: 2,
      effect: 'slide',
      freeMode: false,
      centeredSlides: false,
      roundLengths: true,
      resistance: false,
      simulateTouch: false,
      touchRatio: 0,
      followFinger: false,
      shortSwipes: false,
      longSwipes: false,
      navigation: {
        nextEl: '.swiper1-button-next',
        prevEl: '.swiper1-button-prev',
      },
    });

    // 保存到全局变量
    window.swiper1 = swiper1;

    // 添加GLB进度指示器和其他功能
    const createGLBProgressIndicator = () => {
      const progressContainer = document.createElement('div');
      progressContainer.className = 'glb-progress-container';
      progressContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin: 0 1rem;
        padding: 0.4rem 0.8rem;
        background: rgba(255, 255, 255, 0.95);
        border: 3px solid transparent;
        border-radius: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-size: 0.85em;
        color: #6b7280;
        min-width: 120px;
        position: relative;
        z-index: 1;
      `;
      
      progressContainer.innerHTML = `
        <div style="
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 0.8em;
          font-weight: 500;
        ">
          GLB
        </div>
        <div style="
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 1em;
          font-weight: 600;
          margin-left: 0.3rem;
        ">
          <span class="current-slide" style="color: #4a5568; font-weight: 700;">1</span>
          <span style="color: #d1d5db; font-weight: 400; opacity: 0.7;">/</span>
          <span class="total-slides" style="color: #6b7280; font-weight: 500;">3</span>
        </div>
        <button class="auto-play-button" style="
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 1em;
          padding: 0.3rem;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        ">
          <i class="fas fa-play" style="font-size: 0.8em;"></i>
        </button>
      `;
      
      const progressBorder = document.createElement('div');
      progressBorder.className = 'progress-border';
      progressBorder.style.cssText = `
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        border-radius: 1.5rem;
        border: 3px solid #e5e7eb;
        z-index: 0;
        pointer-events: none;
        transition: border-color 0.4s ease;
      `;
      progressContainer.appendChild(progressBorder);
      
      return progressContainer;
    };

    // 添加所有swiper1相关的功能（进度指示器、按钮事件等）
    const nextBtn = document.querySelector('.swiper1-button-next');
    const prevBtn = document.querySelector('.swiper1-button-prev');
    const swiperNav = document.querySelector('.swiper-navigation');
    
    if (nextBtn && prevBtn && swiperNav) {
      const progressIndicator = createGLBProgressIndicator();
      swiperNav.insertBefore(progressIndicator, nextBtn);
      
      const currentSlideSpan = progressIndicator.querySelector('.current-slide');
      const totalSlidesSpan = progressIndicator.querySelector('.total-slides');
      const progressBorder = progressIndicator.querySelector('.progress-border');
      const autoPlayButton = progressIndicator.querySelector('.auto-play-button');
      
      const totalSlides = document.querySelectorAll('.swiper1 .swiper-slide').length;
      const maxSteps = Math.ceil(totalSlides / 2);
      totalSlidesSpan.textContent = maxSteps;
      
      const updateProgress = (currentStep, totalSteps) => {
        const intensity = currentStep / totalSteps;
        const alpha = 0.3 + (intensity * 0.7);
        progressBorder.style.borderColor = `rgba(99, 102, 241, ${alpha})`;
      };
      
      const forceSyncProgress = () => {
        const realIndex = swiper1.realIndex;
        const currentStep = Math.floor(realIndex / 2) + 1;
        const clampedStep = Math.max(1, Math.min(currentStep, maxSteps));
        
        currentSlideSpan.textContent = clampedStep;
        updateProgress(clampedStep, maxSteps);
      };
      
      swiper1.on('slideChange', forceSyncProgress);
      swiper1.on('slideChangeTransitionEnd', forceSyncProgress);
      swiper1.on('slideChangeTransitionStart', forceSyncProgress);
      swiper1.on('transitionEnd', forceSyncProgress);
      
      forceSyncProgress();
      
      // Auto-play functionality
      let isAutoPlaying = false;
      let autoPlayInterval;
      
      const startAutoPlay = () => {
        if (isAutoPlaying) return;
        isAutoPlaying = true;
        autoPlayButton.innerHTML = '<i class="fas fa-pause" style="font-size: 0.8em;"></i>';
        autoPlayButton.style.color = '#6366f1';
        
        autoPlayInterval = setInterval(() => {
          swiper1.slideNext();
        }, 2000);
      };
      
      const stopAutoPlay = () => {
        if (!isAutoPlaying) return;
        isAutoPlaying = false;
        autoPlayButton.innerHTML = '<i class="fas fa-play" style="font-size: 0.8em;"></i>';
        autoPlayButton.style.color = '#9ca3af';
        
        if (autoPlayInterval) {
          clearInterval(autoPlayInterval);
          autoPlayInterval = null;
        }
      };
      
      autoPlayButton.addEventListener('click', () => {
        if (isAutoPlaying) {
          stopAutoPlay();
        } else {
          startAutoPlay();
        }
      });
      
      autoPlayButton.addEventListener('mouseenter', () => {
        autoPlayButton.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
        if (!isAutoPlaying) {
          autoPlayButton.style.color = '#6366f1';
        }
      });
      
      autoPlayButton.addEventListener('mouseleave', () => {
        autoPlayButton.style.backgroundColor = 'transparent';
        if (!isAutoPlaying) {
          autoPlayButton.style.color = '#9ca3af';
        }
      });
      
      // Button press effects
      const handlePress = (btn) => {
        btn.style.transform = 'scale(0.95)';
        btn.style.background = 'rgba(99, 102, 241, 0.1)';
        btn.style.transition = 'none';
      };
      
      const handleRelease = (btn) => {
        btn.style.transition = 'all 0.1s ease';
        setTimeout(() => {
          btn.style.transform = '';
          btn.style.background = '';
        }, 50);
      };
      
      nextBtn.addEventListener('mousedown', () => handlePress(nextBtn));
      nextBtn.addEventListener('mouseup', () => handleRelease(nextBtn));
      nextBtn.addEventListener('mouseleave', () => handleRelease(nextBtn));
      
      prevBtn.addEventListener('mousedown', () => handlePress(prevBtn));
      prevBtn.addEventListener('mouseup', () => handleRelease(prevBtn));
      prevBtn.addEventListener('mouseleave', () => handleRelease(prevBtn));
      
      nextBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handlePress(nextBtn);
      }, { passive: false });
      
      nextBtn.addEventListener('touchend', () => handleRelease(nextBtn));
      nextBtn.addEventListener('touchcancel', () => handleRelease(nextBtn));
      
      prevBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handlePress(prevBtn);
      }, { passive: false });
      
      prevBtn.addEventListener('touchend', () => handleRelease(prevBtn));
      prevBtn.addEventListener('touchcancel', () => handleRelease(prevBtn));
    }

    console.log('✅ Swiper1 initialized with all features');
    return swiper1;
  };

  // Initialize Swiper for Layout Generation (if exists)
  const swiper2Element = document.querySelector('.swiper2');
  if (swiper2Element) {
    const swiper2 = new Swiper('.swiper2', {
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  // Initialize Plyr for all videos with class 'plyr-video'
  const plyrVideos = document.querySelectorAll('.plyr-video');
  if (plyrVideos.length > 0) {
    const players = Plyr.setup('.plyr-video', {
      controls: [
        'play-large', // The large play button in the center
        'play', // Play/pause playback
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        'mute', // Toggle mute
        'volume', // Volume control
        'fullscreen' // Toggle fullscreen
      ],
      settings: ['quality', 'speed'],
      quality: {
        default: 1080,
        options: [1080, 720, 480, 360]
      },
      speed: {
        selected: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 2]
      },
      tooltips: {
        controls: true,
        seek: false
      },
      previewThumbnails: {
        enabled: false
      },
      keyboard: {
        focused: true,
        global: false
      },
      clickToPlay: true,
      hideControls: true,
      resetOnEnd: true,
      // 添加全屏相关配置
      fullscreen: {
        enabled: true,
        fallback: true,
        iosNative: false
      },
      // 确保视频正确缩放
      ratio: null, // 让Plyr自动检测比例
    });

    // Auto-play and loop configuration for each player
    players.forEach((player, index) => {
      player.on('ready', () => {
        player.muted = false;  // 禁用静音
        player.volume = 0.2;   // 设置音量为20%
        player.loop = false;   // 禁用循环播放
        
        // 确保视频元素有正确的样式
        const videoElement = player.media;
        if (videoElement) {
          videoElement.style.objectFit = 'contain';
          videoElement.style.objectPosition = 'center';
        }
      });

      // 全屏事件处理
      player.on('enterfullscreen', () => {
        console.log('Entered fullscreen');
        const videoElement = player.media;
        if (videoElement) {
          // 确保全屏时视频正确居中和缩放
          videoElement.style.objectFit = 'contain';
          videoElement.style.objectPosition = 'center';
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
        }
      });

      player.on('exitfullscreen', () => {
        console.log('Exited fullscreen');
        const videoElement = player.media;
        if (videoElement) {
          // 退出全屏时重置样式
          videoElement.style.objectFit = 'contain';
          videoElement.style.objectPosition = 'center';
          videoElement.style.width = '100%';
          videoElement.style.height = 'auto';
        }
      });

      // 移除自动重新开始，让视频结束后暂停
      // player.on('ended', () => {
      //   player.restart();
      // });
    });
  }

  // Add last update information to footer
  addLastUpdateInfo();

  // Update last update time every 30 minutes
  setInterval(updateLastUpdateTime, 30000);

  // Initialize service status checking
  checkServiceStatus();
  
  // Check service status every 2 minutes
  setInterval(checkServiceStatus, 2 * 60 * 1000);
  
  // Initialize commit hash injection
  injectCommitHash();

  // ==========================================
  // 3D Model Gallery & Mobile Detection Module
  // ==========================================

  // Mobile device detection
  function isMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'mobile'];
    
    // Check user agent
    const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));
    
    // Check screen size
    const isSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 600;
    
    // Check touch support
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return isMobileUserAgent || (isSmallScreen && isTouchDevice);
  }

  // Create mobile device notice
  function createMobileNotice() {
    const swiperContainer = document.querySelector('.swiper-container.swiper1');
    const swiperNav = document.querySelector('.swiper-navigation');
    
    if (!swiperContainer) return;
    
    // Hide original swiper and navigation
    swiperContainer.style.display = 'none';
    if (swiperNav) swiperNav.style.display = 'none';
    
    // Hide title section (Demo button, title and description)
    const titleSection = swiperContainer.previousElementSibling;
    if (titleSection && titleSection.style && titleSection.style.display !== undefined) {
      titleSection.style.display = 'none';
    }
    
    // Create mobile notice
    const mobileNotice = document.createElement('div');
    mobileNotice.className = 'mobile-notice';
    mobileNotice.style.cssText = `
      max-width: 600px;
      margin: 2rem auto;
      padding: 2.5rem 2rem;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.08));
      border: 2px solid rgba(99, 102, 241, 0.2);
      border-radius: 16px;
      text-align: center;
      position: relative;
      overflow: hidden;
    `;
    
    mobileNotice.innerHTML = `
      <div style="
        font-size: 3rem;
        color: rgba(99, 102, 241, 0.6);
        margin-bottom: 1.5rem;
        line-height: 1;
      ">
        <i class="fas fa-desktop"></i>
      </div>
      
      <h3 style="
        font-size: 1.4rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 1rem;
        line-height: 1.3;
      ">
        3D Model Gallery
      </h3>
      
      <p style="
        color: #6b7280;
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      ">
        The interactive 3D model gallery is optimized for desktop viewing.<br>
        Please visit this page on a PC or laptop for the best experience.
      </p>
      
      <div style="
        background: rgba(255, 255, 255, 0.7);
        border-radius: 12px;
        padding: 1.2rem;
        margin-bottom: 1.5rem;
      ">
        <p style="
          color: #4b5563;
          font-size: 0.9rem;
          margin: 0;
          line-height: 1.5;
        ">
          <i class="fas fa-cube" style="color: #8b5cf6; margin-right: 0.5rem;"></i>
          <strong>18 interactive 3D models</strong><br>
          <i class="fas fa-mouse-pointer" style="color: #8b5cf6; margin-right: 0.5rem; margin-top: 0.5rem; display: inline-block;"></i>
          Click & drag to explore
        </p>
      </div>
      
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(99, 102, 241, 0.1);
        border-radius: 50px;
        padding: 0.75rem 1.5rem;
        color: #5b21b6;
        font-size: 0.9rem;
        font-weight: 500;
      ">
        <i class="fas fa-info-circle" style="color: rgba(99, 102, 241, 0.7);"></i>
        <span>Best viewed on desktop</span>
      </div>
    `;
    
    // Insert at appropriate position
    const insertTarget = titleSection || swiperContainer;
    insertTarget.parentNode.insertBefore(mobileNotice, insertTarget);
    
    console.log('📱 Mobile device detected - showing desktop notice instead of 3D models');
  }

  // Load additional 3D models from txt file
  async function loadAdditionalModels() {
    console.log('🔍 Starting loadAdditionalModels function...');
    
    try {
      console.log('📥 Fetching display_resource.txt...');
      const response = await fetch('./display_resource.txt');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('📄 File content:', text);
      
      const modelNames = text.trim().split('\n').filter(line => line.trim() !== '');
      console.log('📝 Parsed model names:', modelNames);
      
      const swiperWrapper = document.querySelector('.swiper1 .swiper-wrapper');
      console.log('🎛️ Swiper wrapper found:', !!swiperWrapper);
      
      if (!swiperWrapper) {
        console.error('❌ Swiper wrapper not found!');
        return;
      }

      console.log('🚀 Adding models to DOM...');
      modelNames.forEach((modelName, index) => {
        const trimmedName = modelName.trim();
        console.log(`➕ Processing model ${index + 1}: "${trimmedName}"`);
        
        if (trimmedName) {
          const slideDiv = document.createElement('div');
          slideDiv.className = 'swiper-slide model-card';
          
          const modelViewer = document.createElement('model-viewer');
          const modelUrl = `./static/glbs/${trimmedName}.glb`;
          console.log(`🌐 Model URL: ${modelUrl}`);
          
          modelViewer.src = modelUrl;
          modelViewer.alt = `3D model ${trimmedName}`;
          modelViewer.setAttribute('auto-rotate', '');
          modelViewer.setAttribute('camera-controls', '');
          modelViewer.setAttribute('rotation-per-second', '20deg');
          modelViewer.setAttribute('background-color', '#ffffff');
          modelViewer.setAttribute('interaction-prompt', 'none');
          // Don't set environment-image to allow default lighting
          modelViewer.style.cssText = 'width: 100%; height: 300px;';
          
          // Add debug logging
          modelViewer.addEventListener('model-visibility', (event) => {
            console.log(`👁️ Model ${trimmedName} visibility changed:`, event.detail);
          });
          
          modelViewer.addEventListener('progress', (event) => {
            const progress = event.detail.totalProgress;
            if (progress === 1) {
              console.log(`⏳ Model ${trimmedName} fully loaded`);
            }
          });
          
          modelViewer.addEventListener('load', () => {
            console.log(`✅ Model ${trimmedName} loaded successfully`);
          });
          
          modelViewer.addEventListener('error', (event) => {
            console.error(`❌ Failed to load model ${trimmedName}:`, event);
            console.error(`Model path: ${modelUrl}`);
            slideDiv.innerHTML = `
              <div style="
                width: 100%; 
                height: 300px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                background: #f8f9fa;
                color: #6c757d;
                border-radius: 8px;
              ">
                <div style="text-align: center;">
                  <i class="fas fa-cube" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                  <p style="margin: 0; font-size: 0.9rem;">Model ${trimmedName}<br>Loading failed</p>
                </div>
              </div>
            `;
          });
          
          slideDiv.appendChild(modelViewer);
          swiperWrapper.appendChild(slideDiv);
        }
      });
      
      // Initialize Swiper after models are loaded
      console.log('🔄 Initializing Swiper after models loaded...');
      
      if (typeof window.initializeSwiper1 === 'function') {
        console.log('✅ Using main.js initializeSwiper1 function');
        window.initializeSwiper1();
        console.log(`🎉 Successfully loaded ${modelNames.length} models and initialized Swiper`);
      } else {
        console.error('❌ initializeSwiper1 function not found in main.js');
      }
      
    } catch (error) {
      console.error('💥 Failed to load additional models:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
  }

  // Initialize based on device type
  function initializeBasedOnDevice() {
    console.log('🔍 Checking device type...');
    
    if (isMobileDevice()) {
      console.log('📱 Mobile device detected');
      createMobileNotice();
      return; // Don't load 3D models
    }
    
    console.log('🖥️ Desktop device detected - loading 3D models');
    loadAdditionalModels();
  }

  // Initialize 3D gallery functionality
  function initialize3DGallery() {
    console.log('🎮 Initializing 3D Gallery Module...');
    
    setTimeout(() => {
      console.log('⏰ Starting device-based initialization...');
      initializeBasedOnDevice();
    }, 1000);
    
    // Debug check after initialization
    setTimeout(() => {
      console.log('🔍 Debug check after 3 seconds:');
      console.log('- Device type:', isMobileDevice() ? 'Mobile' : 'Desktop');
      console.log('- Swiper wrapper exists:', !!document.querySelector('.swiper1 .swiper-wrapper'));
      console.log('- window.swiper1 exists:', !!window.swiper1);
      console.log('- Swiper class available:', typeof Swiper !== 'undefined');
      console.log('- Total slides in wrapper:', document.querySelectorAll('.swiper1 .swiper-slide').length);
    }, 3000);
  }

  // Export functions to global scope if needed
  window.isMobileDevice = isMobileDevice;
  window.loadAdditionalModels = loadAdditionalModels;
  window.initialize3DGallery = initialize3DGallery;

  // Initialize 3D Gallery
  initialize3DGallery();

});

// Function to check service status
async function checkServiceStatus() {
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  
  if (!statusIndicator || !statusText) return;
  
  try {
    const response = await fetch('/health', {
      method: 'GET',
      timeout: 5000 // 5 second timeout
    });
    
    const data = await response.json();
    const lastCheck = new Date().toLocaleTimeString();
    
    // Create simplified tooltip info
    let tooltipInfo = `Status: ${data.status}`;
    if (data.uptime) {
      tooltipInfo += `\nUptime: ${Math.floor(data.uptime / 3600)}h ${Math.floor((data.uptime % 3600) / 60)}m`;
    }
    if (data.memory) {
      tooltipInfo += `\nMemory: ${data.memory.used}MB / ${data.memory.total}MB (${data.memory.usagePercent}%)`;
    }
    
    // Remove all status classes first
    statusIndicator.className = '';
    
    if (response.ok && data.status === 'OK') {
      // Service is healthy
      statusIndicator.style.backgroundColor = '#22c55e'; // Green
      statusIndicator.classList.add('healthy');
      statusText.textContent = 'All Systems Normal';
      statusText.style.color = '#16a34a';
    } else if (data.status === 'DEGRADED') {
      // Service is degraded
      statusIndicator.style.backgroundColor = '#f59e0b'; // Orange/Yellow
      statusIndicator.classList.add('degraded');
      statusText.textContent = 'Service Degraded';
      statusText.style.color = '#d97706';
    } else {
      // Service has errors
      statusIndicator.style.backgroundColor = '#ef4444'; // Red
      statusIndicator.classList.add('error');
      statusText.textContent = 'Service Issues';
      statusText.style.color = '#dc2626';
      if (data.error) {
        tooltipInfo += `\nError: ${data.error}`;
      }
    }
    
    // Use custom tooltip instead of browser default
    const serviceStatus = document.getElementById('service-status');
    if (serviceStatus) {
      serviceStatus.setAttribute('data-tooltip', tooltipInfo);
    }
    
    // Remove default tooltips to avoid conflicts
    statusIndicator.removeAttribute('title');
    statusText.removeAttribute('title');
  } catch (error) {
    // Service is down or unreachable
    statusIndicator.className = '';
    statusIndicator.style.backgroundColor = '#ef4444'; // Red
    statusIndicator.classList.add('error');
    statusText.textContent = 'Service Unavailable';
    statusText.style.color = '#dc2626';
    
    const errorTooltip = `Status: Error\nError: ${error.message}`;
    
    // Use custom tooltip for error state
    const serviceStatus = document.getElementById('service-status');
    if (serviceStatus) {
      serviceStatus.setAttribute('data-tooltip', errorTooltip);
    }
    
    // Remove default tooltips
    statusIndicator.removeAttribute('title');
    statusText.removeAttribute('title');
  }
}

// Function to inject commit hash into footer
async function injectCommitHash() {
  try {
    const response = await fetch('/api/commit');
    if (!response.ok) return;
    
    const commitInfo = await response.json();
    
    // Only inject if we have valid commit info (not local-dev)
    if (!commitInfo.hash || 
        commitInfo.hash === 'local-dev' || 
        commitInfo.hash === 'unknown') {
      return;
    }
    
    // Find the Page Source link
    const pageSourceLink = document.querySelector('a[href="https://github.com"]');
    if (!pageSourceLink) return;
    
    // Check if commit hash is already injected
    if (pageSourceLink.parentElement.querySelector('.commit-hash')) return;
    
    // Create and inject commit hash element
    const commitElement = document.createElement('span');
    commitElement.className = 'commit-hash';
    commitElement.innerHTML = ` <span style="color: #ccc;">•</span> <span style="color: #888;"><i class="fas fa-code-branch" style="margin-right: 0.3rem; font-size: 0.9em;"></i><code style="background: rgba(0,0,0,0.05); padding: 1px 4px; border-radius: 3px; font-size: 0.9em;" title="Commit: ${commitInfo.message || 'No message'}">${commitInfo.shortHash}</code></span>`;
    
    pageSourceLink.insertAdjacentElement('afterend', commitElement);
    
  } catch (error) {
    // Silently handle error - commit hash is not critical
  }
} 