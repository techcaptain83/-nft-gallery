<template>
  <div class="wallet-modal-container is-flex is-flex-direction-column">
    <header class="modal-card-head mb-4">
      <b-button
        v-show="hasSelectedWalletProvider"
        type="is-text"
        class="mr-2 is-no-border"
        icon-left="chevron-left"
        @click="hasSelectedWalletProvider = !hasSelectedWalletProvider" />
      <span class="modal-card-title is-size-6">
        {{ headerTitle }}
      </span>
      <a class="is-flex is-align-items-center" @click="emit('close')">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <line
            x1="0.33914"
            y1="0.632598"
            x2="13.3391"
            y2="12.6326"
            stroke="currentColor" />
          <line
            x1="0.646447"
            y1="12.6464"
            x2="12.6464"
            y2="0.646447"
            stroke="currentColor" />
        </svg>
      </a>
    </header>
    <section v-if="showAccount">
      <WalletAsset @back="setForceWalletSelect" />
    </section>
    <section v-else-if="hasUserWalletAuth" class="modal-card-body">
      <div class="buttons m-0">
        <WalletMenuItem
          v-for="(wallet, index) in installedWallet"
          :key="index"
          :wallet="wallet"
          @setAccount="setAccount" />
      </div>

      <a
        class="is-flex is-align-items-center pt-4 pb-3 is-size-7 has-text-grey more-option-button"
        @click="toggleShowUninstalledWallet">
        {{ $i18n.t('walletConnect.moreOption') }}

        <svg
          v-if="showUninstalledWallet"
          class="ml-1"
          width="9"
          height="4"
          viewBox="0 0 9 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.20068 0.5L4.60068 3.5L1.00068 0.5"
            stroke="currentColor"
            stroke-width="0.761905" />
        </svg>

        <svg
          v-else
          class="ml-1"
          width="5"
          height="8"
          viewBox="0 0 5 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 0.399658L4 3.99966L1 7.59966"
            stroke="currentColor"
            stroke-width="0.761905" />
        </svg>
      </a>
      <div v-if="showUninstalledWallet" class="buttons">
        <WalletMenuItem
          v-for="wallet in uninstalledWallet"
          :key="wallet.name"
          :wallet="wallet" />
      </div>
    </section>
    <section v-else class="modal-card-body p-4">
      <div class="mb-5">
        {{ $i18n.t('walletConnect.authText') }}
      </div>
      <b-field>
        <NeoButton
          size="medium"
          variant="k-accent"
          class="confirm-button"
          @click.native="setUserAuthValue">
          <span class="is-flex is-align-items-center is-justify-content-center">
            {{ $i18n.t('walletConnect.confirm') }}
            <svg
              class="ml-2"
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.675 1.5L3.5 2.67498L7.31667 6.49992L3.5 10.3249L4.675 11.4998L9.675 6.49992L4.675 1.5Z"
                fill="currentColor" />
            </svg>
          </span>
        </NeoButton>
      </b-field>
    </section>

    <footer v-if="!showAccount" class="px-5 py-4">
      <div>{{ $i18n.t('walletConnect.walletQuestion') }}</div>
      <div class="is-size-7">
        {{ $i18n.t('walletConnect.walletAnswer') }}
      </div>
      <a
        class="is-size-7 has-text-link is-flex is-align-items-center"
        href="https://docs.kodadot.xyz/tutorial-overview.html"
        target="_blank"
        rel="noopener noreferrer">
        <svg
          class="mr-2"
          width="9"
          height="10"
          viewBox="0 0 9 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.5 0.5C2.0187 0.5 0 2.5187 0 5C0 7.4813 2.0187 9.5 4.5 9.5C6.9813 9.5 9 7.4813 9 5C9 2.5187 6.9813 0.5 4.5 0.5ZM4.95 7.25H4.05V4.55H4.95V7.25ZM4.95 3.65H4.05V2.75H4.95V3.65Z"
            fill="#6188E7" />
        </svg>
        {{ $i18n.t('walletConnect.walletLink') }}
      </a>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { SupportedWallets } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import { NeoButton } from '@kodadot1/brick'
import WalletMenuItem from '@/components/common/ConnectWallet/WalletMenuItem'
import WalletAsset from '@/components/common/ConnectWallet/WalletAsset'

const { $store, $i18n } = useNuxtApp()
const selectedWalletProvider = ref<BaseDotsamaWallet>()
const hasSelectedWalletProvider = ref(false)
const account = ref<string>($store.getters.getAuthAddress)
const forceWalletSelect = ref(false)

const setForceWalletSelect = () => {
  forceWalletSelect.value = true
}

const showAccount = computed(() => account.value && !forceWalletSelect.value)

const wallets = SupportedWallets()
const headerTitle = computed(() =>
  $i18n.t(
    account.value
      ? 'walletConnect.walletDetails'
      : hasUserWalletAuth
      ? 'walletConnect.walletHeading'
      : 'walletConnect.warning'
  )
)
const setAccount = (addr: string) => {
  forceWalletSelect.value = false
  account.value = addr
}
const installedWallet = computed(() => {
  return wallets.filter((wallet) => wallet.installed)
})
const uninstalledWallet = computed(() => {
  return wallets.filter((wallet) => !wallet.installed)
})
const showUninstalledWallet = ref(!installedWallet.value.length)
const hasUserWalletAuth = ref(
  Boolean(localStorage.getItem('user_auth_wallet_add'))
)
const emit = defineEmits(['close'])

const toggleShowUninstalledWallet = () => {
  showUninstalledWallet.value = !showUninstalledWallet.value
}
watch(account, (account) => {
  forceWalletSelect.value = false
  $store.dispatch('setAuth', { address: account })
  localStorage.setItem('kodaauth', account)
  if (selectedWalletProvider.value) {
    localStorage.setItem('wallet', selectedWalletProvider.value.extensionName)
  }
})

const setUserAuthValue = () => {
  localStorage.setItem('user_auth_wallet_add', true.toString())
  hasUserWalletAuth.value = true
}
</script>
