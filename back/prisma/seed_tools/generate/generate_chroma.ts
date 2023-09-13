import { PrismaClient, Chroma } from '@prisma/client';
import { rand } from './random';

const prisma = new PrismaClient();
export type colorStop = { offset: number; color: string };

export interface chromaGradient {
  name: string;
  stops: colorStop[];
}

export const gradients: chromaGradient[] = [
  {
    name: 'LavaLevel',
    stops: [
      { offset: 0, color: '#FF6B6B' },
      { offset: 0.5, color: '#FFD166' },
      { offset: 1, color: '#4ECDC4' },
    ],
  },
  {
    name: 'DeepSeaTreasure',
    stops: [
      { offset: 0, color: '#001F54' },
      { offset: 0.8, color: '#0288D1' },
      { offset: 1, color: '#B3E5FC' },
    ],
  },
  {
    name: 'EnchantedForest',
    stops: [
      { offset: 0, color: '#2E8B57' },
      { offset: 1, color: '#006400' },
    ],
  },
  {
    name: 'UnicornMeadow',
    stops: [
      { offset: 0, color: '#E27D60' },
      { offset: 0.2, color: '#85DCB0' },
      { offset: 0.4, color: '#E8A87C' },
      { offset: 0.6, color: '#C38D9E' },
      { offset: 0.8, color: '#41B3A3' },
      { offset: 1, color: '#DFFF00' },
    ],
  },
  {
    name: 'SpookyCave',
    stops: [
      { offset: 0, color: '#000000' },
      { offset: 1, color: '#FFFFFF' },
    ],
  },
];

export const generate_chroma = async () => {
  const data: Chroma[] = gradients.map((gradient) => {
    return {
      id: gradient.name,
      fill: JSON.stringify(gradient.stops),
      isGradient: true,
      price: 42,
    };
  });
  return await prisma.chroma.createMany({
    data,
  });
};
