document.addEventListener('DOMContentLoaded',() => {

  // 0) 메인 슬라이더
  const swiper = new Swiper('.swiper-main', {
    loop: true,
    pagination: {
      el: '.swiper-pagination-1st',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-next-1st',
      prevEl: '.swiper-prev-1st',
    },

    // scrollbar: { el: '.swiper-scrollbar-1st' },
  });

  /////////////////////////


  // 1) Swiper 먼저 만들 때 DOM 변화 감지 옵션 켜기
  const cardSwiper = new Swiper('.card-swiper', {
    loop: false,
    spaceBetween: 24,
    slidesPerView: 1,
    navigation: {
      nextEl: '.swiper-next-2nd',
      prevEl: '.swiper-prev-2nd',
    },
    pagination: {
      el: '.card-pagination',
      clickable: true,
    },
    breakpoints: {
      740:  { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 24 },
    },
    observer: false,
    observeParents: false,
    watchSlidesProgress: false,
    watchSlidesVisibility: false,
  });


  // 2) 필터 셋업
  const radios = document.querySelectorAll('.tab-option input[name="tab"]');
  const slides = Array.from(document.querySelectorAll('#tab-box1 .swiper-slide'));

  function applyFilter(key) {
    // 1) 보이고/숨기기
    slides.forEach(slide => {
      const tags  = (slide.dataset.tags || '').split(',').map(s => s.trim());
      const match = key === 'all' ? true : tags.includes(key);
      slide.classList.toggle('is-hidden', !match);
    });
  
    // 2) 스와이퍼 갱신
    cardSwiper.update();
    cardSwiper.slideTo(0, 0);
  
    // 3) AOS 재생 준비: "보이는 카드"만 리셋
    const visibleCards = document.querySelectorAll(
      '#tab-box1 .swiper-slide:not(.is-hidden) .card[data-aos]'
    );
    visibleCards.forEach(el => {
      el.classList.remove('animate-fade-slide'); // 기존 클래스 제거
      void el.offsetWidth; // 브라우저 리플로우 강제
      el.classList.add('animate-fade-slide'); // 다시 추가

      el.addEventListener('animationend', () => {
        el.classList.remove('animate-fade-slide'); // ← 끝나면 제거
        // 필요하면 AOS 다시 계산
        // AOS.refresh();  // 또는 refreshHard()
      }, { once: true });
    });
  
    // 4) DOM 안정화 후 재계산 → 스크롤 이벤트 강제 발생(트리거)
    requestAnimationFrame(() => {
      AOS.refreshHard();
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('scroll')); // 여기서 aos-animate가 다시 붙으면서 재생
      });
    });
  }

  // 3) 이벤트 연결
  radios.forEach(r => r.addEventListener('change', e => applyFilter(e.target.value)));



  // 위에 해더 메뉴 관련 

  const menuBtn = document.querySelector('.menu-btn');
  const subMenu = document.querySelector('.m-menu');

  menuBtn.addEventListener('click',(e) => {
    menuBtn.classList.toggle('on');
    subMenu.classList.toggle('on');
  })

  const mainMenuA = document.querySelectorAll('.menu-a');
  const header = document.querySelector('header');
  for (let i=0;i<mainMenuA.length;i++) {
    mainMenuA[i].addEventListener('mouseenter',()=> {
      header.classList.add('on');
      mainMenuA[i].classList.add('on');
      for(let j=0;j<mainMenuA.length;j++) {
        if(i!==j) {
          mainMenuA[j].classList.remove('on');
        }
      }
    })
    header.addEventListener('mouseleave',()=> {
      header.classList.remove('on');
      for(let j=0;j<mainMenuA.length;j++) {
        mainMenuA[j].classList.remove('on');
      }
    })
  }

  

  // 아이콘들 탭 효과 관련 코드 

  const IconButtons = document.querySelectorAll('.action .icon-btn');

  const TabText = document.querySelector('.action .text-box')

  const TextArr = [
      `<h2 class="subtitle">매출을 이끌어 내는<br>맞춤형 메시지</h2>`,
      `<h2 class="subtitle">고객 만족을 높이는<br>커뮤니케이션</h2>`,
      `<h2 class="subtitle">학습 몰입을 높이는<br>메시지 전략</h2>`,
      `<h2 class="subtitle">행정 효율을 높이는<br>메시지 자동화</h2>`,
      `<h2 class="subtitle">성장에 필요한 모든<br>메시지를 한 번에</h2>`
  ]

  const TabContent = document.querySelectorAll('.action .tab-content')

  for (let i = 0; i < IconButtons.length; i++) {
    IconButtons[i].addEventListener("click", () => {
      // 탭 텍스트 변경
      TabText.innerHTML = TextArr[i];
  
      // 탭 버튼 & 콘텐츠 활성화
      IconButtons[i].classList.add('on');
      TabContent[i].classList.add('on');

      // --- AOS 갱신 ---
      replayAOSIn(TabContent[i]);
  
      // 다른 탭은 비활성화
      for (let j = 0; j < IconButtons.length; j++) {
        if (i !== j) {
          IconButtons[j].classList.remove('on');
          TabContent[j].classList.remove('on');
        }
      }

    });
  }


  // aos 강제 재로딩 관련
  
  function replayAOSIn(el) {
      el.classList.remove('aos-animate');
      void el.offsetWidth;
      el.classList.add('aos-animate');  
  }

  // QnA 섹션 아코디언 기능 

  const buttons = document.querySelectorAll('.accordion-button');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;
      const isActive = button.classList.contains('accordion-button-active');
  
      // 1) 모두 닫기
      buttons.forEach((b) => {
        b.classList.remove('accordion-button-active');
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.style.maxHeight = 0;
      });
  
      // 2) 원래 닫혀 있던 패널만 열기 (즉, 하나만 열림)
      if (!isActive) {
        button.classList.add('accordion-button-active');
        button.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

})

