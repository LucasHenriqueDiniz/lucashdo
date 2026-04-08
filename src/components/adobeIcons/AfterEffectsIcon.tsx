/* eslint-disable react/jsx-props-no-spreading */
import Image from 'next/image';
import React from 'react';
import { AfterEffectsIcon as AfterEffectsSvg } from '../../../public';

export default function AfterEffectsIcon(props: React.ComponentProps<'span'>) {
  return (
    <span {...props}>
      <Image
        src={AfterEffectsSvg}
        alt="After Effects"
        width={24}
        height={24}
        style={{ display: 'inline-block' }}
      />
    </span>
  );
}
