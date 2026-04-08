/* eslint-disable react/jsx-props-no-spreading */
import Image from 'next/image';
import React from 'react';
import { PhotoshopIcon as PhotoshopSvg } from '../../../public';

export default function PhotoshopIcon(props: React.ComponentProps<'span'>) {
  return (
    <span {...props}>
      <Image
        src={PhotoshopSvg}
        alt="Photoshop"
        width={24}
        height={24}
        style={{ display: 'inline-block' }}
      />
    </span>
  );
}
