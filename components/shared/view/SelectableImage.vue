<template>
  <b-image
    ratio="1by1"
    class="image"
    :class="[
      disabled ? 'selectable-image-disabled' : 'selectable-image',
      { 'is-selected': selected },
    ]"
    :src="src"
    alt="Some Image"
    @click.native="handleClick"></b-image>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string
  index: number
  disabled: boolean
}>()

const selected = ref(false)
const emit = defineEmits(['click', 'remove'])

const handleClick = () => {
  selected.value = !selected.value
  emit(selected ? 'click' : 'remove', props.index)
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.is-selected {
  border: 2px $primary solid;
}
.selectable-image:hover {
  border: 2px $lightpink solid;
  cursor: pointer;
}

.selectable-image-disabled:hover {
  pointer-events: none;
  cursor: not-allowed;
}
</style>
