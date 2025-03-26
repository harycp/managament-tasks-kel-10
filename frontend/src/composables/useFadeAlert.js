import { ref } from "vue";

export function useFadeAlert() {
  function beforeEnter(el) {
    el.style.opacity = 0;
  }
  function enter(el, done) {
    el.offsetHeight;
    el.style.transition = "opacity 0.3s";
    el.style.opacity = 1;
    done();
  }
  function leave(el, done) {
    el.style.transition = "opacity 0.3s";
    el.style.opacity = 0;
    setTimeout(() => {
      done();
    }, 300);
  }

  return {
    beforeEnter,
    enter,
    leave,
  };
}
