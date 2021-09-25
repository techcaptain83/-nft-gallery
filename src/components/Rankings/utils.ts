import i18n from '@/i18n';
import { Column, Row, SimpleRankingsNFT } from './types';
import formatBalance from '@/utils/formatBalance';
import store from '@/store';

export const columns: Column[] = [
  { field: 'id', label: i18n.t('spotlight.id') },
  { field: 'rank', label: i18n.t('spotlight.score'), numeric: true },
  { field: 'unique', label: i18n.t('spotlight.unique'), numeric: true },
  { field: 'averagePrice', label: 'Floor price', numeric: true},
  { field: 'collectors', label: i18n.t('spotlight.collectors'), numeric: true },
  { field: 'sold', label: i18n.t('spotlight.sold'), numeric: true },
  { field: 'total', label: i18n.t('spotlight.total'), numeric: true }
];

export const nftFn = (a: any): Row => {
  const sold = a.nfts.nodes.reduce(soldFn, 0);
  const unique = a.nfts.nodes.reduce(uniqueFn, new Set()).size;
  const uniqueCollectors = a.nfts.nodes.reduce(uniqueCollectorFn, new Set()).size;
  const total = a.nfts.totalCount;
  const averagePrice = a.nfts.nodes.filter(onlyOwned).reduce(sumFn, 0) / (a.nfts.nodes.length || 1)
  // const metaImage = fetchMetadataImage(a); DO NOT!

  const floorPrice = Math.min(
    ...a.nfts.nodes.map((nft: SimpleRankingsNFT) => Number(nft.price)).filter((price: number) => price > 0)
  );
  const events = a.nfts.nodes.filter(onlyEvents);
  const volume = events.map(onlyBuyEvents)
    .map((item: any, key: number) => {
      return (item.length && events[key]?.events?.find((e: {interaction: string}) => {
        return e.interaction === 'LIST';
      }).meta);
    })
    .reduce((a: number, b: number) => Number(a) + Number(b), 0);
    const weeklyVolume = events
      .map((event: []) => {
        return event.events.filter(
          (e: { interaction: string; timestamp: Date }) => {
            return (
              e.interaction === 'BUY' && new Date(e.timestamp) >= lastweekDate
            );
          }
        );
      })
      .map((item: any, key: number) => {
        return (
          item.length &&
          events[key]?.events?.find((e: { interaction: string }) => {
            return e.interaction === 'LIST';
          }).meta
        );
      })
      .reduce((a: number, b: number): number => Number(a) + Number(b), 0);

    const monthlyVolume = events
      .map((event: []) => {
        return event.events.filter((e: { interaction: string; timestamp: Date }) => {
          return (
            e.interaction === 'BUY' && new Date(e.timestamp) >= lastmonthDate
          );
        });
      })
      .map((item: any, key: number): any => {
        return (
          item.length &&
          events[key]?.events?.find((e: { interaction: string }) => {
            return e.interaction === 'LIST';
          }).meta
        );
      })
      .reduce((a: number, b: number): number => Number(a) + Number(b), 0);

  return {
    id: a.id,
    name: a.name,
    image: '', // NOPE
    metadata: a.metadata,
    volume,
    total,
    sold,
    unique,
    uniqueCollectors,
    averagePrice,
    floorPrice,
    weeklyVolume,
    monthlyVolume,
    collectors: 0, // a.nfts.nodes.reduce(uniqueCollectorFn, new Set()),
    rank: sold * (unique / total)
  };
};


const formatNumber = (val: SimpleRankingsNFT) =>
  Number(
    formatBalance(
      val.price,
      store.getters.getChainProperties.tokenDecimals,
      false,
      true
    )
  );
const sumFn = (acc: number, val: SimpleRankingsNFT) => acc + formatNumber(val);
const soldFn = (acc: number, val: SimpleRankingsNFT) => val.issuer !== val.currentOwner ? acc + 1 : acc;
const uniqueFn = (acc: Set<string>, val: SimpleRankingsNFT) => acc.add(val.metadata);
const uniqueCollectorFn = (acc: Set<string>, val: SimpleRankingsNFT) => val.issuer !== val.currentOwner ? acc.add(val.currentOwner) : acc
const onlyOwned = ({ issuer, currentOwner }: SimpleRankingsNFT) => issuer === currentOwner;
const onlyEvents = ({events}: SimpleRankingsNFT) => events
const onlyBuyEvents = ({events}: SimpleRankingsNFT) => events.filter((e: { interaction: string }) => e.interaction === 'BUY')
const onlyListEvents = ({events}: SimpleRankingsNFT) => events.filter((e: { interaction: string }) => e.interaction === 'LIST')
const onlyListMetaFn = (item: any, key: number) => {
  return (
    item.length &&
    events[key]?.events?.find((e: { interaction: string }) => {
      return e.interaction === 'LIST';
    }).meta
  );
};
// const flootPrice = (nfts: SimpleRankingsNFT) => Math.min(nfts)
const lastweekDate: Date = new Date(Date.now() - (1000 * 60 * 60 * 24 * 7));
const lastmonthDate: Date = new Date(Date.now() - (1000 * 60 * 60 * 24 * 30));
console.log(lastmonthDate)
// const collectionDailyTradedVolumeNumber = () => {
//   const sum = this.nftsEvents
//     .map(event => event.filter((e: { interaction: string; timestamp: Date }) => {
//       return (
//         e.interaction === 'BUY' && new Date(e.timestamp) >= this.yesterdayDate
//       );
//     }))
//     .map((item, key) => {
//       return (
//         item.length &&
//         this.nftsEvents[key].find((e: { interaction: string; }) => e.interaction === 'LIST').meta
//       );
//     })
//     .reduce((a, b) => Number(a) + Number(b), 0);
//   return sum;
// }
