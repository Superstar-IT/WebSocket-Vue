<template>
  <div class="flex is-column note-editor">
    <!-- <small><pre style="white-space:pre-wrap">{{ value.items }}</pre></small> -->

    <!-- Editor -->

    <tap class="flex-item note" @click.native="selectLast">
      <div v-for="(item, i) in value.items" :class="`note-item is-${item.type}`" :key="'text' + i">

        <!-- Text -->

        <template v-if="item.type === 'text'">
          <span
            ref="items"
            class="editable"
            contenteditable
            v-text="item.content.text"
            @blur="updateItem($event, item)"
            @paste="paste"
            @keydown.enter="enterPressed"
            @keydown.delete="deletePressed"
            data-type="text"
            :data-index="i"
          ></span>
        </template>

        <!-- Checkbox -->

        <template v-else-if="item.type === 'checkbox'">
          <div>
            <div class="flex is-row checkbox-label">
              <span class="flex-item checkbox-checkbox">
                <input-checkbox :slim="true" />
              </span>
              <span class="flex-item checkbox-text">
                <span
                  ref="items"
                  class="editable"
                  contenteditable
                  v-text="item.content.text"
                  @blur="updateItem($event, item)"
                  @paste="paste"
                  @keydown.enter="enterPressed"
                  @keydown.delete="deletePressed"
                  data-type="checkbox"
                  :data-index="i"
                ></span>
              </span>
            </div>
          </div>
        </template>

      </div>
    </tap>

    <!-- Toolbar -->

    <div class="flex-item toolbar flex is-row is-centered">
      <span class="flex-item toolbar-icon flex is-row" @mousedown="insertCheckbox">
        <span class="flex-item icon-list3"></span>
        <span class="flex-item toolbar-label">Add Checkbox</span>
      </span>
    </div>

  </div>
</template>

<script>
import InputCheckbox from '@/components/form/InputCheckbox.vue'

export default {
  name: 'NoteEditor',

  components: {
    InputCheckbox
  },

  props: {
    note: {
      type: [ Object, undefined ],
      default: undefined
    }
  },

  data () {
    return {
      value: this.note || {
        items: [
          {
            type: 'text',
            content: { text: '' }
          }
        ]
      }
    }
  },

  methods: {
    selectLast (evt) {
      if (!evt || evt.target.classList.contains('note')) {
        const items = this.$refs.items
        const item = items[items.length - 1]

        this.placeCaretAt(item)
      }
    },

    insertCheckbox () {
      const itemEl = document.activeElement

      if (itemEl.dataset.index !== undefined) {
        const index = Number(itemEl.dataset.index)
        const item = this.value.items[index]

        if (item.type === 'checkbox') {
          item.type = 'text'
          delete item.content.checked
        } else {
          item.type = 'checkbox'
          item.content.checked = false
        }

        this.$nextTick(() => {
          const nextEl = this.$el.querySelector(`[data-index='${index}']`)
          this.placeCaretAt(nextEl)
        })
      } else {
        this.value.items.push({
          type: 'checkbox',
          content: { text: '', checked: false }
        })

        this.$nextTick(() => {
          this.selectLast()
        })
      }
    },

    enterPressed (evt) {
      evt.preventDefault()

      const type = evt.target.dataset.type
      const index = Number(evt.target.dataset.index)

      const pos = this.getCaretPosition(evt.target)
      const text = evt.target.innerText

      const prevText = text.slice(0, pos)
      const nextText = text.slice(pos, text.length)

      const item = this.value.items[index]
      item.content.text = prevText

      if (type === 'checkbox') {
        if (!text) {
          item.type = 'text'
          delete item.content.checked

          this.$nextTick(() => {
            const nextEl = this.$el.querySelector(`[data-index='${index}']`)
            this.placeCaretAt(nextEl)
          })

          return
        }

        this.value.items.splice(index + 1, 0, {
          type: 'checkbox',
          content: { text: nextText, checked: false }
        })
      }
      else if (type === 'text') {
        this.value.items.splice(index + 1, 0, {
          type: 'text',
          content: { text: nextText }
        })
      }

      this.$nextTick(() => {
        const nextEl = this.$el.querySelector(`[data-index='${index + 1}']`)
        nextEl.focus()
      })
    },

    deletePressed (evt) {
      const index = Number(evt.target.dataset.index)
      const curPos = this.getCaretPosition(evt.target)

      if (curPos !== 0) return

      const text = evt.target.innerText
      const prevItem = this.value.items[index - 1]

      if (!prevItem) return

      evt.preventDefault()

      this.value.items.splice(index, 1)

      const pos = prevItem.content.text.length

      if (text) prevItem.content.text += text

      this.$nextTick(() => {
        const itemEl = this.$el.querySelector(`[data-index='${index - 1}']`)
        this.placeCaretAt(itemEl, pos)
      })
    },

    paste (evt) {
      evt.preventDefault()

      const text = (evt.originalEvent || evt).clipboardData.getData('text/plain')
      document.execCommand('insertHTML', false, text)
    },

    updateItem (evt, obj) {
      const value = evt.target.innerText
      obj.content.text = value
    },

    placeCaretAt (el, pos = false) {
      el.focus()

      const range = document.createRange()
      if (!el.firstChild || pos === false) {
        range.selectNodeContents(el)
        range.collapse(false)
      } else {
        range.setStart(el.firstChild, pos)
        range.collapse(true)
      }

      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    },

    getCaretPosition (el) {
      const range = window.getSelection().getRangeAt(0)
      const preCaretRange = range.cloneRange()

      preCaretRange.selectNodeContents(el)
      preCaretRange.setEnd(range.endContainer, range.endOffset)

      return preCaretRange.toString().length
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/styles/variables.sass"

.note-editor
  width: 100%
  border: solid 1px $gabbi-grey-1
  overflow: hidden
  position: relative
  background: $gabbi-white
  border-radius: $border-radius

.note
  flex: 1
  overflow: auto
  padding: $margin
  position: relative
  outline: none
  textarea
    top: 0
    left: 0
    height: auto
    width: 100%
    resize: none
    display: block
    opacity: 0.5
    padding: $margin

.toolbar
  padding: $margin-sm $margin
  background: $gabbi-grey-2
  .toolbar-icon
    padding: $margin-sm
    font-size: 20px
    span
      display: block
      &.toolbar-label
        line-height: 1
        font-size: 15px
        margin-left: $margin

.note-item
  margin: 0.75rem 0
  &.is-checkbox
    margin: 0.3rem 0
  &:first-child
    margin-top: 0
  &:last-child
    margin-bottom: 0

.checkbox-checkbox
  display: inline-block
  font-size: 0
  margin-right: $margin
  pointer-events: none

.checkbox-text
  flex: 1
  display: inline-block
  position: relative

.editable
  width: 100%
  display: block
  white-space: pre-wrap
  &:focus
    outline: none
</style>
