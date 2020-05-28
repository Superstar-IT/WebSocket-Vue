<template>
  <div :class="[ 'letter-crest', (small && 'is-small') ]">
    <div :class="[ 'letter-crest-inner', `is-${index}` ]">
      <div class="flex is-row is-centered letters">
        <span class="flex-item letters-inner">{{ initials }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import fixedRandom from '@/helpers/fixed-random.js'

export default {
  name: 'LetterCrest',

  props: {
    seed: {
      type: [ Number, String ],
      default: 'hello, world'
    },
    small: {
      type: Boolean,
      default: false
    },
    displayName: {
      type: String,
      default: '??'
    }
  },

  computed: {
    seedAsNumber () {
      const { seed } = this

      if (typeof seed === 'number') {
        return seed
      }

      return seed.split('').reduce((acc, val) => {
        return acc + val.charCodeAt(0)
      }, 0)
    },

    index () {
      return Math.floor(fixedRandom(this.seedAsNumber) * 8)
    },

    initials () {
      const parts = this.displayName.split(' ')

      if (parts.length === 1) {
        return parts[0][0]
      }

      return parts[0][0] + parts[parts.length-1][0]
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/mixins.sass"
@import "@/styles/variables.sass"

@function crestColor ($color)
  @return $color

.letter-crest
  width: 100%
  position: relative
  &.is-small
    .letter-crest-inner
      border-radius: $border-radius-sm
    .letters-inner
      font-size: $font-size

.letter-crest-inner
  width: 100%
  position: relative
  background: $gabbi-grey-2
  padding-top: 100%
  border-radius: $border-radius-lg
  &.is-0
    color: findColorInvert(crestColor($orange))
    background: crestColor($orange)
  &.is-1
    color: findColorInvert(crestColor($yellow))
    background: crestColor($yellow)
  &.is-2
    color: findColorInvert(crestColor($green))
    background: crestColor($green)
  &.is-3
    color: findColorInvert(crestColor($turquoise))
    background: crestColor($turquoise)
  &.is-4
    color: findColorInvert(crestColor($cyan))
    background: crestColor($cyan)
  &.is-5
    color: findColorInvert(crestColor($blue))
    background: crestColor($blue)
  &.is-6
    color: findColorInvert(crestColor($purple))
    background: crestColor($purple)
  &.is-7
    color: findColorInvert(crestColor($red))
    background: crestColor($red)

.letters
  top: 0
  left: 0
  width: 100%
  height: 100%
  position: absolute

.letters-inner
  font-size: 1.5rem
  text-align: center
  font-weight: lighter
  text-transform: uppercase
</style>
