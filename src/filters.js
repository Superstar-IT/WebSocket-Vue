import Vue from 'vue'
import filters from '@/helpers/filters.js'

export default function defineFilters () {
  for (let key in filters) {
    Vue.filter(key, filters[key])
  }
}
