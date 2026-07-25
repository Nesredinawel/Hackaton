import type { Region, Area } from './types'
import { IMG } from './images'

export const REGIONS: Region[] = [
  {
    id: 'addis-ababa',
    en: 'Addis Ababa',
    am: 'አዲስ አበባ',
    areas: [
      { id: 'addis-ababa', en: 'Addis Ababa', am: 'አዲስ አበባ', region: 'addis-ababa', lat: 9.0250, lng: 38.7469, zoom: 12, image: IMG.heroMarket },
    ],
  },
  {
    id: 'amhara',
    en: 'Amhara',
    am: 'አማራ',
    areas: [
      { id: 'bahir-dar', en: 'Bahir Dar', am: 'ባሕር ዳር', region: 'amhara', lat: 11.5943, lng: 37.3911, zoom: 12, image: IMG.vegetables },
      { id: 'gondar', en: 'Gondar', am: 'ጎንደር', region: 'amhara', lat: 12.6030, lng: 37.4523, zoom: 12, image: IMG.foodOverhead },
    ],
  },
  {
    id: 'oromia',
    en: 'Oromia',
    am: 'ኦሮሚያ',
    areas: [
      { id: 'adama', en: 'Adama', am: 'አዳማ', region: 'oromia', lat: 8.5400, lng: 39.2700, zoom: 12, image: IMG.electronics },
      { id: 'jimma', en: 'Jimma', am: 'ጅማ', region: 'oromia', lat: 7.6789, lng: 36.8340, zoom: 12, image: IMG.textiles },
    ],
  },
  {
    id: 'south-ethiopia',
    en: 'South Ethiopia',
    am: 'ደቡብ ኢትዮጵያ',
    areas: [
      { id: 'hawassa', en: 'Hawassa', am: 'ሐዋሳ', region: 'south-ethiopia', lat: 7.0621, lng: 38.4763, zoom: 12, image: IMG.household },
      { id: 'arba-minch', en: 'Arba Minch', am: 'አርባ ምንጭ', region: 'south-ethiopia', lat: 6.0389, lng: 37.5528, zoom: 12, image: IMG.health },
    ],
  },
  {
    id: 'dire-dawa',
    en: 'Dire Dawa',
    am: 'ድሬ ዳዋ',
    areas: [
      { id: 'dire-dawa', en: 'Dire Dawa', am: 'ድሬ ዳዋ', region: 'dire-dawa', lat: 9.5931, lng: 41.8520, zoom: 12, image: IMG.transport },
    ],
  },
  {
    id: 'harari',
    en: 'Harari',
    am: 'ሐረሪ',
    areas: [
      { id: 'harar', en: 'Harar', am: 'ሐረር', region: 'harari', lat: 9.3115, lng: 42.1199, zoom: 12, image: IMG.africaStreet },
    ],
  },
  {
    id: 'tigray',
    en: 'Tigray',
    am: 'ትግራይ',
    areas: [
      { id: 'mekelle', en: 'Mekelle', am: 'መቀሌ', region: 'tigray', lat: 13.4967, lng: 39.4753, zoom: 12, image: IMG.heroMarket },
    ],
  },
]

export const ALL_AREAS: Area[] = REGIONS.flatMap(r => r.areas)

export const getAreaById = (id: string): Area | undefined =>
  ALL_AREAS.find(a => a.id === id)

export const getRegionByAreaId = (areaId: string): Region | undefined =>
  REGIONS.find(r => r.areas.some(a => a.id === areaId))

export const DEFAULT_AREA = ALL_AREAS[0] // Addis Ababa
