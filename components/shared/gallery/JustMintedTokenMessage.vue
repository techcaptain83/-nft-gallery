<template>
  <b-message class="message-box" type="is-primary">
    <div class="columns">
      <div class="column is-four-fifths">
        <p class="title is-3 has-text-black">{{ $t('mint.success') }} 🎉</p>
        <p class="subtitle is-size-5 subtitle-text">
          {{ $t('mint.shareWithFriends', [name]) }} △
        </p>
      </div>
      <div class="column">
        <Sharing only-copy-link />
      </div>
    </div>
  </b-message>
</template>

<script lang="ts" setup>
defineProps<{
  name: string
}>()
</script>
