// https://vuejs.org/v2/cookbook/creating-custom-scroll-directives.html#Base-Example
export const Scroll = {
  inserted: function(el, binding) {
    let f = function(evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
}
