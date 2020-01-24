import Scroll from 'locomotive-scroll'
import { each, map } from 'lodash'

import Text from 'animations/Text'

import Page from 'classes/Page'
import Slider from 'classes/Slider'

import { split } from 'utils/text'

export default class extends Page {
  /**
   * Create.
   */
  create () {
    this.element = document.querySelector('.creation')

    this.index = parseInt(this.element.dataset.index, 10)

    this.elements = {
      header: this.element.querySelector('.creation__header'),
      headerButton: document.querySelector('.creation__header__button'),

      information: this.element.querySelector('.creation__information'),
      informationTexts: this.element.querySelectorAll('.creation__information__text'),
      informationDescription: this.element.querySelector('.creation__information__description'),
      informationIntro: this.element.querySelector('.creation__information__description'),
      informationCreationtext: this.element.querySelector('.creation__information__aside'),
      informationReftext: this.element.querySelector('.creation__information__aside'),
      informationMaintext: this.element.querySelector('.creation__information__aside'),

      highlights: this.element.querySelectorAll('.creation__highlight'),
      highlightsText: this.element.querySelectorAll('.creation__highlight__text'),
    }

    this.createAnimations()
    this.createScroll()
    this.createSliders()
  }

  createAnimations () {
    this.animations = {}

    each([
      ...this.elements.informationTexts,
      this.elements.informationDescription
    ], (element, index) => {
      this.animations[`animation_${index}`] = new Text({
        append: true,
        element
      })

      element.setAttribute('data-scroll', '')
      element.setAttribute('data-scroll-call', `animation_${index}`)
      element.setAttribute('data-scroll-offset', '15%')
    })

    each(this.elements.listWrappers, (element, index) => {
      this.animations[`animation_list_${index}`] = new Appear({
        element
      })

      element.setAttribute('data-scroll', '')
      element.setAttribute('data-scroll-call', `animation_list_${index}`)
    })
  }

  createScroll () {
    this.scroll = new Scroll({
      el: this.element,
      scrollbarClass: 'scrollbar',
      smooth: true,
      smoothMobile: true
    })

    this.scroll.on('call', id => {
      if (this.animations[id]) {
        this.animations[id].animateIn()
      }
    })
  }

  createSliders () {
    this.sliders = map(this.elements.highlightsText, element => {
      split({ element })
      split({ element })

      const items = element.childNodes
      const buttons = element.querySelectorAll('span > span')

      return new Slider({
        element,
        elements: {
          buttons,
          items
        }
      })
    })
  }

  /**
   * Events.
   */
  onResize () {
    if (this.scroll) {
      this.scroll.update()
    }

    each(this.sliders, slider => {
      slider.onResize()
    })
  }

  onWheel (speed) {
    if (speed < 0) {
      each(this.sliders, slider => {
        slider.onRight()
      })
    } else if (speed > 0) {
      each(this.sliders, slider => {
        slider.onLeft()
      })
    }
  }

  /**
   * Animations.
   */
  show () {
    this.timelineIn = new TimelineMax()

    this.timelineIn.to(this.element, 0.5, {
      autoAlpha: 1
    })

    return super.show(this.timelineIn)
  }

  hide () {
    this.timelineOut = new TimelineMax()

    this.timelineOut.to(this.element, 0.5, {
      autoAlpha: 0
    })

    this.timelineOut.call(() => {
      this.destroy()
    })

    return super.hide(this.timelineOut)
  }

  /**
   * Destroy.
   */
  destroy () {
    if (this.scroll) {
      this.scroll.destroy()
    }

    each(this.sliders, slider => {
      slider.destroy()
    })
  }
}
