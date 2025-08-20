// Браузер, коли ти закінчиш завантажувати весь вміст сторінки (HTML), тільки тоді запускай те, що всередині цих дужок {...}
window.addEventListener("DOMContentLoaded", () => {
  // Далі ми будемо реєструвати плагін ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  const header = document.querySelector("header");//Знайди на цій веб-сторінці перший HTML-елемент з тегом <header> і запам'ятай його, помістивши його в змінну з назвою header. Це значення header не буде змінюватися.

  // ==========================
  // Mobile Menu Toggle
  // ==========================

  // Toggles mobile nav visibility on hamburger click
  function toggleMobileNav() {
    document.getElementById("mobileMenu").classList.toggle("show");
  }

   //наступний рядок коду робить функцію toggleMobileNav доступною з будь-якого місця на вашій HTML-сторінці
  window.toggleMobileNav = toggleMobileNav; //Робить функцію toggleMobileNav() глобально доступною, щоб її можна було викликати з HTML (наприклад, через onclick). Без цього вона була б доступна лише в межах файлу main.js.



  // Initial Page Load Animations

  function runInitialAnimations() {
    // Create a timeline with default easing
    const onLoadTl = gsap.timeline({ defaults: { ease: "power2.out" } }); 
    //gsap.timeline(): Це функція з бібліотеки GSAP.
    //Timeline у GSAP – для керування кількома анімаціями. Замість того, щоб запускати кожну анімацію окремо, таймлайн дозволяє "склеювати" їх у послідовність: одна анімація починається після іншої, або паралельно, або з певними затримками.
    //  defaults - означає, що ці налаштування будуть застосовані за замовчуванням до кожної анімації, яку ви додасте до цього таймлайну.
    // ease: "power2.out"- анімація яка визначає, як швидко або повільно анімація починається і закінчується.
    // "power2.out" означає, що анімація починається повільно, потім прискорюється і плавно завершується.


    onLoadTl
    // Тут буде анімуватися розширення "border width" для заголовка (header)
      .to(
        "header",
        {
          "--border-width": "100%",
          duration: 3,
        },
        0
      )
     //  посилання навігації та іконки бічної панелі будуть "виїжджати" згори.
      .from(
        ".desktop-nav a, .social-sidebar a",
        {
          y: -100,//Елементи починатимуть свою анімацію на 100 пікселів вище свого початкового положення (y відповідає за рух по вертикалі, - означає вгору).
          opacity: 0,// Елементи починатимуть анімацію як повністю прозорі
          duration: 0.8,//Анімація кожного елемента триватиме 0.8 секунди.
          stagger: 0.2,//означає, що кожна наступна анімація для елемента в групі починатиметься з затримкою в 0.2 секунди після попередньої. Це створює плавний "ефект хвилі", коли елементи з'являються не всі одночасно, а по черзі.
          ease: "power3.out",
        },
        0//всі 3 анімації на 0, починаються одночасно
      )
      //Animate sidebar border
      .to(
        ".social-sidebar",
        {
          "--border-height": "100%",
          duration: 10,
        },
        0
      )
       //поясна головного заголовка
      .to(
        ".hero-content h1",
        {
          opacity: 1,
          duration: 1,
        },
        0
      )
      .to(
        ".hero-content h1",
        {
          delay: 0.5,
          duration: 1.2,
          color: "var(--sienna)",
          "-webkit-text-stroke": "0px var(--sienna)",
        },
        0
      )
     //поява по слову з права
      .from(
        ".hero-content .line",
        {
          x: 100,
          delay: 1,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
        0
      )

       //анімуємо появу бутилки
      .to(
        ".hero-bottle-wrapper",
        {
          opacity: 1,
          scale: 1,
          delay: 1.5,
          duration: 1.3,
          ease: "power3.out",
        },
        0
      )
      // анімуємо появу stamp
      .to(
        ".hero-stamp",
        {
          opacity: 1,
          scale: 1,
          delay: 2,
          duration: 0.2,
          ease: "back.out(3)",
        },
        0
      )
      //ефект трясіння до stamp
      .to(
        ".hero-stamp",
        {
          y: "+=5",
          x: "-=3",
          repeat: 2,
          yoyo: true, //дає ефект гойдалки "туди-сюди"
          duration: 0.05,
          ease: "power1.inOut",
        },
        0
      );
  }


  // Reusable Scroll-Based Animation Setup
  

  function pinAndAnimate({
    trigger,//посилання на html елемент або селектор
    endTrigger, //Визначає кінець зони дії ScrollTrigger
    pin, // Логічне значення (true або false)
    animations,
    markers = false,//Якщо вказали б true, GSAP ScrollTrigger додасть візуальні маркери на ваш сайт, які показують, де починається і закінчується дія тригера
    headerOffset = 0,
  }) {
       //наступний рядок визначає кінцеву позицію прокрутки з урахуванням зміщення для заголовка.
    const end = `top top+=${headerOffset}`;//Це рядок визначає коли закінчиться дія ScrollTrigger.

    // top: означає верхню межу endTrigger.

    // top+=${headerOffset}: означає, що верхня межа вікна перегляду (viewport) буде зміщена вниз на значення headerOffset.

   //створюється таймлайн GSAP, пов'язаний зі ScrollTrigger.
    const tl = gsap.timeline({
      scrollTrigger: {  //Замість того, щоб таймлайн запускався одразу, ми вбудовуємо в нього об'єкт scrollTrigger. Це "прив'язує" весь таймлайн до подій прокрутки сторінки за допомогою плагіна ScrollTrigger
        trigger,
        start: `top top+=${headerOffset}`, //Визначає коли ScrollTrigger почне свою дію.
        endTrigger,
        end,
        scrub: true,  // Якщо scrub встановлено на true, то анімації на таймлайні будуть синхронізовані з прокруткою.
        pin, //Якщо true, trigger-елемент буде "приклеєний" до екрана.
        pinSpacing: false,//Це налаштування для "приклеювання". Якщо true, ScrollTrigger додає додатковий простір (padding) над або під елементом, що "приклеюється", щоб уникнути стрибків у макеті. У даному випадку, false означає, що такий простір автоматично не додаватиметься.
        markers: markers,//Це дозволяє вмикати/вимикати візуальні маркери ScrollTrigger на сторінці для відладки.
        invalidateOnRefresh: true, //Якщо true, це змушує ScrollTrigger перераховувати всі свої позиції (старт, кінець, зміщення) щоразу, коли ви оновлюєте сторінку або змінюєте розмір вікна браузера. Це гарантує, що анімації правильно працюватимуть на різних розмірах екранів, навіть якщо контент динамічно змінює свою висоту.
      },
    });

    // наступний блок коду буде перебирати (проходити по черзі) кожен "об'єкт анімації" у масиві animations.
    animations.forEach(({ target, vars, position = 0 }) => {    //animations повинен бути масивом, оскільки лише масиви мають метод forEach()
      tl.to(target, vars, position);
    });
  }

  // Налаштування для анімацій, які залежать від прокрутки сторінки, і що ці налаштування різні для комп'ютерів та телефонів.

  function setupScrollAnimations() {
    const headerOffset = header.offsetHeight - 1;
    //offsetHeight – це властивість JavaScript, яка повертає повну висоту елемента. - 1: Від висоти заголовка віднімається 1 піксель.




    //використання matchMedia для адаптивності.
    ScrollTrigger.matchMedia({
      // Desktop scroll animations
      "(min-width: 769px)": function () {   //Застосувати цей код, якщо ширина екрана більше або дорівнює 769 пікселів" (тобто, для десктопних пристроїв та великих планшетів).
        // 1. Bottle animates on scroll from hero to intro
        pinAndAnimate({
          trigger: ".hero",
          endTrigger: ".section-intro",
          pin: ".hero-bottle-wrapper",
          animations: [    //масив анімацій
            { target: ".hero-bottle", vars: { rotate: 0, scale: 0.8 } },
          ],
          headerOffset,
        });

        // 2. бутилка переміщується в право протягом руху по section-intro
        pinAndAnimate({
          trigger: ".section-intro",
          endTrigger: ".timeline-entry:nth-child(even)",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 10, scale: 0.7 } },
            { target: ".hero-bottle-wrapper", vars: { x: "30%" } },
          ],
          markers: false,
          headerOffset,
        });

        // 3. бутилка переходить вліво проятгом першої timeline entry
        pinAndAnimate({
          trigger: ".timeline-entry:nth-child(even)",
          endTrigger: ".timeline-entry:nth-child(odd)",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: -10, scale: 0.7 } },
            { target: ".hero-bottle-wrapper", vars: { x: "-25%" } },
          ],
          markers: false,
          headerOffset,
        });
      },

      // Mobile animation (no scroll)
      "(max-width: 768px)": function () {
        gsap.to(".hero-bottle-wrapper", {
          opacity: 1,
          duration: 1,
          delay: 0.5,
        });
      },
    });
  }

  // Init Everything on Load

  runInitialAnimations(); // Load-in animations
  setupScrollAnimations(); // Scroll-based animations
  ScrollTrigger.refresh();
});
