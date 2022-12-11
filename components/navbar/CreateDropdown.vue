<template>
  <b-dropdown aria-role="list" :triggers="['click']">
    <template #trigger>
      <div class="navbar-item">
        {{ $t('create') }}
      </div>
    </template>
    <b-dropdown-item has-link>
      <b-tooltip
        position="is-left"
        label="Start by creating your collection and add NFTs to it"
        class="navbar-item-tooltip">
        <nuxt-link data-cy="classic" :to="`/${urlPrefix}/create`">
          {{ $t('classic') }}
        </nuxt-link>
      </b-tooltip>
    </b-dropdown-item>
    <template v-if="chain === 'rmrk'">
      <b-dropdown-item has-link>
        <b-tooltip
          position="is-left"
          label="Simplified process to create your NFT in a single step"
          class="navbar-item-tooltip">
          <nuxt-link data-cy="simple" :to="`/${urlPrefix}/mint`">
            {{ $t('simple') }}
          </nuxt-link>
        </b-tooltip>
      </b-dropdown-item>
      <b-dropdown-item has-link>
        <b-tooltip
          position="is-left"
          label="AI powered process to create your NFT"
          class="navbar-item-tooltip">
          <nuxt-link data-cy="creative" :to="`/${urlPrefix}/creative`">
            {{ $t('creative') }}
          </nuxt-link>
        </b-tooltip>
      </b-dropdown-item>
    </template>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { getChainTestList } from '~/utils/constants'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import AuthMixin from '~~/utils/mixins/authMixin'

@Component({})
export default class NavbarCreate extends mixins(PrefixMixin, AuthMixin) {
  @Prop({ type: String }) chain!: string
  get options() {
    const availableUrlPrefixes = this.$store.getters['availableUrlPrefixes']

    if (!this.$config.dev) {
      return availableUrlPrefixes.filter(
        (urlPrefix) => !getChainTestList().includes(urlPrefix.value as string)
      )
    }
    return availableUrlPrefixes
  }
}
</script>