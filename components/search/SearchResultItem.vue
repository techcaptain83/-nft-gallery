<template>
  <div class="search-result-item" :class="{ 'loading-item': isLoading }">
    <div class="media">
      <div class="media-left">
        <b-skeleton
          v-if="isLoading"
          circle
          width="48px"
          height="48px"></b-skeleton>
        <BasicImage
          v-else
          rounded
          custom-class="is-48x48 image-outline"
          :src="image" />
      </div>
      <div
        v-if="isLoading"
        class="media-content is-flex is-flex-direction-column is-justify-content-center pt-2">
        <b-skeleton
          :count="1"
          width="240"
          height="22"
          size="is-medium"
          active></b-skeleton>
        <b-skeleton
          :count="1"
          width="150"
          height="22"
          size="is-medium"
          active></b-skeleton>
      </div>
      <div v-else class="media-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  },
})
export default class SearchResultItem extends Vue {
  @Prop({ type: Boolean, default: false }) public isLoading!: boolean
  @Prop({ type: String, default: '' }) public image!: string
}
</script>
